import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { dateFormat } from '@i18n';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  estimateGas,
  getAccount,
  getCapabilities,
  readContracts,
  sendCalls,
  sendTransaction,
  waitForCallsStatus,
  waitForTransactionReceipt,
} from '@wagmi/core';
import { type Address, type Hex, encodeFunctionData } from 'viem';
import { useAccount, useCapabilities, useConfig } from 'wagmi';

import {
  stakingAbi,
  useReadNetworkControllerEpochLength,
  useReadNetworkControllerWorkerEpochLength,
  useReadRouterNetworkController,
  useReadRouterStaking,
  vestingAbi,
} from '@api/contracts';
import { isUserRejection } from '@api/contracts/utils';
import { AccountType, WorkerStatus } from '@api/subsquid-network-squid';
import { trpc } from '@api/trpc';
import { ContractCallDialog } from '@components/ContractCallDialog';
import {
  DAY_MS,
  l1BlockToTimestamp,
  nextDelegationLockEnd,
} from '@components/Worker/delegationLock';
import { useContracts } from '@hooks/network/useContracts';
import { getChain } from '@hooks/network/useSubsquidNetwork';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';

// One wallet-bundled transaction carries at most this many re-locks (about 100k gas each).
const BUNDLE_SIZE = 100;
// How many delegations are checked against the chain at once before anything is sent.
const PREFLIGHT_CONCURRENCY = 10;

export type RelockWorker = {
  id: string;
  name?: string | null;
  peerId: string;
  status?: string | null;
  delegations: {
    owner: { id: string; type: AccountType };
    deposit: string;
    locked?: boolean | null;
    lockEnd?: number | null;
  }[];
};

type RelockItem = {
  key: string;
  workerId: string;
  workerName: string;
  ownerId: Address;
  ownerType: AccountType;
  deposit: string;
  locked: boolean;
  lockEnd?: number | null;
  /** Why this delegation cannot be re-locked, if it cannot. */
  blocked?: string;
};

type ItemState = 'waiting' | 'confirmed' | 'failed' | 'unknown';
type Phase = 'select' | 'running' | 'finished';
type Call = { to: Address; data: Hex };

/** Stops the run with a message meant for the user. */
class RunStopped extends Error {}

const WALLET_LOCKED = /controller is locked|wallet is locked/i;

function describeError(e: unknown): string {
  if (e instanceof RunStopped) return e.message;
  if (isUserRejection(e)) return 'Stopped: the request was rejected in the wallet.';

  const message =
    (e as { shortMessage?: string })?.shortMessage || (e instanceof Error ? e.message : String(e));
  // MetaMask reports a locked extension as an internal error with this text.
  if (WALLET_LOCKED.test(message) || WALLET_LOCKED.test(String(e))) {
    return 'Your wallet is locked. Unlock it, then continue. Nothing was sent.';
  }

  return message;
}

function shortReason(e: unknown): string {
  const message = describeError(e).split('\n')[0];

  return message.length > 80 ? `${message.slice(0, 77)}…` : message;
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function ownerLabel(type: AccountType) {
  if (type === AccountType.User) return 'wallet';
  if (type === AccountType.Vesting) return 'vesting';

  return 'temporary holding';
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

function sameAddress(a?: string, b?: string) {
  return !!a && !!b && a.toLowerCase() === b.toLowerCase();
}

/**
 * A zero-amount deposit moves no SQD but makes the contract write a new unlock block for the
 * whole delegation. It has to come from the account that holds the delegation: the wallet
 * itself, or a vesting contract called by its owner.
 */
function buildCall(item: RelockItem, staking: Address): Call {
  const deposit = encodeFunctionData({
    abi: stakingAbi,
    functionName: 'deposit',
    args: [BigInt(item.workerId), 0n],
  });
  if (item.ownerType === AccountType.User) return { to: staking, data: deposit };

  return {
    to: item.ownerId,
    data: encodeFunctionData({
      abi: vestingAbi,
      functionName: 'execute',
      args: [staking, deposit],
    } as Parameters<typeof encodeFunctionData>[0]),
  };
}

export function RelockAllButton({
  workers,
  disabled,
}: {
  workers?: RelockWorker[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const hasDelegations = !!workers?.some(w =>
    w.delegations.some(d => BigInt(d.deposit || '0') > 0n),
  );

  return (
    <>
      <Button
        loading={open}
        onClick={() => setOpen(true)}
        variant="contained"
        color="info"
        disabled={disabled || !hasDelegations}
      >
        RE-LOCK ALL
      </Button>
      {open && <RelockAllDialog workers={workers || []} onClose={() => setOpen(false)} />}
    </>
  );
}

function RelockAllDialog({ workers, onClose }: { workers: RelockWorker[]; onClose: () => void }) {
  const config = useConfig();
  const { address, chainId, connector } = useAccount();
  const contracts = useContracts();
  const { SQD_TOKEN } = contracts;
  const { setWaitHeight } = useSquidHeight();

  const appChain = getChain();

  // The list below belongs to the account that opened the dialog. Every transaction is sent
  // from that account and nothing else.
  const [account] = useState(() => address);
  const accountChanged = !sameAddress(address, account);
  const wrongChain = chainId !== appChain.id;

  const { data: stakingAddress } = useReadRouterStaking({ address: contracts.ROUTER });
  const { data: networkControllerAddress } = useReadRouterNetworkController({
    address: contracts.ROUTER,
  });
  // NetworkController.epochLength() is the lock period in L1 blocks; workerEpochLength() is the
  // length of one worker epoch.
  const { data: lockPeriod } = useReadNetworkControllerEpochLength({
    address: networkControllerAddress,
    query: { enabled: !!networkControllerAddress },
  });
  const { data: workerEpochLength } = useReadNetworkControllerWorkerEpochLength({
    address: networkControllerAddress,
    query: { enabled: !!networkControllerAddress },
  });
  const { data: currentEpoch } = useQuery(
    trpc.network.currentEpoch.queryOptions(undefined, { refetchInterval: 12_000 }),
  );

  // Only used for the hint under the list. The run asks the wallet again right before sending,
  // because a locked wallet cannot say what it supports.
  const {
    data: capabilities,
    isLoading: isCapabilitiesLoading,
    refetch: refetchCapabilities,
  } = useCapabilities({ account, query: { retry: false } });
  const atomicStatus = capabilities?.[appChain.id]?.atomic?.status;
  const canBundle = atomicStatus === 'supported' || atomicStatus === 'ready';

  const newLock = useMemo(() => {
    if (!currentEpoch || lockPeriod === undefined || !Number(workerEpochLength)) return;

    const lockEnd = nextDelegationLockEnd({
      lastBlockL1: currentEpoch.lastBlockL1,
      workerEpochLength: Number(workerEpochLength),
      lockPeriod: Number(lockPeriod),
    });
    const unlock = l1BlockToTimestamp(lockEnd, currentEpoch);

    return {
      lockEnd,
      unlock,
      days: Math.round((unlock - new Date(currentEpoch.lastBlockTimestampL1).getTime()) / DAY_MS),
    };
  }, [currentEpoch, lockPeriod, workerEpochLength]);

  // The list is fixed when the dialog opens, so rows do not move or vanish while it is in use.
  const [items] = useState<RelockItem[]>(() =>
    workers.flatMap(w =>
      w.delegations
        .filter(d => BigInt(d.deposit || '0') > 0n)
        .map(d => ({
          key: `${w.id}:${d.owner.id.toLowerCase()}`,
          workerId: w.id,
          workerName: w.name || w.peerId,
          ownerId: d.owner.id as Address,
          ownerType: d.owner.type,
          deposit: d.deposit,
          locked: !!d.locked,
          lockEnd: d.lockEnd,
          // Staking.deposit reverts for a worker that is not active.
          blocked: w.status === WorkerStatus.Active ? undefined : 'worker not active',
        })),
    ),
  );

  const [ticks, setTicks] = useState<Record<string, boolean>>({});
  const [phase, setPhase] = useState<Phase>('select');
  const [states, setStates] = useState<Record<string, ItemState>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [stopping, setStopping] = useState(false);
  const [bundleFailed, setBundleFailed] = useState(false);
  const stopRequested = useRef(false);
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  // If the wallet switches to another account, this list is no longer theirs to re-lock.
  useEffect(() => {
    if (!accountChanged) return;

    stopRequested.current = true;
    if (phase === 'running') setStopping(true);
    else onClose();
  }, [accountChanged, phase, onClose]);

  // A delegation already locked until the new date gains nothing from another re-lock.
  const isAtNewDate = useCallback(
    (item: RelockItem) =>
      !!newLock && item.locked && !!item.lockEnd && item.lockEnd >= newLock.lockEnd,
    [newLock],
  );
  const isTicked = useCallback(
    (item: RelockItem) => !item.blocked && (ticks[item.key] ?? !isAtNewDate(item)),
    [ticks, isAtNewDate],
  );

  const chosen = useMemo(() => items.filter(isTicked), [items, isTicked]);
  const remaining = useMemo(
    () => chosen.filter(i => states[i.key] !== 'confirmed'),
    [chosen, states],
  );
  const confirmedCount = items.filter(i => states[i.key] === 'confirmed').length;
  const chosenTotal = chosen.reduce((sum, i) => sum + BigInt(i.deposit), 0n);

  const run = useCallback(async () => {
    if (!stakingAddress || !account || !remaining.length) return;

    const staking = stakingAddress;
    const queue = remaining;

    stopRequested.current = false;
    setStopping(false);
    setError(undefined);
    setNotice(undefined);
    setPhase('running');

    let lastBlock: bigint | undefined;
    const sawBlock = (block: bigint) => {
      if (lastBlock === undefined || block > lastBlock) lastBlock = block;
    };
    const ui = (fn: () => void) => {
      if (mounted.current) fn();
    };
    const mark = (list: RelockItem[], state: ItemState | undefined, note?: string) =>
      ui(() => {
        setStates(prev => {
          const next = { ...prev };
          for (const i of list) {
            if (state) next[i.key] = state;
            else delete next[i.key];
          }
          return next;
        });
        setNotes(prev => {
          const next = { ...prev };
          for (const i of list) {
            if (note) next[i.key] = note;
            else delete next[i.key];
          }
          return next;
        });
      });

    // Checked before every request to the wallet.
    const assertSameWallet = () => {
      const current = getAccount(config);
      if (!sameAddress(current.address, account)) {
        throw new RunStopped(
          'The wallet switched to another account, so the run was stopped. Nothing more was sent.',
        );
      }
      if (current.chainId !== appChain.id) {
        throw new RunStopped(
          `The wallet is not on ${appChain.name}, so the run was stopped. Nothing more was sent.`,
        );
      }
    };

    // The chain is the source of truth for what is done: a delegation whose unlock block moved
    // past the one it had when the dialog opened has been re-locked. Returns what is still to do.
    const reconcile = async (list: RelockItem[]) => {
      if (!list.length) return list;

      const results = await readContracts(config, {
        allowFailure: true,
        contracts: list.map(i => ({
          abi: stakingAbi,
          address: staking,
          functionName: 'getDeposit' as const,
          args: [i.ownerId, BigInt(i.workerId)] as const,
          chainId: appChain.id,
        })),
      }).catch(() => undefined);
      if (!results) return list;

      const done: RelockItem[] = [];
      const left: RelockItem[] = [];
      list.forEach((item, n) => {
        const result = results[n]?.result as readonly [bigint, bigint] | undefined;
        if (result && Number(result[1]) > (item.lockEnd ?? 0)) done.push(item);
        else left.push(item);
      });
      if (done.length) mark(done, 'confirmed');

      return left;
    };

    try {
      // A locked wallet rejects a bundle outright instead of asking for its password. Asking for
      // the accounts first makes it show its unlock screen, and resolves once it is unlocked.
      const provider = (await connector?.getProvider?.()) as
        | {
            request?: (args: { method: string }) => Promise<unknown>;
            _metamask?: { isUnlocked?: () => Promise<boolean> };
          }
        | undefined;
      const unlocked = await provider?._metamask?.isUnlocked?.().catch(() => true);
      if (unlocked === false) ui(() => setNotice('Your wallet is locked. Unlock it to continue…'));
      await provider?.request?.({ method: 'eth_requestAccounts' });
      assertSameWallet();

      // Skip anything an earlier attempt already re-locked, even if the wallet never said so.
      ui(() => setNotice('Checking your delegations…'));
      let todo = await reconcile(queue);

      // Find the ones that would fail before the wallet is asked to sign anything.
      const passing: RelockItem[] = [];
      for (const batch of chunk(todo, PREFLIGHT_CONCURRENCY)) {
        const checks = await Promise.all(
          batch.map(item =>
            estimateGas(config, { account, chainId: appChain.id, ...buildCall(item, staking) })
              .then(() => undefined)
              .catch((e: unknown) => shortReason(e)),
          ),
        );
        batch.forEach((item, n) => {
          const reason = checks[n];
          if (reason === undefined) passing.push(item);
          else mark([item], 'failed', reason);
        });
      }
      todo = passing;

      // Ask the wallet what it supports now that it is unlocked.
      let bundle = false;
      if (!bundleFailed && todo.length) {
        const status = await getCapabilities(config, { account })
          .then(
            c =>
              (c as Record<number, { atomic?: { status?: string } }>)[appChain.id]?.atomic?.status,
          )
          .catch(() => undefined);
        bundle = status === 'supported' || status === 'ready';
        refetchCapabilities();
      }

      if (bundle) {
        for (const batch of chunk(todo, BUNDLE_SIZE)) {
          if (stopRequested.current) break;
          assertSameWallet();

          mark(batch, 'waiting');
          ui(() =>
            setNotice(
              `Confirm in your wallet: one transaction re-locking ${batch.length} delegation${batch.length === 1 ? '' : 's'}.`,
            ),
          );
          // forceAtomic: either every re-lock in the batch happens or none does.
          const { id } = await sendCalls(config, {
            account,
            chainId: appChain.id,
            calls: batch.map(i => buildCall(i, staking)),
            forceAtomic: true,
          });

          ui(() => setNotice('Waiting for the transaction to be confirmed…'));
          const result = await waitForCallsStatus(config, { id, timeout: 180_000 }).catch(
            () => undefined,
          );
          if (result?.status === 'success') {
            mark(batch, 'confirmed');
            for (const receipt of result.receipts || []) sawBlock(receipt.blockNumber);
            continue;
          }

          // Failed, timed out or not reported: let the chain say what happened.
          const left = await reconcile(batch);
          if (!left.length) continue;

          if (result?.status === 'failure') {
            mark(left, 'failed', 'batch failed');
            ui(() => setBundleFailed(true));
            throw new RunStopped(
              'The batch transaction failed, so none of the delegations in it were re-locked. Retrying sends them one by one.',
            );
          }
          mark(left, 'unknown');
          throw new RunStopped(
            'The wallet has not reported the result of the batch yet. Its delegations are marked "status unknown". Retrying checks the chain first, so nothing is sent twice.',
          );
        }
      } else {
        let n = 0;
        for (const item of todo) {
          if (stopRequested.current) break;
          assertSameWallet();

          n++;
          mark([item], 'waiting');
          ui(() => setNotice(`Confirm in your wallet: delegation ${n} of ${todo.length}.`));
          try {
            const hash = await sendTransaction(config, {
              account,
              chainId: appChain.id,
              ...buildCall(item, staking),
            });
            const receipt = await waitForTransactionReceipt(config, {
              hash,
              chainId: appChain.id,
            });
            if (receipt.status === 'reverted') {
              mark([item], 'failed', 'transaction reverted');
              continue;
            }
            mark([item], 'confirmed');
            sawBlock(receipt.blockNumber);
          } catch (e) {
            // A rejection, a locked wallet or a changed account ends the run. Any other failure
            // is noted on its row and the run carries on with the rest.
            if (isUserRejection(e) || WALLET_LOCKED.test(String(e))) {
              mark([item], undefined);
              throw e;
            }
            assertSameWallet();
            mark([item], 'failed', shortReason(e));
          }
        }
      }
    } catch (e) {
      ui(() => {
        // Anything still waiting for the wallet did not go out.
        setStates(prev =>
          Object.fromEntries(Object.entries(prev).filter(([, state]) => state !== 'waiting')),
        );
        setError(describeError(e));
      });
    } finally {
      if (lastBlock !== undefined) setWaitHeight(lastBlock, []);
      ui(() => {
        setNotice(undefined);
        setStopping(false);
        setPhase('finished');
      });
    }
  }, [
    stakingAddress,
    account,
    remaining,
    config,
    connector,
    appChain.id,
    appChain.name,
    bundleFailed,
    setWaitHeight,
    refetchCapabilities,
  ]);

  const isReady = !!stakingAddress && !!newLock && !isCapabilitiesLoading && !wrongChain;
  const failedCount = remaining.filter(i => states[i.key] === 'failed').length;

  const confirmButtonText =
    phase === 'running'
      ? 'RE-LOCKING…'
      : !remaining.length
        ? 'CLOSE'
        : phase === 'finished'
          ? `RE-LOCK REMAINING ${remaining.length}`
          : `RE-LOCK ${remaining.length} DELEGATION${remaining.length === 1 ? '' : 'S'}`;

  return (
    <ContractCallDialog
      title="Re-lock delegations"
      open
      minWidth={680}
      maxWidth={760}
      loading={phase === 'running'}
      hideCancelButton={false}
      cancelButtonText={phase === 'running' ? (stopping ? 'CLOSE' : 'STOP') : 'CANCEL'}
      confirmButtonText={confirmButtonText}
      disableBackdropClick
      disableConfirmButton={phase !== 'running' && remaining.length > 0 && !isReady}
      onResult={confirmed => {
        if (!confirmed) {
          // The first press asks the run to stop before the next transaction. If the wallet
          // never answers, a second press closes the dialog; a late answer is ignored.
          if (phase === 'running' && !stopping) {
            stopRequested.current = true;
            setStopping(true);
            return;
          }
          return onClose();
        }
        if (phase === 'running') return;
        if (!remaining.length) return onClose();

        run();
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
          <Table size="small">
            <TableBody>
              {items.map(item => {
                const state = states[item.key];

                return (
                  <TableRow key={item.key}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={state === 'confirmed' || isTicked(item)}
                        disabled={!!item.blocked || phase === 'running' || state === 'confirmed'}
                        onChange={e =>
                          setTicks(prev => ({ ...prev, [item.key]: e.target.checked }))
                        }
                      />
                    </TableCell>
                    <TableCell>{item.workerName}</TableCell>
                    <TableCell>
                      {ownerLabel(item.ownerType)} {shortAddress(item.ownerId)}
                    </TableCell>
                    <TableCell align="right">
                      {tokenFormatter(fromSqd(item.deposit), SQD_TOKEN)}
                    </TableCell>
                    <TableCell align="right">
                      {item.blocked
                        ? `${item.blocked}, cannot be re-locked`
                        : state === 'confirmed'
                          ? 're-locked'
                          : state === 'waiting'
                            ? 'confirm in your wallet…'
                            : state === 'unknown'
                              ? 'status unknown'
                              : state === 'failed'
                                ? `not re-locked${notes[item.key] ? `: ${notes[item.key]}` : ''}`
                                : !item.locked || !item.lockEnd
                                  ? 'unlocked'
                                  : isAtNewDate(item)
                                    ? 'already locked until the new date'
                                    : currentEpoch
                                      ? `locked until ${dateFormat(l1BlockToTimestamp(item.lockEnd, currentEpoch), 'date')}`
                                      : 'locked'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>

        <Stack spacing={0.5}>
          <Typography variant="body2">
            {phase === 'select'
              ? `${chosen.length} of ${items.length} delegations selected · ${tokenFormatter(fromSqd(chosenTotal), SQD_TOKEN)}`
              : `${confirmedCount} re-locked · ${remaining.length} left${failedCount ? ` (${failedCount} could not be re-locked)` : ''}`}
          </Typography>
          <Typography variant="body2">
            New unlock:{' '}
            {newLock ? (
              `around ${dateFormat(newLock.unlock, 'date')} (about ${newLock.days} days from now)`
            ) : (
              <Skeleton width={220} sx={{ display: 'inline-block' }} />
            )}
          </Typography>
          {phase === 'select' && !isCapabilitiesLoading && chosen.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {canBundle
                ? chosen.length > BUNDLE_SIZE
                  ? `Your wallet can bundle these: ${Math.ceil(chosen.length / BUNDLE_SIZE)} transactions to confirm.`
                  : 'Your wallet can bundle these into one transaction to confirm.'
                : `Your wallet will ask you to confirm ${chosen.length} transaction${chosen.length === 1 ? '' : 's'}, one per delegation.`}
            </Typography>
          )}
        </Stack>

        {wrongChain && phase !== 'running' && (
          <Alert severity="info">Switch your wallet to {appChain.name} to continue.</Alert>
        )}
        {stopping && (
          <Alert severity="info">
            Stopping before the next transaction. If one is already open in your wallet, it can
            still go through if you confirm it there.
          </Alert>
        )}
        {notice && !stopping && <Alert severity="info">{notice}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        {phase === 'finished' && !remaining.length && confirmedCount > 0 ? (
          <Alert severity="success">
            All selected delegations are re-locked. The list updates once the indexer has caught up.
          </Alert>
        ) : (
          <Alert severity="warning">
            This locks every selected delegation in full: you will not be able to undelegate any of
            it until the new unlock date. No {SQD_TOKEN} leaves your accounts. This cannot be
            undone.
          </Alert>
        )}
      </Stack>
    </ContractCallDialog>
  );
}

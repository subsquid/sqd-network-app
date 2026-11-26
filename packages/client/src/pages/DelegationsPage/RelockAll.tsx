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
import { sendCalls, waitForCallsStatus } from '@wagmi/core';
import { type Address, encodeFunctionData } from 'viem';
import { useAccount, useCapabilities, useConfig } from 'wagmi';

import {
  stakingAbi,
  useReadNetworkControllerEpochLength,
  useReadNetworkControllerWorkerEpochLength,
  useReadRouterNetworkController,
  useReadRouterStaking,
  vestingAbi,
} from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage, isUserRejection } from '@api/contracts/utils';
import { AccountType, WorkerStatus } from '@api/subsquid-network-squid';
import { trpc } from '@api/trpc';
import { ContractCallDialog } from '@components/ContractCallDialog';
import {
  DAY_MS,
  l1BlockToTimestamp,
  nextDelegationLockEnd,
} from '@components/Worker/delegationLock';
import { useContracts } from '@hooks/network/useContracts';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';

// One wallet-bundled transaction carries at most this many re-locks (about 100k gas each).
const BUNDLE_SIZE = 100;

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
  ownerId: string;
  ownerType: AccountType;
  deposit: string;
  locked: boolean;
  lockEnd?: number | null;
  /** Why this delegation cannot be re-locked, if it cannot. */
  blocked?: string;
};

type ItemState = 'waiting' | 'confirmed' | 'failed';
type Phase = 'select' | 'running' | 'finished';

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
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
  const { address, chainId } = useAccount();
  const contracts = useContracts();
  const { SQD_TOKEN } = contracts;
  const { setWaitHeight } = useSquidHeight();
  const { writeTransactionAsync } = useWriteSQDTransaction();

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

  // Wallets that can bundle calls report it here; wallets that cannot either say so or reject
  // the request, and both mean "send one by one".
  const { data: capabilities } = useCapabilities({ account: address, query: { retry: false } });
  const atomicStatus = chainId ? capabilities?.[chainId]?.atomic?.status : undefined;
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
          ownerId: d.owner.id,
          ownerType: d.owner.type,
          deposit: d.deposit,
          locked: !!d.locked,
          lockEnd: d.lockEnd,
          // Staking.deposit reverts for a worker that is not active.
          blocked: w.status === WorkerStatus.Active ? undefined : 'worker not active',
        })),
    ),
  );

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(items.filter(i => !i.blocked).map(i => i.key)),
  );
  const [phase, setPhase] = useState<Phase>('select');
  const [states, setStates] = useState<Record<string, ItemState>>({});
  const [error, setError] = useState<string>();
  const [bundleFailed, setBundleFailed] = useState(false);
  const stopRequested = useRef(false);
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  const chosen = useMemo(
    () => items.filter(i => !i.blocked && selected.has(i.key)),
    [items, selected],
  );
  const remaining = useMemo(
    () => chosen.filter(i => states[i.key] !== 'confirmed'),
    [chosen, states],
  );
  const confirmedCount = chosen.length - remaining.length;
  const chosenTotal = chosen.reduce((sum, i) => sum + BigInt(i.deposit), 0n);

  const buildCall = useCallback((item: RelockItem, staking: Address) => {
    // A zero-amount deposit moves no SQD but makes the contract write a new unlock block for
    // the whole delegation. It has to come from the account that holds the delegation.
    const deposit = encodeFunctionData({
      abi: stakingAbi,
      functionName: 'deposit',
      args: [BigInt(item.workerId), 0n],
    });
    if (item.ownerType === AccountType.User) return { to: staking, data: deposit };

    return {
      to: item.ownerId as Address,
      data: encodeFunctionData({
        abi: vestingAbi,
        functionName: 'execute',
        args: [staking, deposit],
      } as Parameters<typeof encodeFunctionData>[0]),
    };
  }, []);

  const run = useCallback(
    async (mode: 'bundle' | 'sequence') => {
      if (!stakingAddress || !remaining.length) return;

      stopRequested.current = false;
      setError(undefined);
      setBundleFailed(false);
      setPhase('running');

      let lastBlock: bigint | undefined;
      const mark = (keys: string[], state: ItemState) =>
        mounted.current &&
        setStates(prev => ({ ...prev, ...Object.fromEntries(keys.map(k => [k, state])) }));

      try {
        if (mode === 'bundle') {
          for (const batch of chunk(remaining, BUNDLE_SIZE)) {
            if (stopRequested.current) break;

            const keys = batch.map(i => i.key);
            mark(keys, 'waiting');
            // forceAtomic: either every re-lock in the batch happens or none does.
            const { id } = await sendCalls(config, {
              calls: batch.map(i => buildCall(i, stakingAddress)),
              forceAtomic: true,
            });
            const result = await waitForCallsStatus(config, { id, timeout: 180_000 });
            if (result.status !== 'success') {
              mark(keys, 'failed');
              setBundleFailed(true);
              throw new Error(
                'The batch transaction failed, so none of the delegations in it were re-locked.',
              );
            }
            mark(keys, 'confirmed');
            for (const receipt of result.receipts || []) {
              if (lastBlock === undefined || receipt.blockNumber > lastBlock) {
                lastBlock = receipt.blockNumber;
              }
            }
          }
        } else {
          for (const item of remaining) {
            if (stopRequested.current) break;

            mark([item.key], 'waiting');
            try {
              const receipt = await writeTransactionAsync({
                abi: stakingAbi,
                address: stakingAddress,
                functionName: 'deposit',
                args: [BigInt(item.workerId), 0n],
                vesting:
                  item.ownerType === AccountType.User ? undefined : (item.ownerId as Address),
              });
              mark([item.key], 'confirmed');
              lastBlock = receipt.blockNumber;
            } catch (e) {
              mark([item.key], 'failed');
              throw e;
            }
          }
        }
      } catch (e) {
        if (mounted.current) {
          // Anything still waiting for the wallet did not go out.
          setStates(prev =>
            Object.fromEntries(
              Object.entries(prev).map(([k, v]) => [k, v === 'waiting' ? 'failed' : v]),
            ),
          );
          setError(
            isUserRejection(e)
              ? 'Stopped: the transaction was rejected in the wallet.'
              : e instanceof Error
                ? e.message
                : errorMessage(e, [stakingAbi]),
          );
          if (mode === 'bundle' && !isUserRejection(e)) setBundleFailed(true);
        }
      } finally {
        if (lastBlock !== undefined) setWaitHeight(lastBlock, []);
        if (mounted.current) setPhase('finished');
      }
    },
    [stakingAddress, remaining, config, buildCall, writeTransactionAsync, setWaitHeight],
  );

  const allDone = phase === 'finished' && remaining.length === 0;
  const isReady = !!stakingAddress && !!newLock;

  const confirmButtonText =
    phase === 'running'
      ? 'RE-LOCKING…'
      : allDone || !remaining.length
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
      cancelButtonText={phase === 'running' ? 'STOP' : 'CANCEL'}
      confirmButtonText={confirmButtonText}
      disableBackdropClick
      disableConfirmButton={phase !== 'running' && remaining.length > 0 && !isReady}
      onResult={confirmed => {
        if (!confirmed) {
          // While transactions are going out, "cancel" only stops before the next one.
          if (phase === 'running') {
            stopRequested.current = true;
            return;
          }
          return onClose();
        }
        if (phase === 'running') return;
        if (!remaining.length) return onClose();

        run(canBundle && !bundleFailed ? 'bundle' : 'sequence');
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
          <Table size="small">
            <TableBody>
              {items.map(item => {
                const state = states[item.key];
                const alreadyAtNewDate =
                  !!newLock && item.locked && !!item.lockEnd && item.lockEnd >= newLock.lockEnd;

                return (
                  <TableRow key={item.key}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={!item.blocked && selected.has(item.key)}
                        disabled={!!item.blocked || phase !== 'select'}
                        onChange={e =>
                          setSelected(prev => {
                            const next = new Set(prev);
                            if (e.target.checked) next.add(item.key);
                            else next.delete(item.key);
                            return next;
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>{item.workerName}</TableCell>
                    <TableCell>
                      {item.ownerType === AccountType.User ? 'wallet' : 'vesting'}{' '}
                      {shortAddress(item.ownerId)}
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
                            : state === 'failed'
                              ? 'not re-locked'
                              : !item.locked || !item.lockEnd
                                ? 'unlocked'
                                : alreadyAtNewDate
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
              : `${confirmedCount} of ${chosen.length} delegations re-locked`}
          </Typography>
          <Typography variant="body2">
            New unlock:{' '}
            {newLock ? (
              `around ${dateFormat(newLock.unlock, 'date')} (about ${newLock.days} days from now)`
            ) : (
              <Skeleton width={220} sx={{ display: 'inline-block' }} />
            )}
          </Typography>
          {phase === 'select' && (
            <Typography variant="body2" color="text.secondary">
              {canBundle
                ? chosen.length > BUNDLE_SIZE
                  ? `Your wallet can bundle these: ${Math.ceil(chosen.length / BUNDLE_SIZE)} transactions to confirm.`
                  : 'Your wallet can bundle these into one transaction to confirm.'
                : `Your wallet will ask you to confirm ${chosen.length} transaction${chosen.length === 1 ? '' : 's'}, one per delegation.`}
            </Typography>
          )}
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}
        {allDone ? (
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

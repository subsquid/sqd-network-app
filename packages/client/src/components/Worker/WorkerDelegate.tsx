import { useCallback, useMemo, useState } from 'react';

import { dateFormat } from '@i18n';
import { Alert, Button, Chip, Skeleton, Stack, Typography } from '@mui/material';
import * as yup from '@schema';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { useDebounce } from 'use-debounce';

import {
  stakingAbi,
  useReadNetworkControllerEpochLength,
  useReadNetworkControllerWorkerEpochLength,
  useReadRouterNetworkController,
  useReadRouterStaking,
} from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import {
  AccountType,
  SourceWalletWithBalance,
  Worker,
  WorkerStatus,
} from '@api/subsquid-network-squid';
import { trpc } from '@api/trpc';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormDivider, FormRow, FormikSelect, FormikTextInput } from '@components/Form';
import { HelpTooltip } from '@components/HelpTooltip';
import { SourceWalletOption } from '@components/SourceWallet';
import { useContracts } from '@hooks/network/useContracts';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { percentFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd, toSqd } from '@lib/network/utils';

import { parseDelegationAmount } from './delegationAmount';
import { DAY_MS, L1_BLOCK_TIME_MS, nextDelegationLockEnd } from './delegationLock';

export const EXPECTED_APR_TIP = (
  <span>
    An estimated delegation APR. The realized APR may differ significantly and depends on the worker
    uptime and the total amount of SQD delegated to the worker, which may change over time.
  </span>
);

export const delegateSchema = yup.object({
  source: yup.string().label('Source').trim().required().typeError('${path} is invalid'),
  amount: yup
    .decimal()
    .label('Amount')
    .required()
    // 0 is allowed here; the form's validate() decides when a zero amount makes sense.
    .min('0')
    .max(yup.ref('max'), 'Insufficient balance')
    .typeError('${path} is invalid'),
  max: yup.string().label('Max').required().typeError('${path} is invalid'),
});

/** An account that already holds a delegation on the worker, with the delegated amount. */
export type DelegationHolder = { id: string; balance: string };

export function WorkerDelegate({
  sources,
  worker,
  disabled,
  variant = 'outlined',
  delegations,
}: {
  sources?: SourceWalletWithBalance[];
  worker?: Pick<Worker, 'id' | 'status'>;
  variant?: 'outlined' | 'contained';
  disabled?: boolean;
  /**
   * The user's accounts that hold a delegation on this worker. Only these can send a 0 SQD
   * delegation, which moves no tokens and restarts the lock on the existing delegation.
   */
  delegations?: DelegationHolder[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        loading={open}
        disabled={disabled || !worker || worker.status !== WorkerStatus.Active}
        onClick={() => setOpen(true)}
        variant={variant}
        color={variant === 'contained' ? 'info' : 'secondary'}
      >
        DELEGATE
      </Button>
      <WorkerDelegateDialog
        open={open}
        onClose={() => setOpen(false)}
        sources={sources}
        worker={worker}
        delegations={delegations}
      />
    </>
  );
}

export function WorkerDelegateDialog({
  open,
  sources,
  worker,
  onClose,
  delegations,
}: {
  open: boolean;
  sources?: SourceWalletWithBalance[];
  worker?: Pick<Worker, 'id' | 'status'>;
  onClose: () => void;
  delegations?: DelegationHolder[];
}) {
  const contracts = useContracts();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();

  const { setWaitHeight } = useSquidHeight();

  const { data: stakingAddress, isLoading: isStakingAddressLoading } = useReadRouterStaking({
    address: contracts.ROUTER,
  });

  const delegationOf = useCallback(
    (sourceId: string) =>
      delegations?.find(
        d => d.id.toLowerCase() === sourceId.toLowerCase() && BigInt(d.balance || '0') > 0n,
      ),
    [delegations],
  );

  // An account with nothing to delegate is still selectable when it holds a delegation on this
  // worker, because it can send a 0 SQD delegation to restart the lock.
  const isSourceDisabled = useCallback(
    (source: SourceWalletWithBalance) => source.balance === '0' && !delegationOf(source.id),
    [delegationOf],
  );

  const initialValues = useMemo(() => {
    // Prefer an account that has SQD to delegate, as before; an empty account that only holds a
    // delegation is a fallback.
    const source =
      sources?.find(c => c.balance !== '0') ||
      sources?.find(c => !isSourceDisabled(c)) ||
      sources?.[0];

    return {
      source: source?.id || '',
      amount: '',
      max: fromSqd(source?.balance).toFixed(),
    };
  }, [sources, isSourceDisabled]);

  const formik = useFormik({
    initialValues,
    validationSchema: delegateSchema,
    validate: values => {
      // The schema turns an empty or non-numeric field into 0, and 0 is now a real action, so
      // the raw input is checked here.
      const amount = parseDelegationAmount(values.amount);
      if (amount.kind === 'empty') return { amount: 'Amount is required' };
      if (amount.kind === 'invalid') return { amount: 'Amount is invalid' };
      // Staking.deposit(worker, 0) only restarts the lock of an existing delegation. From an
      // account without one it would succeed on-chain without re-locking any SQD.
      if (amount.kind === 'zero' && !delegationOf(values.source)) {
        return { amount: 'Amount must be a positive number' };
      }
      return {};
    },
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,

    onSubmit: async values => {
      if (!stakingAddress) return;
      if (!worker) return;

      const { source: sourceId } = delegateSchema.cast(values);

      const source = sources?.find(w => w?.id === sourceId);
      if (!source) return;

      // Send exactly what was typed. validate() has already rejected these cases; they are
      // checked again because a zero amount must never be sent by accident.
      const amount = parseDelegationAmount(values.amount);
      if (amount.kind === 'empty' || amount.kind === 'invalid') return;
      if (amount.kind === 'zero' && !delegationOf(source.id)) return;

      const sqdAmount = amount.kind === 'zero' ? 0n : amount.wei;

      const receipt = await writeTransactionAsync({
        abi: stakingAbi,
        address: stakingAddress,
        functionName: 'deposit',
        args: [BigInt(worker.id), sqdAmount],
        vesting: source.type === AccountType.User ? undefined : (source.id as `0x${string}`),
        approve: sqdAmount,
      });
      setWaitHeight(receipt.blockNumber, []);

      onClose();
    },
  });

  const [delegation] = useDebounce(formik.values.amount, 500);
  const { isPending: isExpectedAprPending, stakerApr } = useExpectedAprAfterDelegation({
    workerId: worker?.id,
    workerStatus: worker?.status,
    amount: toSqd(delegation),
    enabled: open && !!worker,
  });

  // Staking.deposit rewrites the unlock block of the account's whole delegation on this worker,
  // whatever the amount, so any delegation from an account that already has one restarts its lock.
  const typedAmount = parseDelegationAmount(formik.values.amount);
  const isZeroAmount = typedAmount.kind === 'zero';
  const existingDelegation = delegationOf(formik.values.source);
  const relockedDelegation =
    typedAmount.kind === 'zero' || typedAmount.kind === 'positive' ? existingDelegation : undefined;

  const { data: networkControllerAddress } = useReadRouterNetworkController({
    address: contracts.ROUTER,
    query: { enabled: !!relockedDelegation },
  });
  // NetworkController.epochLength() is the lock period in L1 blocks; workerEpochLength() is the
  // length of one worker epoch.
  const { data: lockPeriod } = useReadNetworkControllerEpochLength({
    address: networkControllerAddress,
    query: { enabled: !!relockedDelegation && !!networkControllerAddress },
  });
  const { data: workerEpochLength } = useReadNetworkControllerWorkerEpochLength({
    address: networkControllerAddress,
    query: { enabled: !!relockedDelegation && !!networkControllerAddress },
  });
  const { data: currentEpoch } = useQuery(
    trpc.network.currentEpoch.queryOptions(undefined, {
      refetchInterval: 12_000,
      enabled: !!relockedDelegation,
    }),
  );
  const newLock = useMemo(() => {
    if (!currentEpoch || lockPeriod === undefined || !Number(workerEpochLength)) return;

    const lockEnd = nextDelegationLockEnd({
      lastBlockL1: currentEpoch.lastBlockL1,
      workerEpochLength: Number(workerEpochLength),
      lockPeriod: Number(lockPeriod),
    });
    const remaining = (lockEnd - currentEpoch.lastBlockL1) * L1_BLOCK_TIME_MS;

    return {
      unlock: new Date(currentEpoch.lastBlockTimestampL1).getTime() + remaining,
      days: Math.round(remaining / DAY_MS),
    };
  }, [currentEpoch, lockPeriod, workerEpochLength]);
  const newUnlockText = newLock
    ? `around ${dateFormat(newLock.unlock, 'date')} (about ${newLock.days} days from now)`
    : 'the end of a new lock period';

  const isLoading = isStakingAddressLoading || isExpectedAprPending;

  return (
    <ContractCallDialog
      title="Delegate worker"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onClose();

        formik.handleSubmit();
      }}
      loading={isPending}
      // A 0 SQD delegation is confirmed only once the new unlock date is on screen.
      disableConfirmButton={isLoading || !formik.isValid || (isZeroAmount && !newLock)}
    >
      <Form onSubmit={formik.handleSubmit}>
        <FormRow>
          <FormikSelect
            id="source"
            showErrorOnlyOfTouched
            options={
              sources?.map(s => {
                return {
                  label: <SourceWalletOption source={s} />,
                  value: s.id,
                  disabled: isSourceDisabled(s),
                };
              }) || []
            }
            formik={formik}
            onChange={e => {
              const source = sources?.find(w => w?.id === e.target.value);
              if (!source) return;

              // One update, so the amount is validated against the new source straight away.
              formik.setValues({
                ...formik.values,
                source: source.id,
                max: fromSqd(source.balance).toFixed(),
              });
            }}
          />
        </FormRow>
        <FormRow>
          <FormikTextInput
            id="amount"
            label="Amount"
            formik={formik}
            showErrorOnlyOfTouched
            autoComplete="off"
            placeholder="0"
            InputProps={{
              endAdornment: (
                <Chip
                  clickable
                  // "Max" of an empty account would fill in 0, which is the re-lock action.
                  disabled={
                    formik.values.max === formik.values.amount ||
                    BigNumber(formik.values.max).isZero()
                  }
                  onClick={() => {
                    formik.setValues({
                      ...formik.values,
                      amount: formik.values.max,
                    });
                  }}
                  label="Max"
                />
              ),
            }}
          />
        </FormRow>
        {relockedDelegation && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            {isZeroAmount
              ? `A 0 ${contracts.SQD_TOKEN} delegation moves no tokens. It restarts the lock on your whole delegation on this worker (${tokenFormatter(fromSqd(relockedDelegation.balance), contracts.SQD_TOKEN)}): you will not be able to undelegate it until ${newUnlockText}. This cannot be undone.`
              : `This account already has ${tokenFormatter(fromSqd(relockedDelegation.balance), contracts.SQD_TOKEN)} delegated to this worker. Adding to it restarts the lock on the whole delegation, including the new amount: you will not be able to undelegate any of it until ${newUnlockText}. This cannot be undone.`}
          </Alert>
        )}
        <FormDivider />
        <Stack direction="row" justifyContent="space-between" alignContent="center">
          <Typography variant="body2">
            <HelpTooltip title={EXPECTED_APR_TIP}>Expected APR</HelpTooltip>
          </Typography>
          <Typography variant="body2">
            {isExpectedAprPending ? <Skeleton width={48} /> : percentFormatter(stakerApr)}
          </Typography>
        </Stack>
      </Form>
    </ContractCallDialog>
  );
}

export function useExpectedAprAfterDelegation({
  workerId,
  workerStatus,
  amount,
  enabled,
}: {
  workerId?: string;
  workerStatus?: WorkerStatus;
  amount: string;
  enabled?: boolean;
}) {
  const { data: rewardStats, isLoading: isRewardStatsLoading } = useQuery(
    trpc.worker.delegationInfo.queryOptions({ workerId: workerId || '' }, { enabled }),
  );

  const { data: capedStakeData, isPending: isCapedDelegationLoading } = useQuery(
    trpc.contract.capedStake.queryOptions(
      { workerId: workerId || '', amount, undelegate: undefined },
      { enabled: enabled && !!workerId },
    ),
  );
  const data = capedStakeData ?? {
    capedDelegation: '0',
    totalDelegation: '0',
    delegationCapacity: 0,
  };

  const expectedApr = useMemo(() => {
    if (!rewardStats) return;
    if (workerStatus != null && workerStatus !== WorkerStatus.Active) {
      return {
        workerApr: 0,
        stakerApr: 0,
      };
    }

    const { worker, info } = rewardStats;
    if (!worker) return;

    const totalDelegation = BigNumber(worker.totalDelegation || 0);
    const bond = BigNumber(worker.bond || 0);

    const expectedCappedDelegation = BigNumber(data.capedDelegation);

    const expectedTotalDelegation = BigNumber.max(totalDelegation.plus(amount), 0);
    const expectedUtilizedStake = BigNumber(info.utilizedStake)
      .minus(worker.capedDelegation || 0)
      .plus(expectedCappedDelegation);

    const supplyRatio = expectedCappedDelegation.plus(bond || 0).div(expectedUtilizedStake);

    const dTraffic = Math.min(
      BigNumber(worker.trafficWeight || 0)
        .div(supplyRatio)
        .toNumber() ** 0.1,
      1,
    );

    const actualYield = BigNumber(info.baseApr)
      .times(worker.liveness || 0)
      .times(dTraffic)
      .times(worker.dTenure || 0);

    const halfDelegation = expectedCappedDelegation.div(2);

    const workerReward = actualYield.times(BigNumber(bond || 0).plus(halfDelegation));
    const workerApr = workerReward
      .div(bond || 0)
      .times(100)
      .toNumber();

    const stakerReward = actualYield.times(halfDelegation);
    const stakerApr = expectedTotalDelegation.gt(0)
      ? stakerReward.div(expectedTotalDelegation).times(100).toNumber()
      : workerApr / 2;

    return {
      workerApr,
      stakerApr,
    };
  }, [amount, data.capedDelegation, rewardStats, workerStatus]);

  return {
    ...expectedApr,
    isPending: isCapedDelegationLoading || isRewardStatsLoading,
  };
}

import { useCallback, useMemo, useState } from 'react';

import { Button, Chip, Skeleton, Stack, Typography } from '@mui/material';
import * as yup from '@schema';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useDebounce } from 'use-debounce';

import { stakingAbi, useReadRouterStaking } from '@api/contracts';
import { useCapedStakeAfterDelegation } from '@api/contracts/staking';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import {
  AccountType,
  SourceWalletWithBalance,
  Worker,
  WorkerStatus,
  useWorkerDelegationInfo,
} from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormDivider, FormRow, FormikSelect, FormikTextInput } from '@components/Form';
import { HelpTooltip } from '@components/HelpTooltip';
import { SourceWalletOption } from '@components/SourceWallet';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { percentFormatter } from '@lib/formatters/formatters';
import { fromSqd, toSqd } from '@lib/network/utils';
import { useContracts } from '@network/useContracts';

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
    .positive()
    .max(yup.ref('max'), 'Insufficient balance')
    .typeError('${path} is invalid'),
  max: yup.string().label('Max').required().typeError('${path} is invalid'),
});

export function WorkerDelegate({
  sources,
  worker,
  disabled,
  variant = 'outlined',
}: {
  sources?: SourceWalletWithBalance[];
  worker?: Pick<Worker, 'id' | 'status'>;
  variant?: 'outlined' | 'contained';
  disabled?: boolean;
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
      />
    </>
  );
}

export function WorkerDelegateDialog({
  open,
  sources,
  worker,
  onClose,
}: {
  open: boolean;
  sources?: SourceWalletWithBalance[];
  worker?: Pick<Worker, 'id' | 'status'>;
  onClose: () => void;
}) {
  const contracts = useContracts();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();

  const { setWaitHeight } = useSquidHeight();

  const { data: stakingAddress, isLoading: isStakingAddressLoading } = useReadRouterStaking({
    address: contracts.ROUTER,
  });

  const isSourceDisabled = useCallback(
    (source: SourceWalletWithBalance) => source.balance === '0',
    [],
  );

  const initialValues = useMemo(() => {
    const source = sources?.find(c => !isSourceDisabled(c)) || sources?.[0];

    return {
      source: source?.id || '',
      amount: '',
      max: fromSqd(source?.balance).toString(),
    };
  }, [sources, isSourceDisabled]);

  const formik = useFormik({
    initialValues,
    validationSchema: delegateSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,

    onSubmit: async values => {
      if (!stakingAddress) return;
      if (!worker) return;

      try {
        const { amount, source: sourceId } = delegateSchema.cast(values);

        const source = sources?.find(w => w?.id === sourceId);
        if (!source) return;

        const sqdAmount = BigInt(toSqd(amount));

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
      } catch (e) {
        toast.error(errorMessage(e));
      }
    },
  });

  const [delegation] = useDebounce(formik.values.amount, 500);
  const { isPending: isExpectedAprPending, stakerApr } = useExpectedAprAfterDelegation({
    workerId: worker?.id,
    amount: toSqd(delegation),
    enabled: open && !!worker,
  });

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
      disableConfirmButton={isLoading || !formik.isValid}
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

              formik.setFieldValue('source', source.id);
              formik.setFieldValue('max', fromSqd(source.balance).toString());
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
                  disabled={formik.values.max === formik.values.amount}
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
  amount,
  enabled,
}: {
  workerId?: string;
  amount: string;
  enabled?: boolean;
}) {
  const { data: rewardStats, isLoading: isRewardStatsLoading } = useWorkerDelegationInfo({
    workerId,
    enabled,
  });

  const { data, isPending: isCapedDelegationLoading } = useCapedStakeAfterDelegation({
    workerId: workerId || '',
    amount: amount,
    enabled: enabled && !!workerId,
  });

  const expectedApr = useMemo(() => {
    if (!rewardStats) return;

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
  }, [amount, data.capedDelegation, rewardStats]);

  return {
    ...expectedApr,
    isPending: isCapedDelegationLoading || isRewardStatsLoading,
  };
}

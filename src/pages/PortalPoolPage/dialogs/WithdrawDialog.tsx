import { useCallback, useMemo, useState } from 'react';

import { dateFormat } from '@i18n';
import { Button, Chip, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useReadContract } from 'wagmi';
import * as yup from 'yup';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { FormRow, FormikTextInput } from '@components/Form';
import { HelpTooltip } from '@components/HelpTooltip';
import { Loader } from '@components/Loader';
import { tokenFormatter } from '@lib/formatters/formatters';
import { toSqd } from '@lib/network';
import { useContracts } from '@hooks/network/useContracts';

import { usePoolCapacity, usePoolData, usePoolUserData } from '../hooks';
import { WITHDRAW_DIALOG_TEXTS } from '../texts';
import { calculateExpectedMonthlyPayout, invalidatePoolQueries } from '../utils/poolUtils';

interface WithdrawDialogProps {
  open: boolean;
  onClose: () => void;
  poolId: string;
}

const createValidationSchema = (maxWithdraw: BigNumber) =>
  yup.object({
    amount: yup
      .string()
      .required('Amount is required')
      .test('positive', 'Amount must be positive', value => {
        return BigNumber(value || '0').gt(0);
      })
      .test('max', 'Insufficient balance', value => {
        return BigNumber(value || '0').lte(maxWithdraw);
      }),
  });

interface WithdrawDialogContentProps {
  poolId: string;
  formik: ReturnType<typeof useFormik<{ amount: string }>>;
}

function WithdrawDialogContent({ poolId, formik }: WithdrawDialogContentProps) {
  const { SQD_TOKEN } = useContracts();
  const { data: pool, isLoading: poolLoading } = usePoolData(poolId);
  const { data: userData, isLoading: userDataLoading } = usePoolUserData(poolId);
  const capacity = usePoolCapacity(poolId);

  const typedAmount = useMemo(() => BigNumber(formik.values.amount || '0'), [formik.values.amount]);

  const { data: withdrawalWaitingTimestamp } = useReadContract({
    address: poolId as `0x${string}`,
    abi: portalPoolAbi,
    functionName: 'getWithdrawalWaitingTimestamp',
    args: [BigInt(toSqd(typedAmount.toNumber()))],
    query: {
      enabled: !!poolId && typedAmount.gt(0),
    },
  });

  const handleMaxClick = useCallback(() => {
    if (userData) formik.setFieldValue('amount', userData.userBalance.toString());
  }, [formik, userData]);

  if (poolLoading || userDataLoading) return <Loader />;
  if (!pool || !capacity || !userData) return null;

  const expectedUserDelegation = BigNumber.max(0, capacity.currentUserBalance.minus(typedAmount));
  const expectedTotalDelegation = BigNumber.max(0, capacity.currentPoolTvl.minus(typedAmount));
  const userExpectedMonthlyPayout = calculateExpectedMonthlyPayout(pool, expectedUserDelegation);

  return (
    <Stack spacing={2.5}>
      <FormRow>
        <FormikTextInput
          id="amount"
          label={WITHDRAW_DIALOG_TEXTS.amountLabel}
          formik={formik}
          showErrorOnlyOfTouched
          autoComplete="off"
          placeholder="0"
          InputProps={{
            endAdornment: (
              <Chip
                clickable
                disabled={userData.userBalance.eq(formik.values.amount)}
                onClick={handleMaxClick}
                label="Max"
              />
            ),
          }}
        />
      </FormRow>

      <Divider />

      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">{WITHDRAW_DIALOG_TEXTS.fields.totalDelegation}</Typography>
          <Typography variant="body2">
            {typedAmount.gt(0)
              ? `${tokenFormatter(capacity.currentPoolTvl, '', 0).trim()} → ${tokenFormatter(expectedTotalDelegation, SQD_TOKEN, 0)}`
              : tokenFormatter(pool.tvl.current, SQD_TOKEN, 0)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">{WITHDRAW_DIALOG_TEXTS.fields.yourDelegation}</Typography>
          <Typography variant="body2">
            {typedAmount.gt(0)
              ? `${tokenFormatter(capacity.currentUserBalance, '', 2).trim()} → ${tokenFormatter(expectedUserDelegation, SQD_TOKEN, 2)}`
              : userData
                ? tokenFormatter(userData.userBalance, SQD_TOKEN, 2)
                : '0 SQD'}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">
            {WITHDRAW_DIALOG_TEXTS.fields.expectedMonthlyPayout}
          </Typography>
          <Typography variant="body2">
            {tokenFormatter(userExpectedMonthlyPayout, pool.rewardToken.symbol, 2)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body2">
              {WITHDRAW_DIALOG_TEXTS.fields.expectedUnlockDate.label}
            </Typography>
            <HelpTooltip title={WITHDRAW_DIALOG_TEXTS.fields.expectedUnlockDate.tooltip} />
          </Stack>
          <Typography variant="body2">
            {dateFormat(
              withdrawalWaitingTimestamp
                ? new Date(Number(withdrawalWaitingTimestamp) * 1000)
                : undefined,
              'dateTime',
            ) || '—'}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export function WithdrawDialog({ open, onClose, poolId }: WithdrawDialogProps) {
  const queryClient = useQueryClient();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();
  const { data: userData } = usePoolUserData(poolId);

  const maxWithdraw = userData?.userBalance ?? BigNumber(0);

  const validationSchema = useMemo(() => createValidationSchema(maxWithdraw), [maxWithdraw]);

  const handleSubmit = useCallback(
    async (values: { amount: string }) => {
      try {
        const sqdAmount = BigInt(toSqd(values.amount));

        await writeTransactionAsync({
          address: poolId as `0x${string}`,
          abi: portalPoolAbi,
          functionName: 'requestExit',
          args: [sqdAmount],
        });

        await invalidatePoolQueries(queryClient, poolId);
        onClose();
      } catch (error) {
        toast.error(errorMessage(error));
      }
    },
    [poolId, writeTransactionAsync, queryClient, onClose],
  );

  const formik = useFormik({
    initialValues: {
      amount: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: handleSubmit,
  });

  const handleResult = useCallback(
    (confirmed: boolean) => {
      if (!confirmed) return onClose();
      formik.handleSubmit();
    },
    [onClose, formik],
  );

  return (
    <ContractCallDialog
      title={WITHDRAW_DIALOG_TEXTS.title}
      open={open}
      onResult={handleResult}
      loading={isPending}
      confirmColor="error"
      disableConfirmButton={!formik.isValid || !formik.values.amount}
    >
      <WithdrawDialogContent poolId={poolId} formik={formik} />
    </ContractCallDialog>
  );
}

interface WithdrawButtonProps {
  poolId: string;
}

export function WithdrawButton({ poolId }: WithdrawButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: pool } = usePoolData(poolId);
  const { data: userData } = usePoolUserData(poolId);

  const hasBalance = useMemo(() => (userData ? userData.userBalance.gt(0) : false), [userData]);

  const handleOpen = useCallback(() => setDialogOpen(true), []);
  const handleClose = useCallback(() => setDialogOpen(false), []);

  return (
    <>
      <Tooltip
        title={
          pool?.phase === 'collecting'
            ? WITHDRAW_DIALOG_TEXTS.tooltips.collecting
            : WITHDRAW_DIALOG_TEXTS.tooltips.nothingToWithdraw
        }
      >
        <span>
          <Button
            variant="outlined"
            fullWidth
            color="error"
            onClick={handleOpen}
            disabled={!hasBalance || pool?.phase === 'collecting'}
            loading={dialogOpen}
          >
            WITHDRAW
          </Button>
        </span>
      </Tooltip>
      <WithdrawDialog open={dialogOpen} onClose={handleClose} poolId={poolId} />
    </>
  );
}

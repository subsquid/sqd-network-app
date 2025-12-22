import { useState, useMemo, useCallback } from 'react';
import { Alert, Button, Chip, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { FormRow, FormikTextInput } from '@components/Form';
import { dateFormat } from '@i18n';
import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd, toSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import { usePoolCapacity, usePoolData, usePoolUserData, usePoolPendingWithdrawals } from '../hooks';
import {
  calculateExpectedMonthlyPayout,
  calculateUnlockDate,
  invalidatePoolQueries,
} from '../utils/poolUtils';

interface WithdrawDialogProps {
  open: boolean;
  onClose: () => void;
  poolId: string;
}

const createValidationSchema = (maxAmount: string) =>
  yup.object({
    amount: yup
      .string()
      .required('Amount is required')
      .test('positive', 'Amount must be positive', value => {
        const num = parseFloat(value || '0');
        return num > 0;
      })
      .test('max', `Insufficient balance`, function (value) {
        const num = parseFloat(value || '0');
        const max = parseFloat(this.parent.max || '0');
        return num <= max;
      }),
    max: yup.string().required(),
  });

interface WithdrawDialogContentProps {
  poolId: string;
  formik: ReturnType<typeof useFormik<{ amount: string; max: string }>>;
}

function WithdrawDialogContent({ poolId, formik }: WithdrawDialogContentProps) {
  const { SQD_TOKEN } = useContracts();
  const { data: pool } = usePoolData(poolId);
  const { data: userData } = usePoolUserData(poolId);
  const { data: pendingWithdrawals = [] } = usePoolPendingWithdrawals(poolId);
  const capacity = usePoolCapacity(poolId);

  const pendingWithdrawalsOnly = useMemo(
    () => pendingWithdrawals.filter(w => w.status !== 'ready'),
    [pendingWithdrawals],
  );

  const { currentUserBalance, currentPoolTvl } = capacity || {};

  const typedAmount = parseFloat(formik.values.amount || '0');

  const expectedUserDelegation = useMemo(
    () => Math.max(0, (currentUserBalance || 0) - typedAmount),
    [currentUserBalance, typedAmount],
  );

  const expectedTotalDelegation = useMemo(
    () => Math.max(0, (currentPoolTvl || 0) - typedAmount),
    [currentPoolTvl, typedAmount],
  );

  const userExpectedMonthlyPayout = useMemo(
    () => (pool ? calculateExpectedMonthlyPayout(pool, expectedUserDelegation) : 0),
    [pool, expectedUserDelegation],
  );

  const expectedUnlockDate = useMemo(
    () => (typedAmount > 0 && pool ? calculateUnlockDate(pool.withdrawWaitTime) : null),
    [typedAmount, pool],
  );

  const handleMaxClick = useCallback(() => {
    formik.setFieldValue('amount', formik.values.max);
  }, [formik]);

  if (!pool) return null;

  return (
    <Stack spacing={2.5}>
      {pendingWithdrawalsOnly.length > 0 && (
        <Alert severity="info">
          You have {pendingWithdrawalsOnly.length} pending withdrawal(s) in queue. Estimated wait
          time: ~{pool.withdrawWaitTime || '2 days'}.
        </Alert>
      )}

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
          <Typography variant="body2">Total Delegation</Typography>
          <Typography variant="body2">
            {typedAmount > 0
              ? `${currentPoolTvl?.toLocaleString(undefined, { maximumFractionDigits: 0 })} → ${expectedTotalDelegation.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${SQD_TOKEN}`
              : tokenFormatter(fromSqd(pool.tvl.current), SQD_TOKEN, 0)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">Your Delegation</Typography>
          <Typography variant="body2">
            {typedAmount > 0
              ? `${currentUserBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} → ${expectedUserDelegation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${SQD_TOKEN}`
              : userData
                ? tokenFormatter(fromSqd(userData.userBalance), SQD_TOKEN, 2)
                : '0 SQD'}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">Expected Monthly Payout</Typography>
          <Typography variant="body2">
            {userExpectedMonthlyPayout > 0
              ? `$${userExpectedMonthlyPayout.toFixed(2)} USDC`
              : '$0.00 USDC'}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">Expected Unlock Date</Typography>
          <Typography variant="body2">
            {expectedUnlockDate ? dateFormat(expectedUnlockDate, 'dateTime') : '—'}
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

  const maxWithdraw = useMemo(
    () => (userData ? fromSqd(userData.userBalance).toNumber() : 0),
    [userData],
  );

  const validationSchema = useMemo(
    () => createValidationSchema(maxWithdraw.toString()),
    [maxWithdraw],
  );

  const handleSubmit = useCallback(
    async (values: { amount: string; max: string }) => {
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
      } catch (error) {}
    },
    [poolId, writeTransactionAsync, queryClient, onClose],
  );

  const formik = useFormik({
    initialValues: {
      amount: '',
      max: maxWithdraw.toString(),
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
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
      title="Withdraw Liquidity"
      open={open}
      onResult={handleResult}
      loading={isPending}
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

  const hasBalance = useMemo(
    () => (userData ? userData.userBalance > BigInt(0) : false),
    [userData],
  );

  const handleOpen = useCallback(() => setDialogOpen(true), []);
  const handleClose = useCallback(() => setDialogOpen(false), []);

  const button = (
    <Button
      variant="outlined"
      fullWidth
      color="error"
      onClick={handleOpen}
      disabled={!hasBalance || pool?.phase === 'collecting'}
    >
      WITHDRAW
    </Button>
  );

  return (
    <>
      {pool?.withdrawWaitTime ? <span style={{ width: '100%' }}>{button}</span> : button}
      <WithdrawDialog open={dialogOpen} onClose={handleClose} poolId={poolId} />
    </>
  );
}

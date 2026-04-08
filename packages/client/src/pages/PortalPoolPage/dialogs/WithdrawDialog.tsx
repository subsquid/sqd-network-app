import { useCallback, useMemo, useState } from 'react';

import { dateFormat } from '@i18n';
import { Alert, Button, Chip, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { useReadContract } from 'wagmi';
import * as yup from 'yup';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { FormRow, FormikTextInput } from '@components/Form';
import { HelpTooltip } from '@components/HelpTooltip';
import { Loader } from '@components/Loader';
import { useContracts } from '@hooks/network/useContracts';
import { tokenFormatter } from '@lib/formatters/formatters';
import { toSqd } from '@lib/network';

import { usePoolData, usePoolUserData } from '../hooks';
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

function ImmediateWithdrawDialog({ open, onClose, poolId }: WithdrawDialogProps) {
  const { SQD_TOKEN } = useContracts();
  const queryClient = useQueryClient();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();
  const { data: pool, isLoading: poolLoading } = usePoolData(poolId);
  const { data: userData, isLoading: userDataLoading } = usePoolUserData(poolId);

  const isLoading = poolLoading || userDataLoading;

  const isFailed = pool?.phase === 'failed';
  const texts = isFailed
    ? {
        title: 'Withdraw from Failed Pool',
        description:
          'This pool failed to activate before the deadline. Your full balance will be returned immediately.',
      }
    : {
        title: 'Emergency Withdraw',
        description:
          'This pool has been closed. Your full balance will be returned immediately without a waiting period.',
      };

  const handleConfirm = useCallback(
    async (confirmed: boolean) => {
      if (!confirmed) return onClose();

      const functionName = isFailed ? 'withdrawFromFailed' : 'emergencyWithdraw';
      await writeTransactionAsync({
        address: poolId as `0x${string}`,
        abi: portalPoolAbi,
        functionName,
        args: [],
      });

      await invalidatePoolQueries(queryClient, poolId);
      onClose();
    },
    [poolId, isFailed, writeTransactionAsync, queryClient, onClose],
  );

  return (
    <ContractCallDialog
      title={texts.title}
      open={open}
      onResult={handleConfirm}
      loading={isPending}
      confirmColor="error"
    >
      {isLoading ? (
        <Loader />
      ) : !pool || !userData ? null : (
        <Stack spacing={2.5}>
          <Alert severity="warning">{texts.description}</Alert>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Your Balance</Typography>
            <Typography variant="body2" fontWeight={600}>
              {tokenFormatter(userData.userBalance, SQD_TOKEN, 2)}
            </Typography>
          </Stack>
        </Stack>
      )}
    </ContractCallDialog>
  );
}

export function WithdrawDialog({ open, onClose, poolId }: WithdrawDialogProps) {
  const { data: pool } = usePoolData(poolId);

  if (pool?.phase === 'failed' || pool?.phase === 'closed') {
    return <ImmediateWithdrawDialog open={open} onClose={onClose} poolId={poolId} />;
  }

  return <ExitQueueWithdrawDialog open={open} onClose={onClose} poolId={poolId} />;
}

function ExitQueueWithdrawDialog({ open, onClose, poolId }: WithdrawDialogProps) {
  const { SQD_TOKEN } = useContracts();
  const queryClient = useQueryClient();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();
  const { data: pool, isLoading: poolLoading } = usePoolData(poolId);
  const { data: userData, isLoading: userDataLoading } = usePoolUserData(poolId);

  const isLoading = poolLoading || userDataLoading;
  const currentUserBalance = userData?.userBalance ?? BigNumber(0);
  const currentPoolTvl = pool?.tvl.current ?? BigNumber(0);
  const validationSchema = useMemo(
    () => createValidationSchema(currentUserBalance),
    [currentUserBalance],
  );

  const handleSubmit = useCallback(
    async (values: { amount: string }) => {
      const sqdAmount = BigInt(toSqd(values.amount));

      await writeTransactionAsync({
        address: poolId as `0x${string}`,
        abi: portalPoolAbi,
        functionName: 'requestExit',
        args: [sqdAmount],
      });

      await invalidatePoolQueries(queryClient, poolId);
      onClose();
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

  const handleMaxClick = useCallback(() => {
    if (userData) formik.setFieldValue('amount', userData.userBalance.toString());
  }, [formik, userData]);

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

  const expectedUserDelegation = useMemo(
    () => BigNumber.max(0, currentUserBalance.minus(typedAmount)),
    [currentUserBalance, typedAmount],
  );

  const expectedTotalDelegation = useMemo(
    () => BigNumber.max(0, currentPoolTvl.minus(typedAmount)),
    [currentPoolTvl, typedAmount],
  );

  const userExpectedMonthlyPayout = useMemo(
    () => (pool ? calculateExpectedMonthlyPayout(pool, expectedUserDelegation) : BigNumber(0)),
    [pool, expectedUserDelegation],
  );

  return (
    <ContractCallDialog
      title="Withdraw from Pool"
      open={open}
      onResult={handleResult}
      loading={isPending}
      confirmColor="error"
      disableConfirmButton={!formik.isValid || !formik.values.amount}
    >
      {isLoading ? (
        <Loader />
      ) : !pool || !userData ? null : (
        <Stack spacing={2.5}>
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
              <Typography variant="body2">Total Tokens</Typography>
              <Typography variant="body2">
                {typedAmount.gt(0)
                  ? `${tokenFormatter(currentPoolTvl, '', 0).trim()} → ${tokenFormatter(expectedTotalDelegation, SQD_TOKEN, 0)}`
                  : tokenFormatter(pool.tvl.current, SQD_TOKEN, 0)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Your Tokens</Typography>
              <Typography variant="body2">
                {typedAmount.gt(0)
                  ? `${tokenFormatter(currentUserBalance, '', 2).trim()} → ${tokenFormatter(expectedUserDelegation, SQD_TOKEN, 2)}`
                  : tokenFormatter(userData.userBalance, SQD_TOKEN, 2)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Expected Monthly Payout</Typography>
              <Typography variant="body2">
                {tokenFormatter(userExpectedMonthlyPayout, pool.rewardToken.symbol, 2)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="body2">Expected Unlock Date</Typography>
                <HelpTooltip title="Date when withdrawn funds will be available to claim. Withdrawal requests require a waiting period for pool security." />
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
      )}
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

  const isImmediateWithdraw = pool?.phase === 'failed' || pool?.phase === 'closed';

  const tooltipTitle = useMemo(() => {
    if (pool?.phase === 'collecting') {
      return 'You cannot withdraw funds while the pool is still collecting';
    }
    if (!hasBalance) {
      return 'Nothing to withdraw';
    }
    return '';
  }, [pool?.phase, hasBalance]);

  const buttonLabel = useMemo(() => {
    if (pool?.phase === 'failed') return 'WITHDRAW ALL';
    if (pool?.phase === 'closed') return 'EMERGENCY WITHDRAW';
    return 'EXIT';
  }, [pool?.phase]);

  return (
    <>
      <Tooltip title={tooltipTitle}>
        <span>
          <Button
            variant={isImmediateWithdraw ? 'contained' : 'outlined'}
            fullWidth
            color="error"
            onClick={handleOpen}
            disabled={!hasBalance || pool?.phase === 'collecting'}
            loading={dialogOpen}
          >
            {buttonLabel}
          </Button>
        </span>
      </Tooltip>
      <WithdrawDialog open={dialogOpen} onClose={handleClose} poolId={poolId} />
    </>
  );
}

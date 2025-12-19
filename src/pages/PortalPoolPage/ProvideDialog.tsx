import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ContractCallDialog } from '@components/ContractCallDialog';
import { FormRow, FormikTextInput } from '@components/Form';
import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd, toSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';
import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';

import type { PoolData, PoolUserData } from './usePoolData';

interface ProvideDialogProps {
  open: boolean;
  onClose: () => void;
  pool: PoolData;
  userData?: PoolUserData;
}

const createValidationSchema = (
  maxAmount: string,
  userRemainingCapacity: number,
  poolRemainingCapacity: number,
  maxDepositPerAddress: number,
  currentUserBalance: number,
  sqdToken: string,
) =>
  yup.object({
    amount: yup
      .string()
      .required('Amount is required')
      .test('positive', 'Amount must be positive', value => {
        const num = parseFloat(value || '0');
        return num > 0;
      })
      .test('max', function (value) {
        const num = parseFloat(value || '0');
        const max = parseFloat(this.parent.max || '0');

        if (num <= max) return true;

        // Determine which limit is being exceeded
        if (userRemainingCapacity < poolRemainingCapacity) {
          // User limit is the constraint
          return this.createError({
            message: `You have reached the maximum deposit limit of ${maxDepositPerAddress.toLocaleString()} ${sqdToken}`,
          });
        } else {
          // Pool capacity is the constraint
          return this.createError({
            message: `Pool is at maximum capacity`,
          });
        }
      }),
    max: yup.string().required(),
  });

function ActivationProgress({ pool }: { pool: PoolData }) {
  const { SQD_TOKEN } = useContracts();
  const currentTvl = fromSqd(pool.tvl.current).toNumber();
  const threshold = fromSqd(pool.activation.threshold).toNumber();
  const progress = Math.min((currentTvl / threshold) * 100, 100);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 2.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <TrendingUp sx={{ fontSize: 18, color: 'success.main' }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'grey.900' }}>
          Pool Activation Progress
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={progress}
        color="success"
        sx={{
          height: 10,
          borderRadius: 5,
          mb: 1.5,
          bgcolor: 'grey.300',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
          },
        }}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" fontWeight={600} sx={{ color: 'grey.900' }}>
          {tokenFormatter(fromSqd(pool.tvl.current), SQD_TOKEN, 0)}
        </Typography>
        <Typography variant="body2" fontWeight={500} sx={{ color: 'grey.900' }}>
          {tokenFormatter(fromSqd(pool.activation.threshold), SQD_TOKEN, 0)} to activate
        </Typography>
      </Stack>
    </Box>
  );
}

interface ProvideDialogContentProps {
  pool: PoolData;
  userData?: PoolUserData;
  formik: ReturnType<typeof useFormik<{ amount: string; max: string }>>;
}

function ProvideDialogContent({ pool, userData, formik }: ProvideDialogContentProps) {
  const { SQD_TOKEN } = useContracts();

  // Calculate remaining capacity based on both per-address limit and pool capacity
  const maxDepositPerAddress = fromSqd(pool.maxDepositPerAddress).toNumber();
  const currentUserBalance = userData ? fromSqd(userData.userBalance).toNumber() : 0;
  const userRemainingCapacity = Math.max(0, maxDepositPerAddress - currentUserBalance);

  // Pool remaining capacity
  const currentPoolTvl = fromSqd(pool.tvl.current).toNumber();
  const maxPoolCapacity = fromSqd(pool.tvl.max).toNumber();
  const poolRemainingCapacity = Math.max(0, maxPoolCapacity - currentPoolTvl);

  const isDepositPhase = pool.phase === 'deposit_window';
  const isPoolFull = poolRemainingCapacity === 0;
  const isUserAtLimit = userRemainingCapacity === 0;

  const poolCapacityPercent = (currentPoolTvl / maxPoolCapacity) * 100;

  // Calculate user's expected monthly payout based on their delegation
  // Coefficient per SQD = monthly payout / max pool capacity
  const payoutCoefficientPerSqd = maxPoolCapacity > 0 ? pool.monthlyPayoutUsd / maxPoolCapacity : 0;

  // Calculate expected delegation including the typed amount
  const typedAmount = parseFloat(formik.values.amount || '0');
  const maxAllowedDeposit = parseFloat(formik.values.max || '0');

  // For preview, show uncapped values so user can see they're exceeding limits
  const expectedUserDelegation = currentUserBalance + typedAmount;
  const expectedTotalDelegation = currentPoolTvl + typedAmount;

  // For payout calculation, cap at allowed amount
  const actualDepositAmount = Math.min(typedAmount, maxAllowedDeposit);
  const cappedUserDelegation = currentUserBalance + actualDepositAmount;
  const userExpectedMonthlyPayout = cappedUserDelegation * payoutCoefficientPerSqd;

  const handleMaxClick = () => {
    formik.setFieldValue('amount', formik.values.max);
  };

  return (
    <Stack spacing={2.5}>
      {isDepositPhase && (
        <Alert severity="info">
          Collecting deposits to reach activation threshold. Pool will activate once the minimum
          liquidity is met.
          <br />
          Deposits are locked until the pool activates or the collection period expires without
          reaching the threshold.
        </Alert>
      )}

      {pool.phase === 'paused' && (
        <Alert severity="warning">
          Pool is paused. Yields are currently stopped due to low buffer.
        </Alert>
      )}

      {isPoolFull && (
        <Alert severity="warning">Pool is at maximum capacity. No more deposits accepted.</Alert>
      )}

      {!isPoolFull && isUserAtLimit && (
        <Alert severity="info">
          You have reached the maximum deposit limit of{' '}
          {tokenFormatter(fromSqd(pool.maxDepositPerAddress), SQD_TOKEN, 0)} per address.
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
          disabled={isPoolFull || isUserAtLimit}
          InputProps={{
            endAdornment: (
              <Chip
                clickable
                disabled={isPoolFull || isUserAtLimit || formik.values.max === formik.values.amount}
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
              ? `${currentPoolTvl.toLocaleString(undefined, { maximumFractionDigits: 0 })} → ${expectedTotalDelegation.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${SQD_TOKEN}`
              : tokenFormatter(fromSqd(pool.tvl.current), SQD_TOKEN, 0)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">Your Delegation</Typography>
          <Typography variant="body2">
            {typedAmount > 0
              ? `${currentUserBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} → ${expectedUserDelegation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${SQD_TOKEN}`
              : userData ? tokenFormatter(fromSqd(userData.userBalance), SQD_TOKEN, 2) : '0 SQD'}
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
      </Stack>
    </Stack>
  );
}

export function ProvideDialog({ open, onClose, pool, userData }: ProvideDialogProps) {
  const { SQD_TOKEN } = useContracts();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();

  // Calculate remaining capacity based on both per-address limit and pool capacity
  const maxDepositPerAddress = fromSqd(pool.maxDepositPerAddress).toNumber();
  const currentUserBalance = userData ? fromSqd(userData.userBalance).toNumber() : 0;
  const userRemainingCapacity = Math.max(0, maxDepositPerAddress - currentUserBalance);

  // Pool remaining capacity
  const currentPoolTvl = fromSqd(pool.tvl.current).toNumber();
  const maxPoolCapacity = fromSqd(pool.tvl.max).toNumber();
  const poolRemainingCapacity = Math.max(0, maxPoolCapacity - currentPoolTvl);

  // Effective max is the lesser of user's remaining and pool's remaining
  const effectiveMax = Math.min(userRemainingCapacity, poolRemainingCapacity);

  const validationSchema = createValidationSchema(
    effectiveMax.toString(),
    userRemainingCapacity,
    poolRemainingCapacity,
    maxDepositPerAddress,
    currentUserBalance,
    SQD_TOKEN,
  );

  const formik = useFormik({
    initialValues: {
      amount: '',
      max: effectiveMax.toString(),
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: async values => {
      try {
        const sqdAmount = BigInt(toSqd(values.amount));

        await writeTransactionAsync({
          address: pool.id as `0x${string}`,
          abi: portalPoolAbi,
          functionName: 'deposit',
          args: [sqdAmount],
          approve: sqdAmount,
        });

        onClose();
        formik.resetForm();
      } catch (error) {
        // Error is already handled by useWriteSQDTransaction
      }
    },
  });

  return (
    <ContractCallDialog
      title="Deposit Liquidity"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onClose();
        formik.handleSubmit();
      }}
      loading={isPending}
      disableConfirmButton={!formik.isValid || !formik.values.amount}
    >
      <ProvideDialogContent pool={pool} userData={userData} formik={formik} />
    </ContractCallDialog>
  );
}

interface ProvideButtonProps {
  pool: PoolData;
  userData?: PoolUserData;
}

export function ProvideButton({ pool, userData }: ProvideButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="secondary" fullWidth onClick={() => setDialogOpen(true)}>
        DEPOSIT
      </Button>
      <ProvideDialog open={dialogOpen} onClose={() => setDialogOpen(false)} pool={pool} userData={userData} />
    </>
  );
}

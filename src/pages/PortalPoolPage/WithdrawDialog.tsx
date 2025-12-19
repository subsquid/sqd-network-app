import { useState } from 'react';
import { Alert, Box, Button, Chip, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ContractCallDialog } from '@components/ContractCallDialog';
import { FormRow, FormikTextInput } from '@components/Form';
import { dateFormat } from '@i18n';
import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd, toSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';
import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';

import type { PendingWithdrawal, PoolData, PoolUserData } from './usePoolData';

interface WithdrawDialogProps {
  open: boolean;
  onClose: () => void;
  pool: PoolData;
  userData?: PoolUserData;
  pendingWithdrawals: PendingWithdrawal[];
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

function ReadyWithdrawalItem({
  withdrawal,
  onClaim,
  isClaiming,
}: {
  withdrawal: PendingWithdrawal;
  onClaim: (id: string) => void;
  isClaiming: boolean;
}) {
  const { SQD_TOKEN } = useContracts();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        bgcolor: theme =>
          theme.palette.mode === 'dark' ? 'rgba(46, 125, 50, 0.15)' : 'rgba(46, 125, 50, 0.08)',
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'success.main',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
        <Box>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {tokenFormatter(fromSqd(withdrawal.amount), SQD_TOKEN, 2)}
          </Typography>
          <Typography variant="caption" color="success.dark">
            Ready to claim
          </Typography>
        </Box>
      </Stack>
      <Button
        size="small"
        variant="contained"
        color="success"
        onClick={() => onClaim(withdrawal.id)}
        loading={isClaiming}
        sx={{ borderRadius: 2 }}
      >
        Claim
      </Button>
    </Stack>
  );
}

interface WithdrawDialogContentProps {
  pool: PoolData;
  userData?: PoolUserData;
  pendingWithdrawals: PendingWithdrawal[];
  formik: ReturnType<typeof useFormik<{ amount: string; max: string }>>;
  onClaim: (id: string) => void;
  claimingId: string | null;
}

function WithdrawDialogContent({ pool, userData, pendingWithdrawals, formik, onClaim, claimingId }: WithdrawDialogContentProps) {
  const { SQD_TOKEN } = useContracts();

  const readyWithdrawals = pendingWithdrawals.filter(w => w.status === 'ready');
  const pendingWithdrawalsOnly = pendingWithdrawals.filter(w => w.status !== 'ready');
  const hasReadyWithdrawals = readyWithdrawals.length > 0;

  const currentUserBalance = userData ? fromSqd(userData.userBalance).toNumber() : 0;
  const currentPoolTvl = fromSqd(pool.tvl.current).toNumber();
  const maxPoolCapacity = fromSqd(pool.tvl.max).toNumber();

  // Calculate expected values after withdrawal
  const typedAmount = parseFloat(formik.values.amount || '0');
  const expectedUserDelegation = Math.max(0, currentUserBalance - typedAmount);
  const expectedTotalDelegation = Math.max(0, currentPoolTvl - typedAmount);

  // Calculate expected monthly payout
  const payoutCoefficientPerSqd = maxPoolCapacity > 0 ? pool.monthlyPayoutUsd / maxPoolCapacity : 0;
  const userExpectedMonthlyPayout = expectedUserDelegation * payoutCoefficientPerSqd;

  // Calculate expected unlock date
  const calculateUnlockDate = (): Date | null => {
    if (!pool.withdrawWaitTime) return null;

    const now = new Date();
    const waitTimeStr = pool.withdrawWaitTime.toLowerCase();

    // Parse wait time (e.g., "2 days", "3 hours", "1 week")
    const match = waitTimeStr.match(/(\d+)\s*(day|hour|week|minute)/);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2];

    const unlockDate = new Date(now);
    switch (unit) {
      case 'minute':
        unlockDate.setMinutes(unlockDate.getMinutes() + value);
        break;
      case 'hour':
        unlockDate.setHours(unlockDate.getHours() + value);
        break;
      case 'day':
        unlockDate.setDate(unlockDate.getDate() + value);
        break;
      case 'week':
        unlockDate.setDate(unlockDate.getDate() + value * 7);
        break;
    }

    return unlockDate;
  };

  const expectedUnlockDate = typedAmount > 0 ? calculateUnlockDate() : null;

  const queueUsedPercent =
    (fromSqd(pool.withdrawalQueue.windowUsed).toNumber() /
      fromSqd(pool.withdrawalQueue.windowLimit).toNumber()) *
    100;

  const handleMaxClick = () => {
    formik.setFieldValue('amount', formik.values.max);
  };

  return (
    <Stack spacing={2.5}>
      {pendingWithdrawalsOnly.length > 0 && (
        <Alert severity="info">
          You have {pendingWithdrawalsOnly.length} pending withdrawal(s) in queue. Estimated wait time:
          ~{pool.withdrawWaitTime || '2 days'}.
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

export function WithdrawDialog({ open, onClose, pool, userData, pendingWithdrawals }: WithdrawDialogProps) {
  const { SQD_TOKEN } = useContracts();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const maxWithdraw = userData ? fromSqd(userData.userBalance).toNumber() : 0;
  const validationSchema = createValidationSchema(maxWithdraw.toString());

  const formik = useFormik({
    initialValues: {
      amount: '',
      max: maxWithdraw.toString(),
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
          functionName: 'requestExit',
          args: [sqdAmount],
        });

        onClose();
        formik.resetForm();
      } catch (error) {
        // Error is already handled by useWriteSQDTransaction
      }
    },
  });

  const handleClaim = async (withdrawalId: string) => {
    setClaimingId(withdrawalId);
    try {
      await writeTransactionAsync({
        address: pool.id as `0x${string}`,
        abi: portalPoolAbi,
        functionName: 'withdrawExit',
        args: [BigInt(withdrawalId)],
      });
    } catch (error) {
      // Error is already handled by useWriteSQDTransaction
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <ContractCallDialog
      title="Withdraw Liquidity"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onClose();
        formik.handleSubmit();
      }}
      loading={isPending}
      disableConfirmButton={!formik.isValid || !formik.values.amount}
    >
      <WithdrawDialogContent
        pool={pool}
        userData={userData}
        pendingWithdrawals={pendingWithdrawals}
        formik={formik}
        onClaim={handleClaim}
        claimingId={claimingId}
      />
    </ContractCallDialog>
  );
}

interface WithdrawButtonProps {
  pool: PoolData;
  userData?: PoolUserData;
  pendingWithdrawals: PendingWithdrawal[];
}

export function WithdrawButton({ pool, userData, pendingWithdrawals }: WithdrawButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasBalance = userData ? userData.userBalance > BigInt(0) : false;

  const button = (
    <Button
      variant="outlined"
      fullWidth
      color="error"
      onClick={() => setDialogOpen(true)}
      disabled={!hasBalance}
      sx={{}}
    >
      WITHDRAW
    </Button>
  );

  return (
    <>
      {pool.withdrawWaitTime ? (
        <Tooltip title={`Approximate wait time: ~${pool.withdrawWaitTime}`} placement="top">
          <span style={{ width: '100%' }}>{button}</span>
        </Tooltip>
      ) : (
        button
      )}
      <WithdrawDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        pool={pool} 
        userData={userData}
        pendingWithdrawals={pendingWithdrawals}
      />
    </>
  );
}

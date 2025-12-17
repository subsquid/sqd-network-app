import { useState } from 'react';
import { Alert, Box, Button, Chip, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ContractCallDialog } from '@components/ContractCallDialog';
import { FormRow, FormikTextInput } from '@components/Form';
import { dateFormat } from '@i18n';
import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import type { PendingWithdrawal, PoolData } from './usePoolData';

interface WithdrawDialogProps {
  open: boolean;
  onClose: () => void;
  pool: PoolData;
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
  formik: ReturnType<typeof useFormik<{ amount: string; max: string }>>;
  onClaim: (id: string) => void;
  claimingId: string | null;
}

function WithdrawDialogContent({ pool, formik, onClaim, claimingId }: WithdrawDialogContentProps) {
  const { SQD_TOKEN } = useContracts();

  const readyWithdrawals = pool.userPendingWithdrawals.filter(w => w.status === 'ready');
  const pendingWithdrawals = pool.userPendingWithdrawals.filter(w => w.status !== 'ready');
  const hasReadyWithdrawals = readyWithdrawals.length > 0;

  const currentUserBalance = fromSqd(pool.userBalance).toNumber();
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
      {pendingWithdrawals.length > 0 && (
        <Alert severity="info">
          You have {pendingWithdrawals.length} pending withdrawal(s) in queue. Estimated wait time:
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
              : tokenFormatter(fromSqd(pool.userBalance), SQD_TOKEN, 2)}
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

export function WithdrawDialog({ open, onClose, pool }: WithdrawDialogProps) {
  const { SQD_TOKEN } = useContracts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const maxWithdraw = fromSqd(pool.userBalance).toNumber();
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
      setIsSubmitting(true);
      try {
        const sqdAmount = BigInt(Math.floor(parseFloat(values.amount) * 10 ** 18));
        // TODO: Call pool contract withdraw function
        // Example: await withdrawFromPool(pool.id, sqdAmount);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
        onClose();
        formik.resetForm();
      } catch (error) {
        // Handle error in production
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClaim = async (withdrawalId: string) => {
    setClaimingId(withdrawalId);
    try {
      // TODO: Call pool contract claim function
      // Example: await claimWithdrawal(withdrawalId);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
    } catch (error) {
      // Handle error in production
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
      loading={isSubmitting}
      disableConfirmButton={!formik.isValid || !formik.values.amount}
    >
      <WithdrawDialogContent
        pool={pool}
        formik={formik}
        onClaim={handleClaim}
        claimingId={claimingId}
      />
    </ContractCallDialog>
  );
}

interface WithdrawButtonProps {
  pool: PoolData;
}

export function WithdrawButton({ pool }: WithdrawButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasBalance = pool.userBalance > BigInt(0);

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
      <WithdrawDialog open={dialogOpen} onClose={() => setDialogOpen(false)} pool={pool} />
    </>
  );
}

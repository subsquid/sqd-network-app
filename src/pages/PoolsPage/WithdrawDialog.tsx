import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { AccessTime, CheckCircle, Savings } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd, toSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import type { PendingWithdrawal, PoolData } from './usePoolData';

interface WithdrawDialogProps {
  open: boolean;
  onClose: () => void;
  pool: PoolData;
}

const createValidationSchema = (maxAmount: number) =>
  yup.object({
    amount: yup
      .number()
      .required('Amount is required')
      .positive('Amount must be positive')
      .max(maxAmount, `Maximum withdrawal is ${maxAmount.toLocaleString()} SQD`),
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

function WithdrawDialogContent({ pool, onClose }: Omit<WithdrawDialogProps, 'open'>) {
  const { SQD_TOKEN } = useContracts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const readyWithdrawals = pool.userPendingWithdrawals.filter(w => w.status === 'ready');
  const pendingWithdrawals = pool.userPendingWithdrawals.filter(w => w.status !== 'ready');
  const hasReadyWithdrawals = readyWithdrawals.length > 0;

  const maxWithdraw = fromSqd(pool.userBalance).toNumber();
  const validationSchema = createValidationSchema(maxWithdraw);

  const queueUsedPercent =
    (fromSqd(pool.withdrawalQueue.windowUsed).toNumber() /
      fromSqd(pool.withdrawalQueue.windowLimit).toNumber()) *
    100;

  const handleClaim = async (withdrawalId: string) => {
    setClaimingId(withdrawalId);
    try {
      // TODO: Call pool contract claim function
      console.log('Claiming withdrawal:', withdrawalId);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
    } catch (error) {
      console.error('Claim failed:', error);
    } finally {
      setClaimingId(null);
    }
  };

  const formik = useFormik({
    initialValues: {
      amount: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async values => {
      setIsSubmitting(true);
      try {
        const amountInWei = toSqd(values.amount);
        // TODO: Call pool contract withdraw function
        console.log('Withdrawing:', amountInWei.toString());
        await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
        onClose();
      } catch (error) {
        console.error('Withdrawal failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleMaxClick = () => {
    formik.setFieldValue('amount', maxWithdraw.toString());
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'warning.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Savings sx={{ color: 'warning.contrastText' }} />
          </Box>
          <Box>
            <Typography variant="h6" color="text.primary">
              Withdraw Liquidity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Withdraw your SQD from the pool
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {hasReadyWithdrawals && (
            <>
              <Alert severity="success" sx={{ borderRadius: 2 }} icon={<CheckCircle />}>
                You have {readyWithdrawals.length} withdrawal(s) ready to claim!
              </Alert>
              <Stack spacing={1.5}>
                {readyWithdrawals.map(withdrawal => (
                  <ReadyWithdrawalItem
                    key={withdrawal.id}
                    withdrawal={withdrawal}
                    onClaim={handleClaim}
                    isClaiming={claimingId === withdrawal.id}
                  />
                ))}
              </Stack>
              <Divider sx={{ my: 1 }} />
            </>
          )}

          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
              Request New Withdrawal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your request will be added to the queue and processed based on available liquidity.
            </Typography>
          </Box>

          <TextField
            id="amount"
            name="amount"
            label="Amount to withdraw"
            type="number"
            fullWidth
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={handleMaxClick}
                    sx={{ minWidth: 'auto', fontWeight: 600, color: 'text.primary' }}
                  >
                    MAX
                  </Button>
                  <Typography sx={{ ml: 1, fontWeight: 500 }} color="text.primary">
                    {SQD_TOKEN}
                  </Typography>
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              bgcolor: 'background.default',
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.primary">
                  Your balance in pool
                </Typography>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {tokenFormatter(fromSqd(pool.userBalance), SQD_TOKEN, 2)}
                </Typography>
              </Stack>

              {pendingWithdrawals.length > 0 && (
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.primary">
                    Pending withdrawals
                  </Typography>
                  <Chip
                    label={`${pendingWithdrawals.length} in queue`}
                    size="small"
                    color="warning"
                  />
                </Stack>
              )}

              <Divider />

              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 0.5 }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AccessTime sx={{ fontSize: 16, color: 'text.primary' }} />
                    <Typography variant="body2" color="text.primary">
                      Queue limit ({pool.withdrawalQueue.windowDuration})
                    </Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {tokenFormatter(fromSqd(pool.withdrawalQueue.windowUsed), SQD_TOKEN, 0)} /{' '}
                    {tokenFormatter(fromSqd(pool.withdrawalQueue.windowLimit), SQD_TOKEN, 0)}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={queueUsedPercent}
                  color={queueUsedPercent > 80 ? 'warning' : 'primary'}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'grey.400',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>

              {pool.withdrawWaitTime && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    bgcolor: 'action.hover',
                    p: 1.5,
                    borderRadius: 1.5,
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" color="text.primary">
                    Estimated wait time
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    ~{pool.withdrawWaitTime}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          disabled={isSubmitting}
          sx={{ borderRadius: 2, color: 'text.primary' }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!formik.isValid || !formik.values.amount}
          sx={{ borderRadius: 2, px: 3, color: 'text.primary' }}
        >
          Request Withdrawal
        </Button>
      </DialogActions>
    </form>
  );
}

export function WithdrawDialog({ open, onClose, pool }: WithdrawDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <WithdrawDialogContent pool={pool} onClose={onClose} />
    </Dialog>
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

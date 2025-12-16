import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AccountBalanceWallet, TrendingUp } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd, toSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import type { PoolData } from './usePoolData';

interface ProvideDialogProps {
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
      .max(maxAmount, `Maximum deposit is ${maxAmount.toLocaleString()} SQD`),
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

function ProvideDialogContent({ pool, onClose }: Omit<ProvideDialogProps, 'open'>) {
  const { SQD_TOKEN } = useContracts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate remaining capacity based on both per-address limit and pool capacity
  const maxDepositPerAddress = fromSqd(pool.maxDepositPerAddress).toNumber();
  const currentUserBalance = fromSqd(pool.userBalance).toNumber();
  const userRemainingCapacity = Math.max(0, maxDepositPerAddress - currentUserBalance);

  // Pool remaining capacity
  const currentPoolTvl = fromSqd(pool.tvl.current).toNumber();
  const maxPoolCapacity = fromSqd(pool.tvl.max).toNumber();
  const poolRemainingCapacity = Math.max(0, maxPoolCapacity - currentPoolTvl);

  // Effective max is the lesser of user's remaining and pool's remaining
  const effectiveMax = Math.min(userRemainingCapacity, poolRemainingCapacity);

  const validationSchema = createValidationSchema(effectiveMax);

  const isDepositPhase = pool.phase === 'deposit_window';
  const isPoolFull = poolRemainingCapacity === 0;
  const isUserAtLimit = userRemainingCapacity === 0;

  const userLimitPercent = (currentUserBalance / maxDepositPerAddress) * 100;
  const poolCapacityPercent = (currentPoolTvl / maxPoolCapacity) * 100;

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
        // TODO: Call pool contract deposit function
        console.log('Depositing:', amountInWei.toString());
        await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
        onClose();
      } catch (error) {
        console.error('Deposit failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleMaxClick = () => {
    formik.setFieldValue('amount', effectiveMax.toString());
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
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AccountBalanceWallet sx={{ color: 'primary.contrastText' }} />
          </Box>
          <Box>
            <Typography variant="h6" color="text.primary">Provide Liquidity</Typography>
            <Typography variant="body2" color="text.secondary">
              Earn yield by depositing SQD
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {isDepositPhase && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Pool is in deposit window. Portal will activate when{' '}
              {tokenFormatter(fromSqd(pool.activation.threshold), SQD_TOKEN, 0)} is reached.
            </Alert>
          )}

          {pool.phase === 'paused' && (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Pool is paused. Yields are currently stopped due to low buffer.
            </Alert>
          )}

          {isPoolFull && (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Pool is at maximum capacity. No more deposits accepted.
            </Alert>
          )}

          {!isPoolFull && isUserAtLimit && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              You have reached the maximum deposit limit of{' '}
              {tokenFormatter(fromSqd(pool.maxDepositPerAddress), SQD_TOKEN, 0)} per address.
            </Alert>
          )}

          <TextField
            id="amount"
            name="amount"
            label="Amount to deposit"
            type="number"
            fullWidth
            disabled={isPoolFull || isUserAtLimit}
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
                    disabled={isPoolFull || isUserAtLimit}
                    sx={{ minWidth: 'auto', fontWeight: 600, color: 'text.primary' }}
                  >
                    MAX
                  </Button>
                  <Typography sx={{ ml: 1, fontWeight: 500 }} color="text.primary">{SQD_TOKEN}</Typography>
                </InputAdornment>
              ),
            }}
          />

          {isDepositPhase && <ActivationProgress pool={pool} />}

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
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" color="text.primary">
                    Your deposit limit
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {tokenFormatter(currentUserBalance, SQD_TOKEN, 0)} /{' '}
                    {tokenFormatter(fromSqd(pool.maxDepositPerAddress), SQD_TOKEN, 0)}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={userLimitPercent}
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

              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" color="text.primary">
                    Pool capacity
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {tokenFormatter(fromSqd(pool.tvl.current), SQD_TOKEN, 0)} /{' '}
                    {tokenFormatter(fromSqd(pool.tvl.max), SQD_TOKEN, 0)}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={poolCapacityPercent}
                  color="secondary"
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

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.primary">
                  Your balance in pool
                </Typography>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {tokenFormatter(fromSqd(pool.userBalance), SQD_TOKEN, 2)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={isSubmitting} sx={{ borderRadius: 2, color: 'text.primary' }}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!formik.isValid || !formik.values.amount || isPoolFull || isUserAtLimit}
          sx={{ borderRadius: 2, px: 4, color: 'text.primary' }}
        >
          Provide
        </Button>
      </DialogActions>
    </form>
  );
}

export function ProvideDialog({ open, onClose, pool }: ProvideDialogProps) {
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
      <ProvideDialogContent pool={pool} onClose={onClose} />
    </Dialog>
  );
}

interface ProvideButtonProps {
  pool: PoolData;
}

export function ProvideButton({ pool }: ProvideButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        color="info"
        fullWidth
        onClick={() => setDialogOpen(true)}
        sx={{
          py: 1.5,
          fontWeight: 600,
          fontSize: '1rem',
        }}
      >
        Provide $SQD
      </Button>
      <ProvideDialog open={dialogOpen} onClose={() => setDialogOpen(false)} pool={pool} />
    </>
  );
}

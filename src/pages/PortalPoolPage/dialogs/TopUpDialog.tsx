import { useCallback, useState } from 'react';

import { Button, Divider, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { FormRow, FormikTextInput } from '@components/Form';

import { type PoolData, usePoolData } from '../hooks';
import { invalidatePoolQueries } from '../utils/poolUtils';

interface TopUpDialogProps {
  open: boolean;
  onClose: () => void;
  poolId: string;
}

const validationSchema = yup.object({
  amount: yup
    .string()
    .required('Amount is required')
    .test('positive', 'Amount must be positive', value => {
      const num = parseFloat(value || '0');
      return num > 0;
    }),
});

function TopUpDialogContent({
  formik,
  pool,
}: {
  formik: ReturnType<typeof useFormik<{ amount: string }>>;
  pool?: PoolData;
}) {
  const handleMaxClick = useCallback(() => {
    // For now, no max limit - operator can top up any amount
    // Could add wallet balance check here if needed
  }, []);

  if (!pool) return null;

  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        Add {pool.rewardToken.symbol} rewards to the pool. These funds will be distributed to
        delegators based on their pool share.
      </Typography>

      <FormRow>
        <FormikTextInput
          id="amount"
          label={`Amount (${pool.rewardToken.symbol})`}
          formik={formik}
          showErrorOnlyOfTouched
          autoComplete="off"
          placeholder="0"
        />
      </FormRow>

      <Divider />

      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">Amount to Add</Typography>
          <Typography variant="body2">
            {formik.values.amount || '0'} {pool.rewardToken.symbol}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export function TopUpDialog({ open, onClose, poolId }: TopUpDialogProps) {
  const queryClient = useQueryClient();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();
  const { data: pool } = usePoolData(poolId);

  const formik = useFormik({
    initialValues: {
      amount: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async values => {
      if (!pool) return;

      try {
        const decimals = pool.rewardToken.decimals;
        const rewardAmount = BigInt(Math.floor(parseFloat(values.amount) * 10 ** decimals));

        await writeTransactionAsync({
          address: poolId as `0x${string}`,
          abi: portalPoolAbi,
          functionName: 'topUpRewards',
          args: [rewardAmount],
          approve: rewardAmount,
          approveToken: pool.rewardToken.address,
        });

        await invalidatePoolQueries(queryClient, poolId);
        formik.resetForm();
        onClose();
      } catch (error) {
        toast.error(errorMessage(error));
      }
    },
  });

  const handleResult = useCallback(
    (confirmed: boolean) => {
      if (!confirmed) {
        formik.resetForm();
        return onClose();
      }
      formik.handleSubmit();
    },
    [onClose, formik],
  );

  return (
    <ContractCallDialog
      title="Top Up Pool Rewards"
      open={open}
      onResult={handleResult}
      loading={isPending}
      confirmColor="success"
      disableConfirmButton={!formik.isValid || !formik.values.amount}
    >
      <TopUpDialogContent formik={formik} pool={pool} />
    </ContractCallDialog>
  );
}

interface TopUpButtonProps {
  poolId: string;
}

export function TopUpButton({ poolId }: TopUpButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: pool } = usePoolData(poolId);

  const handleOpen = useCallback(() => setDialogOpen(true), []);
  const handleClose = useCallback(() => setDialogOpen(false), []);

  return (
    <>
      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={handleOpen}
        disabled={pool?.phase === 'collecting'}
      >
        TOP UP
      </Button>
      <TopUpDialog open={dialogOpen} onClose={handleClose} poolId={poolId} />
    </>
  );
}

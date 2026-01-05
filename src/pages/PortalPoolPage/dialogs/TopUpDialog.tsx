import { useState, useCallback } from 'react';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { FormRow, FormikTextInput } from '@components/Form';
import { useRewardToken } from '@hooks/useRewardToken';

import { invalidatePoolQueries } from '../utils/poolUtils';
import { usePoolData } from '../hooks';
import toast from 'react-hot-toast';
import { errorMessage } from '@api/contracts/utils';

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
}: {
  formik: ReturnType<typeof useFormik<{ amount: string }>>;
}) {
  const { data: rewardToken } = useRewardToken();

  const handleMaxClick = useCallback(() => {
    // For now, no max limit - operator can top up any amount
    // Could add wallet balance check here if needed
  }, []);

  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        Add {rewardToken?.symbol ?? 'USDC'} rewards to the pool. These funds will be distributed to
        delegators based on their pool share.
      </Typography>

      <FormRow>
        <FormikTextInput
          id="amount"
          label={`Amount (${rewardToken?.symbol ?? 'USDC'})`}
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
            {formik.values.amount || '0'} {rewardToken?.symbol ?? 'USDC'}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export function TopUpDialog({ open, onClose, poolId }: TopUpDialogProps) {
  const queryClient = useQueryClient();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();
  const { address: rewardTokenAddress, data: rewardToken } = useRewardToken();

  const formik = useFormik({
    initialValues: {
      amount: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async values => {
      if (!rewardTokenAddress) return;

      try {
        const decimals = rewardToken?.decimals ?? 6;
        const rewardAmount = BigInt(Math.floor(parseFloat(values.amount) * 10 ** decimals));

        await writeTransactionAsync({
          address: poolId as `0x${string}`,
          abi: portalPoolAbi,
          functionName: 'topUpRewards',
          args: [rewardAmount],
          approve: rewardAmount,
          approveToken: rewardTokenAddress,
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
      <TopUpDialogContent formik={formik} />
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

import { useCallback, useMemo, useState } from 'react';

import { EditOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { FormRow, FormikTextInput } from '@components/Form';
import { useRewardToken } from '@hooks/useRewardToken';
import { fromSqd, toSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import { usePoolData } from '../hooks';
import { invalidatePoolQueries } from '../utils/poolUtils';

// Edit Capacity Dialog
interface EditCapacityDialogProps {
  open: boolean;
  onClose: () => void;
  poolId: string;
}

const capacityValidationSchema = yup.object({
  capacity: yup
    .string()
    .required('Capacity is required')
    .test('positive', 'Capacity must be positive', value => {
      const num = parseFloat(value || '0');
      return num > 0;
    }),
});

export function EditCapacityDialog({ open, onClose, poolId }: EditCapacityDialogProps) {
  const queryClient = useQueryClient();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();
  const { data: pool } = usePoolData(poolId);
  const { SQD_TOKEN } = useContracts();

  const initialCapacity = useMemo(() => {
    if (!pool) return '';
    return fromSqd(pool.tvl.max).toString();
  }, [pool]);

  const formik = useFormik({
    initialValues: {
      capacity: initialCapacity,
    },
    validationSchema: capacityValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: async values => {
      try {
        const newCapacity = BigInt(toSqd(values.capacity));

        await writeTransactionAsync({
          address: poolId as `0x${string}`,
          abi: portalPoolAbi,
          functionName: 'setCapacity',
          args: [newCapacity],
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
      title="Edit Max Pool Capacity"
      open={open}
      onResult={handleResult}
      loading={isPending}
      disableConfirmButton={!formik.isValid}
    >
      <FormRow>
        <FormikTextInput
          id="capacity"
          label={`Max Pool Capacity (${SQD_TOKEN})`}
          formik={formik}
          showErrorOnlyOfTouched
          autoComplete="off"
          placeholder="0"
        />
      </FormRow>
    </ContractCallDialog>
  );
}

export function EditCapacityButton({ poolId, disabled }: { poolId: string; disabled?: boolean }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = useCallback(() => setDialogOpen(true), []);
  const handleClose = useCallback(() => setDialogOpen(false), []);

  return (
    <>
      <IconButton size="small" onClick={handleOpen} disabled={disabled}>
        <EditOutlined fontSize="small" />
      </IconButton>
      <EditCapacityDialog open={dialogOpen} onClose={handleClose} poolId={poolId} />
    </>
  );
}

// Edit Distribution Rate Dialog
interface EditDistributionRateDialogProps {
  open: boolean;
  onClose: () => void;
  poolId: string;
}

const distributionRateValidationSchema = yup.object({
  distributionRate: yup
    .string()
    .required('Distribution rate is required')
    .test('positive', 'Distribution rate must be positive', value => {
      const num = parseFloat(value || '0');
      return num > 0;
    }),
});

export function EditDistributionRateDialog({
  open,
  onClose,
  poolId,
}: EditDistributionRateDialogProps) {
  const queryClient = useQueryClient();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();
  const { data: pool } = usePoolData(poolId);
  const { data: rewardToken } = useRewardToken();

  const initialDistributionRate = useMemo(() => {
    if (!pool) return '';
    return (pool.monthlyPayoutUsd / 30).toFixed(2);
  }, [pool]);

  const formik = useFormik({
    initialValues: {
      distributionRate: initialDistributionRate,
    },
    validationSchema: distributionRateValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: async values => {
      try {
        const rewardDecimals = rewardToken?.decimals ?? 6;

        // Convert daily rate to per-second rate with reward token decimals
        const distributionRatePerSecond = BigInt(
          BigNumber(values.distributionRate)
            .div(86400) // Convert daily to per-second
            .multipliedBy(10 ** rewardDecimals)
            .toFixed(0),
        );

        await writeTransactionAsync({
          address: poolId as `0x${string}`,
          abi: portalPoolAbi,
          functionName: 'setDistributionRate',
          args: [distributionRatePerSecond],
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
      title="Edit Distribution Rate"
      open={open}
      onResult={handleResult}
      loading={isPending}
      disableConfirmButton={!formik.isValid}
    >
      <FormRow>
        <FormikTextInput
          id="distributionRate"
          label={`Distribution Rate (${rewardToken?.symbol ?? 'USDC'}/day)`}
          formik={formik}
          showErrorOnlyOfTouched
          autoComplete="off"
          placeholder="0"
        />
      </FormRow>
    </ContractCallDialog>
  );
}

export function EditDistributionRateButton({
  poolId,
  disabled,
}: {
  poolId: string;
  disabled?: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = useCallback(() => setDialogOpen(true), []);
  const handleClose = useCallback(() => setDialogOpen(false), []);

  return (
    <>
      <IconButton size="small" onClick={handleOpen} disabled={disabled}>
        <EditOutlined fontSize="small" />
      </IconButton>
      <EditDistributionRateDialog open={dialogOpen} onClose={handleClose} poolId={poolId} />
    </>
  );
}

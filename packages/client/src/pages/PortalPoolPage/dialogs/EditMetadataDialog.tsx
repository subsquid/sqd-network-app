import { useCallback, useMemo, useState } from 'react';

import { EditOutlined } from '@mui/icons-material';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { FormRow, FormikTextInput } from '@components/Form';
import { Loader } from '@components/Loader';

import { usePoolData } from '../hooks';
import { EDIT_METADATA_DIALOG_TEXTS } from '../texts';
import { invalidatePoolQueries } from '../utils/poolUtils';

interface EditMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  poolId: string;
}

const metadataValidationSchema = yup.object({
  name: yup.string().required('Name is required').max(100, 'Name must be at most 100 characters'),
  description: yup.string().max(500, 'Description must be at most 500 characters'),
  website: yup
    .string()
    .url('Website must be a valid URL')
    .max(200, 'Website must be at most 200 characters'),
});

export function EditMetadataDialog({ open, onClose, poolId }: EditMetadataDialogProps) {
  const queryClient = useQueryClient();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();
  const { data: pool, isLoading } = usePoolData(poolId);

  const initialValues = useMemo(() => {
    if (!pool) {
      return {
        name: '',
        description: '',
        website: '',
      };
    }
    return {
      name: pool.name || '',
      description: pool.description || '',
      website: pool.website || '',
    };
  }, [pool]);

  const formik = useFormik({
    initialValues,
    validationSchema: metadataValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: async values => {
      try {
        // Create metadata JSON object
        const metadata = {
          name: values.name,
          description: values.description || undefined,
          website: values.website || undefined,
        };

        // Remove undefined values
        const cleanMetadata = Object.fromEntries(
          Object.entries(metadata).filter(([_, v]) => v !== undefined),
        );

        const metadataString = JSON.stringify(cleanMetadata);

        // Call setMetadata on the pool contract
        // The pool contract will update the portal registry
        await writeTransactionAsync({
          address: poolId as `0x${string}`,
          abi: portalPoolAbi,
          functionName: 'setMetadata',
          args: [metadataString],
        });

        await invalidatePoolQueries(queryClient, poolId);
        formik.resetForm();
        onClose();
        toast.success('Pool metadata updated successfully');
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
      title={EDIT_METADATA_DIALOG_TEXTS.title}
      open={open}
      onResult={handleResult}
      loading={isPending}
      disableConfirmButton={!formik.isValid}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Stack spacing={2}>
          <FormRow>
            <FormikTextInput
              id="name"
              label={EDIT_METADATA_DIALOG_TEXTS.nameLabel}
              formik={formik}
              showErrorOnlyOfTouched
              autoComplete="off"
              placeholder="My Portal Pool"
            />
          </FormRow>
          <FormRow>
            <FormikTextInput
              id="description"
              label={EDIT_METADATA_DIALOG_TEXTS.descriptionLabel}
              formik={formik}
              showErrorOnlyOfTouched
              autoComplete="off"
              placeholder="A brief description of your pool"
              multiline
              rows={3}
            />
          </FormRow>
          <FormRow>
            <FormikTextInput
              id="website"
              label={EDIT_METADATA_DIALOG_TEXTS.websiteLabel}
              formik={formik}
              showErrorOnlyOfTouched
              autoComplete="off"
              placeholder="https://example.com"
            />
          </FormRow>
        </Stack>
      )}
    </ContractCallDialog>
  );
}

export function EditMetadataButton({ poolId, disabled }: { poolId: string; disabled?: boolean }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = useCallback(() => setDialogOpen(true), []);
  const handleClose = useCallback(() => setDialogOpen(false), []);

  return (
    <>
      <Tooltip title="Edit metadata">
        <IconButton size="small" onClick={handleOpen} disabled={disabled}>
          <EditOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      <EditMetadataDialog open={dialogOpen} onClose={handleClose} poolId={poolId} />
    </>
  );
}

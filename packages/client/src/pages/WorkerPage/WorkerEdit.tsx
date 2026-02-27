import { useState } from 'react';

import { EditOutlined } from '@mui/icons-material';
import { IconButton, SxProps } from '@mui/material';
import * as yup from '@schema';
import { useFormik } from 'formik';
import { useAccount, useClient } from 'wagmi';

import { useReadRouterWorkerRegistration, workerRegistryAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { encodeWorkerMetadata } from '@api/contracts/worker-registration/WorkerMetadata';
import { AccountType, type WorkerDetailed } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormRow, FormikTextInput } from '@components/Form';
import { useContracts } from '@hooks/network/useContracts';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { peerIdToHex } from '@lib/network';

export const editWorkerSchema = yup.object({
  name: yup.string().label('Name').max(255).trim().required('Worker name is required'),
  description: yup.string().label('Description').max(2000).trim(),
  email: yup.string().label('Email address').trim(),
  website: yup.string().label('Website').trim(),
});

export function WorkerEdit({
  sx,
  disabled,
  worker,
  owner,
}: {
  sx?: SxProps;
  disabled?: boolean;
  worker: Pick<WorkerDetailed, 'peerId' | 'name' | 'website' | 'description' | 'email'>;
  owner: { id: string; type: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        color="inherit"
        sx={{ padding: 0, ...sx }}
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        <EditOutlined fontSize="inherit" />
      </IconButton>
      <WorkerEditDialog worker={worker} owner={owner} open={open} onResult={() => setOpen(false)} />
    </>
  );
}

function WorkerEditDialog({
  worker,
  owner,
  open,
  onResult,
}: {
  worker: Pick<WorkerDetailed, 'name' | 'description' | 'website' | 'email' | 'peerId'>;
  owner: { id: string; type: string };
  open: boolean;
  onResult: (confirmed: boolean) => void;
}) {
  const client = useClient();
  const account = useAccount();

  const { setWaitHeight } = useSquidHeight();

  const contracts = useContracts();
  const contractWriter = useWriteSQDTransaction();

  const { data: registrationAddress, isLoading: isRegistrationAddressLoading } =
    useReadRouterWorkerRegistration({
      address: contracts.ROUTER,
    });

  const isLoading = isRegistrationAddressLoading;

  const formik = useFormik({
    initialValues: {
      name: worker.name || '',
      description: worker.description || '',
      website: worker.website || '',
      email: worker.email || '',
      peerId: worker.peerId || '',
    },
    validationSchema: editWorkerSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,

    onSubmit: async values => {
      if (!client || !account.address || !registrationAddress) return;

      const metadata = editWorkerSchema.cast(values);

      const peerIdHex = peerIdToHex(worker.peerId);

      const receipt = await contractWriter.writeTransactionAsync({
        address: registrationAddress,
        abi: workerRegistryAbi,
        functionName: 'updateMetadata',
        args: [peerIdHex, encodeWorkerMetadata(metadata)],
        vesting: owner.type === AccountType.User ? undefined : (owner.id as `0x${string}`),
      });
      setWaitHeight(receipt.blockNumber, []);

      onResult(true);
    },
  });

  return (
    <ContractCallDialog
      title="Worker edit"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onResult(confirmed);

        formik.handleSubmit();
      }}
      loading={isLoading}
    >
      <Form onSubmit={formik.handleSubmit}>
        <FormRow>
          <FormikTextInput
            showErrorOnlyOfTouched
            id="peerId"
            label="Peer ID"
            formik={formik}
            disabled
          />
        </FormRow>
        <FormRow>
          <FormikTextInput showErrorOnlyOfTouched id="name" label="Worker name" formik={formik} />
        </FormRow>
        <FormRow>
          <FormikTextInput
            showErrorOnlyOfTouched
            id="description"
            multiline
            minRows={3}
            label="Description"
            formik={formik}
          />
        </FormRow>
        <FormRow>
          <FormikTextInput showErrorOnlyOfTouched id="website" label="Website" formik={formik} />
        </FormRow>
      </Form>
    </ContractCallDialog>
  );
}

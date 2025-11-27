import { useState } from 'react';

import { peerIdToHex } from '@lib/network';
import { EditOutlined } from '@mui/icons-material';
import { IconButton, SxProps } from '@mui/material';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useClient } from 'wagmi';

import { useReadRouterWorkerRegistration, workerRegistryAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { encodeWorkerMetadata } from '@api/contracts/worker-registration/WorkerMetadata';
import { Account, AccountType, Worker } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormikTextInput, FormRow } from '@components/Form';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts';

import * as yup from '@schema';

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
  worker: Pick<Worker, 'peerId' | 'name' | 'website' | 'description' | 'email'>;
  owner: Pick<Account, 'id' | 'type'>;
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
  worker: Pick<Worker, 'name' | 'description' | 'website' | 'email' | 'peerId'>;
  owner: Pick<Account, 'id' | 'type'>;
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

      try {
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
      } catch (error) {
        toast.error(errorMessage(error));
      }
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
        {/* <Box mt={3} justifyContent="flex-end" display="flex">
        <LoadingButton disabled={isUpdating} variant="contained" type="submit" color="info">
          APPLY
        </LoadingButton>
      </Box> */}
      </Form>
    </ContractCallDialog>
  );
}

// export function WorkerEdit() {
//   const { peerId } = useParams<{ peerId: string }>();
//   const { data: worker, isPending } = useWorkerByPeerId(peerId);
//   const { address } = useAccount();

//   return (
//     <CenteredPageWrapper>
//       <ConnectedWalletRequired>
//         <NetworkPageTitle backPath={`/workers/${peerId}`} />
//         {isPending ? (
//           <Loader />
//         ) : !worker || worker.realOwner.id !== address ? (
//           <NotFound id={peerId} item="worker" />
//         ) : (
//           <WorkerForm worker={worker} />
//         )}
//       </ConnectedWalletRequired>
//     </CenteredPageWrapper>
//   );
// }

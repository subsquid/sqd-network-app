import { useCallback, useEffect, useMemo, useState } from 'react';

import { Add } from '@mui/icons-material';
import { Button, SxProps } from '@mui/material';
import * as yup from '@schema';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import useLocalStorageState from 'use-local-storage-state';

import {
  useReadRouterWorkerRegistration,
  useReadWorkerRegistryBondAmount,
  workerRegistryAbi,
} from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { encodeWorkerMetadata } from '@api/contracts/worker-registration/WorkerMetadata';
import { AccountType, SourceWalletWithBalance, WorkerStatus } from '@api/subsquid-network-squid';
import { useWorkerByPeerId } from '@api/subsquid-network-squid/workers-graphql';
import { ConfirmDialog } from '@components/ConfirmDialog';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormRow, FormikCheckBoxInput, FormikTextInput } from '@components/Form';
import { FormikSelect } from '@components/Form/FormikSelect';
import { HelpTooltip } from '@components/HelpTooltip';
import { Loader } from '@components/Loader';
import { SourceWalletOption } from '@components/SourceWallet';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { fromSqd, peerIdToHex } from '@lib/network/utils';
import { useContracts } from '@hooks/network/useContracts';
import { useWorkersChatUrl } from '@hooks/network/useWorkersChat';

export const addWorkerSchema = yup.object({
  name: yup.string().label('Name').max(255).trim().required('Worker name is required'),
  description: yup.string().label('Description').max(2000).trim(),
  email: yup.string().label('Email address').trim(),
  website: yup.string().label('Website').trim(),
  peerId: yup
    .string()
    .matches(/^[a-z1-9]+$/i, 'Peer ID must contains only base 58 symbols')
    .max(52)
    .min(52)
    .label('Peer ID')
    .trim()
    .required('Peer ID is required'),
  source: yup.string().label('Source address').trim().required('Source address is required'),
  amount: yup
    .decimal()
    .label('Amount')
    .required()
    .positive()
    .max(yup.ref('max'), 'Insufficient balance')
    .typeError('${path} is invalid'),
  max: yup.string().label('Max').required().typeError('${path} is invalid'),
});

export function AddWorkerButton({
  sx,
  disabled,
  sources,
}: {
  sx?: SxProps;
  disabled?: boolean;
  sources?: SourceWalletWithBalance[];
}) {
  const [open, setOpen] = useState(false);

  const [isJoinChatOpen, setJoinChatOpen] = useState(false);
  const [skipWorkerJoinChat] = useLocalStorageState<boolean>('sqd_skip_join_workers_chat');

  return (
    <>
      <Button
        disabled={disabled}
        sx={sx}
        loading={open}
        color="info"
        startIcon={<Add />}
        variant="contained"
        onClick={() => setOpen(true)}
      >
        ADD WORKER
      </Button>
      <AddNewWorkerDialog
        open={open}
        onResult={confirmed => {
          setOpen(false);

          if (confirmed && !skipWorkerJoinChat) {
            setJoinChatOpen(true);
          }
        }}
        sources={sources}
      />
      <JoinChatDialog
        open={isJoinChatOpen}
        onResult={() => {
          setJoinChatOpen(false);
        }}
      />
    </>
  );
}

export function AddNewWorkerDialog({
  open,
  onResult,
  sources,
}: {
  open: boolean;
  onResult: (confirmed: boolean) => void;
  sources?: SourceWalletWithBalance[];
}) {
  const { setWaitHeight } = useSquidHeight();

  const contracts = useContracts();
  const contractWriter = useWriteSQDTransaction();

  const { data: workerRegistryAddress, isLoading: isWorkerRegistryAddressLoading } =
    useReadRouterWorkerRegistration({
      address: contracts.ROUTER,
    });

  const { data: bondAmount, isPending: isBondLoading } = useReadWorkerRegistryBondAmount({
    address: workerRegistryAddress,
  });

  const isLoading = isWorkerRegistryAddressLoading || isBondLoading;

  const isSourceDisabled = useCallback(
    (source: SourceWalletWithBalance) => BigInt(source.balance) < (bondAmount || 0n),
    [bondAmount],
  );

  const initialValues = useMemo(() => {
    const source = sources?.find(s => !isSourceDisabled(s)) || sources?.[0];

    return {
      name: '',
      description: '',
      website: '',
      email: '',
      peerId: '',
      source: source?.id || '',
      amount: fromSqd(bondAmount).toString(),
      max: fromSqd(source?.balance).toString(),
    };
  }, [bondAmount, isSourceDisabled, sources]);

  const [peerIdToValidate, setPeerIdToValidate] = useState('');
  const { data: existingWorker } = useWorkerByPeerId(peerIdToValidate);

  const formik = useFormik({
    initialValues,
    validationSchema: addWorkerSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,
    validate: values => {
      const errors: Record<string, string> = {};

      if (values.peerId && existingWorker && existingWorker.status !== WorkerStatus.Withdrawn) {
        errors.peerId = 'Peer ID is already registered';
      }

      return errors;
    },
    onSubmit: async values => {
      if (!workerRegistryAddress || !bondAmount) return;

      try {
        const { peerId, source: sourceId, ...metadata } = addWorkerSchema.cast(values);

        const source = sources?.find(s => s.id === sourceId);
        if (!source) return;

        const peerIdHex = peerIdToHex(peerId);

        const receipt = await contractWriter.writeTransactionAsync({
          address: workerRegistryAddress,
          abi: workerRegistryAbi,
          functionName: 'register',
          args: [peerIdHex, encodeWorkerMetadata(metadata)],
          vesting: source.type === AccountType.User ? undefined : (source.id as `0x${string}`),
          approve: bondAmount,
        });
        setWaitHeight(receipt.blockNumber, []);

        formik.resetForm();

        onResult(true);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    },
  });

  // Update peerId to validate when form value changes
  useEffect(() => {
    if (formik.values.peerId) {
      setPeerIdToValidate(formik.values.peerId);
    }
  }, [formik.values.peerId]);

  return (
    <>
      <ContractCallDialog
        title="Worker registration"
        open={open}
        onResult={confirmed => {
          if (!confirmed) return onResult(confirmed);

          formik.handleSubmit();
        }}
        disableConfirmButton={isLoading || !formik.isValid}
        loading={contractWriter.isPending}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Form onSubmit={formik.handleSubmit}>
              <FormRow>
                <FormikSelect
                  id="source"
                  showErrorOnlyOfTouched
                  options={
                    sources?.map(s => {
                      return {
                        label: <SourceWalletOption source={s} />,
                        value: s.id,
                        disabled: isSourceDisabled(s),
                      };
                    }) || []
                  }
                  formik={formik}
                  onChange={e => {
                    const source = sources?.find(w => w?.id === e.target.value);
                    if (!source) return;

                    formik.setFieldValue('source', source.id);
                    formik.setFieldValue('max', fromSqd(source.balance).toString());
                  }}
                />
              </FormRow>
              <FormRow>
                <FormikTextInput
                  showErrorOnlyOfTouched
                  id="amount"
                  label="Bond amount"
                  formik={formik}
                  disabled
                />
              </FormRow>
              <FormRow>
                <FormikTextInput
                  showErrorOnlyOfTouched
                  id="peerId"
                  label={
                    <HelpTooltip title="A PeerID is a unique identifier that distinguishes one peer from another within the SQD Network">
                      <span>Peer ID</span>
                    </HelpTooltip>
                  }
                  formik={formik}
                />
              </FormRow>
              <FormRow>
                <FormikTextInput
                  showErrorOnlyOfTouched
                  id="name"
                  label="Worker name"
                  formik={formik}
                />
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
                <FormikTextInput
                  showErrorOnlyOfTouched
                  id="website"
                  label="Website"
                  formik={formik}
                />
              </FormRow>
            </Form>
          </>
        )}
      </ContractCallDialog>
    </>
  );
}

function JoinChatDialog({
  open,
  onResult,
}: {
  open: boolean;
  onResult: (confirmed: boolean) => void;
}) {
  const [, setSkipWorkerJoinChat] = useLocalStorageState<boolean>('sqd_skip_join_workers_chat');
  const chatUrl = useWorkersChatUrl();

  const formik = useFormik({
    initialValues: {
      doNotShow: false,
    },

    onSubmit: async values => {
      setSkipWorkerJoinChat(values.doNotShow);
      onResult(true);
    },
  });

  return (
    <ConfirmDialog
      open={open}
      title="Worker registered!"
      confirmButtonText="JOIN CHAT"
      confirmColor="success"
      hideCancelButton
      onApprove={() => window.open(chatUrl)}
      onResult={(confirmed: boolean) => {
        if (!confirmed) onResult(confirmed);

        formik.handleSubmit();
      }}
    >
      <Form onSubmit={formik.handleSubmit}>
        Join the <b>SQD Network</b> node operators chat for support and updates on worker images.
        <FormRow>
          <FormikCheckBoxInput id="doNotShow" label="Don't show this again" formik={formik} />
        </FormRow>
      </Form>
    </ConfirmDialog>
  );
}

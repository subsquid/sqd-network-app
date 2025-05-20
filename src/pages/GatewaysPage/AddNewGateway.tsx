import { useMemo, useState } from 'react';

import { peerIdToHex } from '@lib/network';
import { Add } from '@mui/icons-material';
import { Button, SxProps } from '@mui/material';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useClient } from 'wagmi';

import { gatewayRegistryAbi } from '@api/contracts';
import { encodeGatewayMetadata } from '@api/contracts/gateway-registration/GatewayMetadata';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { AccountType, SourceWalletWithBalance } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormikSwitch, FormikTextInput, FormRow } from '@components/Form';
import { FormikSelect } from '@components/Form/FormikSelect';
import { HelpTooltip } from '@components/HelpTooltip';
import { Loader } from '@components/Loader';
import { SourceWalletOption } from '@components/SourceWallet';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { useContracts } from '@network/useContracts';

import { addGatewaySchema } from './gateway-schema';

export function AddGatewayButton({
  sx,
  disabled,
  sources,
}: {
  sx?: SxProps;
  disabled?: boolean;
  sources?: SourceWalletWithBalance[];
}) {
  const [open, setOpen] = useState(false);

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
        ADD PORTAL
      </Button>
      <AddGatewayDialog open={open} onClose={() => setOpen(false)} sources={sources} />
    </>
  );
}

export function AddGatewayDialog({
  open,
  onClose,
  sources,
}: {
  open: boolean;
  onClose: () => void;
  sources?: SourceWalletWithBalance[];
}) {
  const client = useClient();

  const contracts = useContracts();

  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();
  const { setWaitHeight } = useSquidHeight();

  const isSourceDisabled = (source: SourceWalletWithBalance) => source.type === AccountType.Vesting;
  const hasAvailableSource = useMemo(() => !!sources?.some(s => !isSourceDisabled(s)), [sources]);

  const initialValues = useMemo(() => {
    const source = sources?.find(s => !isSourceDisabled(s)) || sources?.[0];

    return {
      source: source?.id || '0x',
      name: '',
      description: '',
      website: '',
      public: false,
      email: '',
      peerId: '',
      endpointUrl: '',
    };
  }, [sources]);

  const formik = useFormik({
    initialValues,
    validationSchema: addGatewaySchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,

    onSubmit: async values => {
      if (!client) return;

      const source = sources?.find(s => s.id === values.source);
      if (!source) return;

      try {
        const castedValues = addGatewaySchema.cast(values);
        if (!castedValues.public) {
          delete castedValues.email;
        }

        const receipt = await writeTransactionAsync({
          address: contracts.GATEWAY_REGISTRATION,
          abi: gatewayRegistryAbi,
          functionName: 'register',
          args: [peerIdToHex(castedValues.peerId), encodeGatewayMetadata(castedValues)],
        });
        setWaitHeight(receipt.blockNumber, []);

        onClose();
      } catch (e: unknown) {
        toast.error(errorMessage(e));
      }
    },
  });

  return (
    <ContractCallDialog
      title="Portal registration"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onClose();

        formik.handleSubmit();
      }}
      loading={isPending}
      disableConfirmButton={!hasAvailableSource}
    >
      {!sources ? (
        <Loader />
      ) : (
        <Form onSubmit={formik.handleSubmit}>
          <FormRow>
            <FormikSelect
              id="source"
              showErrorOnlyOfTouched
              options={sources.map(s => {
                return {
                  label: <SourceWalletOption source={s} />,
                  value: s.id,
                  disabled: isSourceDisabled(s),
                };
              })}
              formik={formik}
            />
          </FormRow>
          <FormRow>
            <FormikTextInput showErrorOnlyOfTouched id="name" label="Portal name" formik={formik} />
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
            <FormikSwitch id="public" label="Publicly available" formik={formik} />
          </FormRow>

          {formik.values.public ? (
            <>
              <FormRow>
                <FormikTextInput
                  showErrorOnlyOfTouched
                  id="endpointUrl"
                  label="Public endpoint URL"
                  formik={formik}
                />
              </FormRow>
              <FormRow>
                <FormikTextInput
                  showErrorOnlyOfTouched
                  id="email"
                  label="Email address"
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
            </>
          ) : null}
        </Form>
      )}
    </ContractCallDialog>
  );
}

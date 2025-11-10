import { useCallback, useMemo, useState } from 'react';

import { fromSqd, toSqd } from '@lib/network/utils';
import { Button, Chip } from '@mui/material';
import * as yup from '@schema';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';

import { buyBackAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { AccountType, SourceWalletWithBalance } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormikSelect, FormikTextInput, FormRow } from '@components/Form';
import { SourceWalletOption } from '@components/SourceWallet';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';

export const depositSchema = yup.object({
  source: yup.string().label('Source').trim().required().typeError('${path} is invalid'),
  amount: yup
    .decimal()
    .label('Amount')
    .required()
    .positive()
    .max(yup.ref('max'), 'Insufficient balance')
    .typeError('${path} is invalid'),
  max: yup.string().label('Max').required().typeError('${path} is invalid'),
});

export function DepositButton({
  sources,
  address,
  disabled,
  variant = 'outlined',
}: {
  sources?: SourceWalletWithBalance[];
  address?: string;
  variant?: 'outlined' | 'contained';
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        loading={open}
        disabled={disabled || !address}
        onClick={() => setOpen(true)}
        variant={variant}
        color={variant === 'contained' ? 'info' : 'secondary'}
      >
        DEPOSIT
      </Button>
      <DepositDialog
        open={open}
        onClose={() => setOpen(false)}
        sources={sources}
        address={address}
      />
    </>
  );
}

export function DepositDialog({
  open,
  sources,
  address,
  onClose,
}: {
  open: boolean;
  sources?: SourceWalletWithBalance[];
  address?: string;
  onClose: () => void;
}) {
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();

  const { setWaitHeight } = useSquidHeight();

  const isSourceDisabled = useCallback(
    (source: SourceWalletWithBalance) => source.balance === '0',
    [],
  );

  const initialValues = useMemo(() => {
    const source = sources?.find(c => !isSourceDisabled(c)) || sources?.[0];

    return {
      source: source?.id || '',
      amount: '0',
      max: fromSqd(source?.balance).toString(),
    };
  }, [sources, isSourceDisabled]);

  const formik = useFormik({
    initialValues,
    validationSchema: depositSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,

    onSubmit: async values => {
      if (!address) return;

      try {
        const { amount, source: sourceId } = depositSchema.cast(values);

        const source = sources?.find(w => w?.id === sourceId);
        if (!source) return;

        const sqdAmount = BigInt(toSqd(amount));

        const receipt = await writeTransactionAsync({
          abi: buyBackAbi,
          address: address as `0x${string}`,
          functionName: 'deposit',
          args: [sqdAmount],
          vesting: source.type === AccountType.User ? undefined : (source.id as `0x${string}`),
          approve: sqdAmount,
        });
        setWaitHeight(receipt.blockNumber, []);

        onClose();
      } catch (e) {
        toast.error(errorMessage(e));
      }
    },
  });

  return (
    <ContractCallDialog
      title="Deposit Buyback contract"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onClose();

        formik.handleSubmit();
      }}
      loading={isPending}
      disableConfirmButton={!formik.isValid}
    >
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
            id="amount"
            label="Amount"
            formik={formik}
            showErrorOnlyOfTouched
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <Chip
                  clickable
                  disabled={formik.values.max === formik.values.amount}
                  onClick={() => {
                    formik.setValues({
                      ...formik.values,
                      amount: formik.values.max,
                    });
                  }}
                  label="Max"
                />
              ),
            }}
          />
        </FormRow>
      </Form>
    </ContractCallDialog>
  );
}

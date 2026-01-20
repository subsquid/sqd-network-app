import { useMemo, useState } from 'react';

import { dateFormat } from '@i18n';
import { Lock } from '@mui/icons-material';
import { Box, Button, Chip, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import * as yup from '@schema';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useDebounce } from 'use-debounce';

import { stakingAbi, useReadRouterStaking } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import {
  AccountType,
  SourceWalletWithBalance,
  Worker,
  useCurrentEpoch,
} from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormDivider, FormRow, FormikSelect, FormikTextInput } from '@components/Form';
import { HelpTooltip } from '@components/HelpTooltip';
import { SourceWalletOption } from '@components/SourceWallet';
import { useCountdown } from '@hooks/useCountdown';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { percentFormatter } from '@lib/formatters/formatters';
import { fromSqd, toSqd } from '@lib/network';
import { useContracts } from '@hooks/network/useContracts';

import { EXPECTED_APR_TIP, useExpectedAprAfterDelegation } from './WorkerDelegate';

function UnlocksTooltip({ timestamp }: { timestamp: number }) {
  const timeLeft = useCountdown({ timestamp });

  return <span>{`Unlocks in ${timeLeft} (${dateFormat(timestamp, 'dateTime')})`}</span>;
}

export type SourceWalletWithDelegation = SourceWalletWithBalance & {
  locked: boolean;
  lockEnd?: number;
};

export const undelegateSchema = yup.object({
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

export function WorkerUndelegate({
  worker,
  disabled,
  sources,
}: {
  sources?: SourceWalletWithDelegation[];
  worker?: Pick<Worker, 'id'>;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const isSourceDisabled = (source: SourceWalletWithDelegation) =>
    source.balance === '0' || source.locked;

  const isLocked = useMemo(() => !!sources?.length && !sources?.some(d => !d.locked), [sources]);

  const { data: currentEpoch } = useCurrentEpoch();
  const unlockTimestamp = useMemo(() => {
    if (!currentEpoch) return;

    const lockEnd = sources?.reduce(
      (r, d) => {
        if (!d.lockEnd) return r;

        return !r || d.lockEnd < r ? d.lockEnd : r;
      },
      undefined as number | undefined,
    );
    if (!lockEnd) return;

    return (
      (lockEnd - currentEpoch.lastBlockL1 + 1) * currentEpoch.blockTimeL1 +
      new Date(currentEpoch.lastBlockTimestampL1).getTime()
    );
  }, [currentEpoch, sources]);

  return (
    <>
      <Tooltip
        title={
          !disabled && isLocked && unlockTimestamp && <UnlocksTooltip timestamp={unlockTimestamp} />
        }
        placement="top"
      >
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <Button
            loading={open}
            onClick={() => setOpen(true)}
            variant="outlined"
            color="error"
            disabled={!sources?.length || disabled || isLocked}
          >
            UNDELEGATE
            {isLocked && !disabled && (
              <Lock
                fontSize="small"
                sx={{
                  color: 'action.active',
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  transform: 'translate(0%, -25%)',
                  zIndex: 1,
                }}
              />
            )}
          </Button>
        </Box>
      </Tooltip>
      <WorkerUndelegateDialog
        open={open}
        onClose={() => setOpen(false)}
        worker={worker}
        sources={sources}
        isSourceDisabled={isSourceDisabled}
      />
    </>
  );
}

function WorkerUndelegateDialog({
  open,
  onClose,
  worker,
  sources,
  isSourceDisabled,
}: {
  open: boolean;
  onClose: () => void;
  worker?: Pick<Worker, 'id'>;
  sources?: SourceWalletWithDelegation[];
  isSourceDisabled: (source: SourceWalletWithDelegation) => boolean;
}) {
  const { setWaitHeight } = useSquidHeight();

  const contracts = useContracts();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();

  const { data: stakingAddress, isLoading: isStakingAddressLoading } = useReadRouterStaking({
    address: contracts.ROUTER,
  });

  const initialValues = useMemo(() => {
    const source = sources?.find(c => !isSourceDisabled(c)) || sources?.[0];

    return {
      source: source?.id || '',
      amount: '',
      max: fromSqd(source?.balance).toString(),
    };
  }, [sources, isSourceDisabled]);

  const formik = useFormik({
    initialValues,
    validationSchema: undelegateSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,

    onSubmit: async values => {
      if (!stakingAddress) return;
      if (!worker) return;

      try {
        const { amount, source: sourceId } = undelegateSchema.cast(values);

        const source = sources?.find(w => w?.id === sourceId);
        if (!source) return;

        const sqdAmount = BigInt(toSqd(amount));

        const receipt = await writeTransactionAsync({
          abi: stakingAbi,
          address: stakingAddress,
          functionName: 'withdraw',
          args: [BigInt(worker.id), sqdAmount],
          vesting: source.type === AccountType.User ? undefined : (source.id as `0x${string}`),
        });
        setWaitHeight(receipt.blockNumber, []);

        onClose();
      } catch (e) {
        toast.error(errorMessage(e));
      }
    },
  });

  const [delegation] = useDebounce(formik.values.amount, 500);
  const { isPending: isExpectedAprPending, stakerApr } = useExpectedAprAfterDelegation({
    workerId: worker?.id,
    amount: '-' + toSqd(delegation),
    enabled: open && !!worker,
  });

  const isLoading = isStakingAddressLoading || isExpectedAprPending;

  return (
    <ContractCallDialog
      title="Undelegate worker"
      open={open}
      loading={isPending}
      onResult={confirmed => {
        if (!confirmed) return onClose();

        formik.handleSubmit();
      }}
      disableConfirmButton={isLoading || !formik.isValid}
    >
      <Form onSubmit={formik.handleSubmit}>
        <FormRow>
          <FormikSelect
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
            id="source"
            formik={formik}
            onChange={e => {
              const wallet = sources?.find(s => s.id === e.target.value);
              if (!wallet) return;

              formik.setFieldValue('source', wallet.id);
              formik.setFieldValue('max', fromSqd(wallet.balance).toFixed());
            }}
          />
        </FormRow>
        <FormRow>
          <FormikTextInput
            showErrorOnlyOfTouched
            id="amount"
            label="Amount"
            formik={formik}
            autoComplete="off"
            placeholder="0"
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
        <FormDivider />
        <Stack direction="row" justifyContent="space-between" alignContent="center">
          <Typography variant="body2">
            <HelpTooltip title={EXPECTED_APR_TIP}>Expected APR</HelpTooltip>
          </Typography>
          <Typography variant="body2">
            {isExpectedAprPending ? <Skeleton width={48} /> : percentFormatter(stakerApr)}
          </Typography>
        </Stack>
      </Form>
    </ContractCallDialog>
  );
}

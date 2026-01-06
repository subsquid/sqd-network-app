import {
  gatewayRegistryAbi,
  useReadGatewayRegistryGetStake,
  useReadGatewayRegistryMinStake,
  useReadNetworkControllerWorkerEpochLength,
  useReadRouterNetworkController,
} from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { AccountType, useCurrentEpoch } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormDivider, FormikSelect, FormikTextInput, FormRow } from '@components/Form';
import { HelpTooltip } from '@components/HelpTooltip';
import { Loader } from '@components/Loader';
import { SourceWalletOption } from '@components/SourceWallet';
import { useSourceContext } from '@contexts/SourceContext';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { dateFormat } from '@i18n';
import { numberWithCommasFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd, getBlockTime, toSqd, unwrapMulticallResult } from '@lib/network/utils';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { Box, Button, Chip, InputAdornment, Skeleton, Stack, SxProps } from '@mui/material';
import { useContracts } from '@network/useContracts';
import * as yup from '@schema';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import { useReadContracts } from 'wagmi';

const MIN_BLOCKS_LOCK = 1000;

export const stakeSchema = yup.object({
  source: yup.string().label('Source').trim().required('Source is required'),
  amount: yup
    .decimal()
    .label('Amount')
    .required()
    .positive()
    .min(yup.ref('min'))
    .max(yup.ref('max'), 'Insufficient balance')
    .typeError('${path} is invalid'),
  max: yup.string().label('Max').required().typeError('${path} is invalid'),
  min: yup.string().label('Min').required().typeError('${path} is invalid'),
  autoExtension: yup.boolean().label('Auto extend').default(true),
  durationBlocks: yup
    .number()
    .label('Locked blocks duration')
    .transform(value => (Number.isNaN(value) ? 0 : value))
    .integer()
    .min(MIN_BLOCKS_LOCK, ({ min }) => `Tokens must be locked at least ${min} blocks`)
    .required('Lock min blocks is required'),
});

export function GatewayStakeButton({ sx, disabled }: { sx?: SxProps; disabled?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        loading={open}
        startIcon={<LockIcon />}
        onClick={() => setOpen(true)}
        variant="contained"
        color="info"
        disabled={disabled}
        sx={sx}
      >
        LOCK
      </Button>
      <GatewayStakeDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function GatewayStakeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setWaitHeight } = useSquidHeight();
  const { sources, selectedSource } = useSourceContext();

  const { GATEWAY_REGISTRATION, ROUTER } = useContracts();

  const { data: networkController, isLoading: isNetworkControllerLoading } =
    useReadRouterNetworkController({
      address: ROUTER,
    });
  const { data: workerEpochLength, isLoading: isWorkerEpochLengthLoading } =
    useReadNetworkControllerWorkerEpochLength({
      address: networkController,
    });
  const { data: minStake, isLoading: isMinStakeLoading } = useReadGatewayRegistryMinStake({
    address: GATEWAY_REGISTRATION,
  });

  const { data: selectedStake, isLoading: isSelectedStakeLoading } = useReadGatewayRegistryGetStake(
    {
      address: GATEWAY_REGISTRATION,
      args: [selectedSource?.id as `0x${string}`],
      query: {
        enabled: !!selectedSource?.id,
      },
    },
  );

  const gatewayRegistryContract = useWriteSQDTransaction();

  const { data: currentEpoch, isLoading: isCurrentEpochLoading } = useCurrentEpoch();

  const isLoading =
    isCurrentEpochLoading ||
    isNetworkControllerLoading ||
    isWorkerEpochLengthLoading ||
    isMinStakeLoading ||
    isSelectedStakeLoading;

  const initialValues = useMemo(() => {
    const defaultSource = selectedSource || sources?.[0];

    return {
      source: defaultSource?.id || '0x',
      amount: !!selectedStake?.amount ? '0' : fromSqd(minStake).toFixed() || '0',
      max: fromSqd(defaultSource?.balance)?.toFixed() || '0',
      min: fromSqd(minStake)?.toFixed() || '0',
      durationBlocks: (selectedStake?.duration || MIN_BLOCKS_LOCK).toString(),
    };
  }, [sources, selectedSource, minStake, selectedStake]);

  const formik = useFormik({
    initialValues,
    validationSchema: stakeSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,

    onSubmit: async values => {
      try {
        const { amount, durationBlocks, source: sourceId } = stakeSchema.cast(values);

        const source = sources?.find(s => s.id === sourceId);
        if (!source) return;

        const sqdAmount = BigInt(toSqd(amount));

        const functionData = {
          abi: gatewayRegistryAbi,
          address: GATEWAY_REGISTRATION,
          approve: sqdAmount,
          vesting: source.type === AccountType.Vesting ? (source.id as `0x${string}`) : undefined,
        };

        const receipt = await gatewayRegistryContract.writeTransactionAsync(
          selectedStake?.amount && selectedStake.amount > 0n
            ? {
                ...functionData,
                functionName: 'addStake',
                args: [sqdAmount],
              }
            : {
                ...functionData,
                functionName: 'stake',
                args: [sqdAmount, BigInt(durationBlocks), false],
              },
        );

        setWaitHeight(receipt.blockNumber, []);
        onClose();
      } catch (e: unknown) {
        toast.error(errorMessage(e));
      }
    },
  });

  const selectedFormSource = useMemo(
    () => sources?.find(s => s.id === formik.values.source),
    [sources, formik.values.source],
  );
  const [debouncedValues] = useDebounce(stakeSchema.cast(formik.values), 500);

  const newContractValues = useReadContracts({
    contracts: [
      {
        address: GATEWAY_REGISTRATION,
        abi: gatewayRegistryAbi,
        functionName: 'computationUnitsAmount',
        args: [
          (selectedStake?.amount || 0n) + BigInt(toSqd(debouncedValues.amount)),
          BigInt(debouncedValues.durationBlocks),
        ],
      },
    ],
    query: {
      select: res => {
        if (!res) return;

        return {
          computationUnitsAmount: unwrapMulticallResult(res[0]) || 0n,
        };
      },
    },
  });

  const preview = useMemo(() => {
    if (!newContractValues.data || !currentEpoch?.lastBlockL1 || !selectedFormSource) return null;

    const workerEpochLengthValue = workerEpochLength || 0n;

    const epochCount = !debouncedValues.durationBlocks
      ? 0
      : Math.ceil(debouncedValues.durationBlocks / Number(workerEpochLengthValue));

    const cuPerEpoch = Number(
      epochCount <= 1
        ? newContractValues.data.computationUnitsAmount
        : (newContractValues.data.computationUnitsAmount * workerEpochLengthValue) /
            BigInt(debouncedValues.durationBlocks),
    );

    const unlockAt =
      new Date(currentEpoch.lastBlockTimestampL1).getTime() +
      getBlockTime(debouncedValues.durationBlocks);

    const totalAmount = new BigNumber((selectedStake?.amount || 0n).toString())
      .plus(toSqd(debouncedValues.amount))
      .toString();

    return {
      epochCount,
      cuPerEpoch,
      unlockAt,
      totalAmount,
    };
  }, [
    debouncedValues.amount,
    debouncedValues.durationBlocks,
    currentEpoch?.lastBlockTimestampL1,
    newContractValues.data,
    selectedFormSource,
    workerEpochLength,
    currentEpoch?.lastBlockL1,
    selectedStake,
  ]);

  const isPreviewLoading = useMemo(() => {
    return (
      isLoading ||
      !newContractValues.data ||
      !currentEpoch?.lastBlockL1 ||
      !selectedFormSource ||
      !preview
    );
  }, [isLoading, newContractValues.data, currentEpoch?.lastBlockL1, selectedFormSource, preview]);

  return (
    <ContractCallDialog
      title="Lock"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onClose();

        formik.handleSubmit();
      }}
      disableConfirmButton={!formik.isValid || isLoading}
      loading={gatewayRegistryContract.isPending}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Form onSubmit={formik.handleSubmit}>
          <FormRow>
            <FormikSelect
              id="source"
              showErrorOnlyOfTouched
              options={
                sources?.map(source => {
                  return {
                    label: <SourceWalletOption source={source} />,
                    value: source.id,
                    max: fromSqd(source.balance).toString(),
                  };
                }) || []
              }
              formik={formik}
              onChange={e => {
                const wallet = sources?.find(w => w?.id === e.target.value);
                if (!wallet) return;

                formik.setFieldValue('source', wallet.id);
                formik.setFieldValue('max', fromSqd(wallet.balance).toString());
              }}
            />
          </FormRow>
          <FormRow>
            <FormikTextInput
              id="amount"
              label={
                <HelpTooltip title="Locking additional SQD increases the number of CUs available per epoch">
                  <span>Amount</span>
                </HelpTooltip>
              }
              formik={formik}
              showErrorOnlyOfTouched
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Chip
                      clickable
                      disabled={formik.values.max === formik.values.amount}
                      onClick={() => {
                        formik.setValues({
                          ...formik.values,
                          amount: formik.values.max || '0',
                        });
                      }}
                      label="Max"
                    />
                  </InputAdornment>
                ),
              }}
            />
          </FormRow>
          <FormRow>
            <FormikTextInput
              id="durationBlocks"
              label={
                // TODO: add tooltip text
                <span>Duration (blocks)</span>
              }
              formik={formik}
              showErrorOnlyOfTouched
              autoComplete="off"
              disabled={!!selectedStake?.amount}
            />
          </FormRow>
          <FormDivider />
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignContent="center">
              <Box>Total amount</Box>
              {isPreviewLoading ? (
                <Skeleton width={80} />
              ) : (
                tokenFormatter(fromSqd(preview?.totalAmount), 'SQD', 6)
              )}
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignContent="center">
              <Box>Epoch count</Box>
              {isPreviewLoading ? (
                <Skeleton width={40} />
              ) : (
                numberWithCommasFormatter(preview?.epochCount)
              )}
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignContent="center">
              <HelpTooltip title="Available CUs in a current epoch. When all CUs are used, the portal will temporarily stop processing additional requests until the next epoch begins">
                <span>Available CUs</span>
              </HelpTooltip>
              {isPreviewLoading ? (
                <Skeleton width={80} />
              ) : (
                numberWithCommasFormatter(preview?.cuPerEpoch)
              )}
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignContent="center">
              <HelpTooltip title="Automatically relocked if auto extension is enabled">
                <span>Unlocked at</span>
              </HelpTooltip>
              {isPreviewLoading ? (
                <Skeleton width={180} />
              ) : (
                <span>~{dateFormat(preview?.unlockAt, 'dateTime')}</span>
              )}
            </Stack>
          </Stack>
        </Form>
      )}
    </ContractCallDialog>
  );
}

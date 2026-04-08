import { useCallback, useEffect, useMemo, useState } from 'react';

import { dateFormat } from '@i18n';
import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Divider,
  Skeleton,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { SlippageSelector } from '@pages/PortalPoolPage/components/SlippageSelector';
import { SplitPreviewRow } from '@pages/PortalPoolPage/components/SplitPreviewRow';
import {
  DISTRIBUTION_RATE_BPS,
  type FeePreviewState,
  useTopUpFeePreview,
} from '@pages/PortalPoolPage/hooks';
import { TOP_UP_DIALOG_TEXTS } from '@pages/PortalPoolPage/texts';
import {
  formatTopUpAmountLine,
  formatTopUpFeeApproxLine,
} from '@pages/PortalPoolPage/utils/topUpRewardsFormat';
import { useRewardTokens } from '@pages/PortalPoolsPage/useRewardToken';
import * as yup from '@schema';
import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';

import {
  portalPoolFactoryAbi,
  useReadPortalPoolFactoryCollectionDeadlineSeconds,
  useReadPortalPoolFactoryGetMinCapacity,
} from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import type { SourceWalletWithBalance } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormDivider, FormRow, FormikTextInput } from '@components/Form';
import { HelpTooltip } from '@components/HelpTooltip';
import { Loader } from '@components/Loader';
import { useContracts } from '@hooks/network/useContracts';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { fromSqd, toSqd } from '@lib/network/utils';

type Step = 1 | 2;

type FormikValues = {
  name: string;
  tokenSuffix: string;
  description: string;
  website: string;
  capacity: BigNumber | undefined;
  earnings: string;
  initialDeposit: BigNumber | undefined;
  isAutoSlippage: boolean;
  slippagePct: string;
};

export const addPortalSchema = ({ minCapacity }: { minCapacity: BigNumber }) => {
  return yup.object({
    name: yup.string().label('Name').trim().required('Name is required'),
    tokenSuffix: yup
      .string()
      .label('Token Suffix')
      .trim()
      .matches(/^[a-zA-Z0-9-]*$/, 'Only letters, numbers, and hyphens allowed'),
    description: yup.string().label('Description').max(500).trim(),
    website: yup.string().label('Website').url().trim(),
    capacity: yup
      .decimal()
      .label('Capacity')
      .required()
      .min(minCapacity)
      .typeError('${path} is invalid'),
    earnings: yup
      .decimal()
      .label('Expected Monthly Payment')
      .required()
      .min('0')
      .typeError('${path} is invalid'),
    initialDeposit: yup
      .decimal()
      .label('Initial Deposit')
      .required()
      .typeError('${path} is invalid')
      .test('min-daily-rate', 'Initial deposit must be at least the daily rate', function (value) {
        const { earnings } = this.parent;
        if (!value || !earnings) return true;
        const dailyRate = BigNumber(earnings).div(30);
        return BigNumber(value).gte(dailyRate);
      }),
    isAutoSlippage: yup.boolean().required(),
    slippagePct: yup.string().when('isAutoSlippage', {
      is: false,
      then: schema =>
        schema.required('Slippage is required').test('range', 'Must be between 0.01 and 50', v => {
          const n = parseFloat(v ?? '');
          return !isNaN(n) && n >= 0.01 && n <= 50;
        }),
      otherwise: schema => schema.optional(),
    }),
  });
};

export function AddPortalButton({
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
      <AddNewPortalDialog
        open={open}
        onResult={() => {
          setOpen(false);
        }}
        sources={sources}
      />
    </>
  );
}

const depositStyles: Record<string, SxProps<Theme>> = {
  splitPreviewTitle: {
    fontWeight: 600,
  },
};

function DepositStepContent({
  formik,
  isLoading,
  fee,
  tokenSymbol,
  tokenDecimals,
  suggestedInitialDeposit,
}: {
  formik: ReturnType<typeof useFormik<FormikValues>>;
  isLoading: boolean;
  fee: FeePreviewState;
  tokenSymbol: string;
  tokenDecimals: number;
  suggestedInitialDeposit: BigNumber;
}) {
  const handleSlippageChange = useCallback(
    (isAuto: boolean, pct: string) => {
      void formik.setFieldValue('isAutoSlippage', isAuto);
      void formik.setFieldValue('slippagePct', pct);
    },
    [formik.setFieldValue],
  );

  if (isLoading) return <Loader />;

  const T = TOP_UP_DIALOG_TEXTS;
  const showSplitPreview =
    fee.feeRouterReady && !fee.feeConfigError && !fee.feeConfigLoading && fee.display;

  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        {T.description(tokenSymbol)}
      </Typography>

      <FormRow>
        <FormikTextInput
          id="initialDeposit"
          label={`Initial Deposit (${tokenSymbol})`}
          formik={formik}
          showErrorOnlyOfTouched
          autoComplete="off"
          placeholder={suggestedInitialDeposit.toFixed(2)}
          helperText={`Minimum: ${suggestedInitialDeposit.toFixed(2)} ${tokenSymbol} (daily rate)`}
          InputProps={{
            endAdornment: (
              <Chip
                clickable
                onClick={() => {
                  void formik.setFieldValue('initialDeposit', suggestedInitialDeposit);
                }}
                label="Auto"
              />
            ),
          }}
        />
      </FormRow>

      <Divider />

      {!fee.feeRouterReady && (
        <Typography variant="body2" color="text.secondary">
          {T.feeRouterConnecting}
        </Typography>
      )}

      {fee.feeRouterReady && fee.feeConfigError && (
        <Typography variant="body2" color="error">
          {T.feeConfigError}
        </Typography>
      )}

      <Stack spacing={1}>
        <HelpTooltip title={T.splitPreviewTooltip}>
          <Typography component="span" variant="subtitle2" sx={depositStyles.splitPreviewTitle}>
            {T.splitPreviewTitle}
          </Typography>
        </HelpTooltip>

        {fee.feeRouterReady && !fee.feeConfigError && fee.feeConfigLoading && (
          <Stack spacing={1}>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
          </Stack>
        )}

        {showSplitPreview && fee.display && (
          <Stack spacing={1}>
            <SplitPreviewRow
              label={T.rowRewards}
              feeBps={fee.providersFeeBps}
              value={formatTopUpAmountLine(
                fee.display.providerCredit,
                tokenDecimals,
                tokenSymbol,
              )}
            />
            <SplitPreviewRow
              label={T.rowWorker}
              feeBps={fee.workerFeeBps}
              value={formatTopUpFeeApproxLine({
                stableWei: fee.display.workerStable,
                rewardDecimals: tokenDecimals,
                rewardSymbol: tokenSymbol,
                sqdPriceUsd: fee.sqdPrice,
                sqdPriceLoading: fee.sqdPriceLoading,
                sqdSymbol: fee.sqdSymbol,
              })}
            />
            <SplitPreviewRow
              label={T.rowBurn}
              feeBps={fee.burnFeeBps}
              value={formatTopUpFeeApproxLine({
                stableWei: fee.display.burnStable,
                rewardDecimals: tokenDecimals,
                rewardSymbol: tokenSymbol,
                sqdPriceUsd: fee.sqdPrice,
                sqdPriceLoading: fee.sqdPriceLoading,
                sqdSymbol: fee.sqdSymbol,
              })}
            />

            {fee.buybackSpotSqdWei != null && (
              <SplitPreviewRow
                label={T.splitRowBuybackSpotTotal}
                value={`~${formatTopUpAmountLine(fee.buybackSpotSqdWei, 18, fee.sqdSymbol)}`}
                bold
              />
            )}
          </Stack>
        )}
      </Stack>

      <Divider />

      <SlippageSelector
        isAuto={formik.values.isAutoSlippage}
        slippagePct={formik.values.slippagePct}
        isStableToken={fee.isStableToken}
        minSqdReceived={fee.minSqdFromPrice}
        minSqdBlocked={fee.minSqdBlockedReason}
        sqdSymbol={fee.sqdSymbol}
        onChange={handleSlippageChange}
      />
    </Stack>
  );
}

function AddNewPortalDialog({
  open,
  onResult,
  sources,
}: {
  open: boolean;
  onResult: (confirmed: boolean) => void;
  sources?: SourceWalletWithBalance[];
}) {
  const { setWaitHeight } = useSquidHeight();
  const { PORTAL_POOL_FACTORY } = useContracts();
  const { data: tokens, isLoading: isTokenRewardLoading } = useRewardTokens();

  const [step, setStep] = useState<Step>(1);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<`0x${string}` | undefined>();

  useEffect(() => {
    if (!open) setStep(1);
  }, [open]);

  useEffect(() => {
    if (tokens && tokens.length > 0 && !selectedTokenAddress) {
      setSelectedTokenAddress(tokens[0].address);
    }
  }, [tokens, selectedTokenAddress]);

  const selectedToken = useMemo(() => {
    if (!tokens || tokens.length === 0) return undefined;
    return tokens.find(t => t.address === selectedTokenAddress);
  }, [tokens, selectedTokenAddress]);

  const { data: minCapacity } = useReadPortalPoolFactoryGetMinCapacity({
    address: PORTAL_POOL_FACTORY,
    query: { enabled: !!PORTAL_POOL_FACTORY },
  });

  const { data: collectionDeadlineSeconds } = useReadPortalPoolFactoryCollectionDeadlineSeconds({
    address: PORTAL_POOL_FACTORY,
  });

  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();

  const isLoading = isTokenRewardLoading;
  const initialSource = sources?.[0];

  const optimalCapacity = useMemo(() => {
    return fromSqd(minCapacity).multipliedBy(1.2);
  }, [minCapacity]);

  const validationSchema = useMemo(() => {
    return addPortalSchema({ minCapacity: fromSqd(minCapacity) });
  }, [minCapacity]);

  const formik = useFormik<FormikValues>({
    initialValues: {
      name: '',
      tokenSuffix: '',
      description: '',
      website: '',
      capacity: undefined,
      earnings: '',
      initialDeposit: undefined,
      isAutoSlippage: true,
      slippagePct: TOP_UP_DIALOG_TEXTS.DEFAULT_SLIPPAGE_PCT,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: async values => {
      if (!selectedToken) {
        toast.error('Please select a reward token');
        return;
      }

      const dailyRate = BigNumber(values.earnings).div(30);
      const distributionRatePerSecond = BigInt(
        dailyRate
          .div(86400)
          .times(10 ** selectedToken.decimals)
          .times(DISTRIBUTION_RATE_BPS)
          .toFixed(0),
      );

      const initialDeposit = BigInt(
        BigNumber(values.initialDeposit!)
          .times(10 ** selectedToken.decimals)
          .toFixed(0),
      );

      const initialDepositMinSqdOut = values.isAutoSlippage ? 0n : (fee.minSqdFromPrice ?? 0n);

      const receipt = await writeTransactionAsync({
        abi: portalPoolFactoryAbi,
        address: PORTAL_POOL_FACTORY,
        functionName: 'createPortalPool',
        approve: initialDeposit,
        approveToken: selectedToken.address,
        args: [
          {
            operator: initialSource?.id as `0x${string}`,
            capacity: BigInt(toSqd(values.capacity!)),
            tokenSuffix: values.tokenSuffix.trim() || collapseTokenName(values.name),
            distributionRatePerSecond,
            initialDeposit,
            metadata: JSON.stringify({
              name: values.name,
              description: values.description,
              website: values.website,
            }),
            rewardToken: selectedToken.address,
          },
          initialDepositMinSqdOut,
        ],
      });

      setWaitHeight(receipt.blockNumber, []);
      formik.resetForm();
      setStep(1);
      onResult(true);
    },
  });

  const estimatedCUs = useMemo(() => {
    return BigNumber(formik.values.capacity || 0).multipliedBy(10);
  }, [formik.values.capacity]);

  const suggestedInitialDeposit = useMemo(() => {
    return BigNumber(formik.values.earnings || '0').div(30);
  }, [formik.values.earnings]);

  const deadlineDate = useMemo(() => {
    const date = new Date(Date.now() + Number(collectionDeadlineSeconds) * 1000);
    return dateFormat(date, 'dateTime');
  }, [collectionDeadlineSeconds]);

  const parsedInitialDeposit = useMemo((): bigint | undefined => {
    const val = formik.values.initialDeposit;
    if (!val || !selectedToken) return undefined;
    try {
      const bn = BigNumber(val);
      if (bn.isNaN() || bn.lte(0)) return undefined;
      return BigInt(bn.times(10 ** selectedToken.decimals).toFixed(0));
    } catch {
      return undefined;
    }
  }, [formik.values.initialDeposit, selectedToken]);

  const slippageBps = useMemo(() => {
    if (formik.values.isAutoSlippage) return null;
    const n = parseFloat(formik.values.slippagePct);
    return isNaN(n) ? null : Math.round(n * 100);
  }, [formik.values.isAutoSlippage, formik.values.slippagePct]);

  const fee = useTopUpFeePreview({
    rewardSymbol: selectedToken?.symbol,
    rewardDecimals: selectedToken?.decimals,
    parsedAmount: parsedInitialDeposit,
    slippageBps,
  });

  const isStep1Valid = useMemo(() => {
    if (!selectedToken) return false;
    return ['name', 'description', 'website', 'capacity', 'earnings', 'rateType'].every(
      field => !formik.errors[field as keyof FormikValues],
    );
  }, [formik.errors, selectedToken]);

  const isStep2ConfirmDisabled = useMemo(() => {
    const hasStep2Errors = ['initialDeposit', 'isAutoSlippage', 'slippagePct'].some(
      field => !!formik.errors[field as keyof FormikValues],
    );
    return (
      hasStep2Errors || !formik.values.initialDeposit || !fee.feeRouterReady || fee.feeConfigError
    );
  }, [formik.errors, formik.values.initialDeposit, fee.feeRouterReady, fee.feeConfigError]);

  const handleResult = useCallback(
    (confirmed: boolean) => {
      if (step === 1) {
        if (!confirmed) return onResult(false);
        setStep(2);
      } else {
        if (!confirmed) return setStep(1);
        formik.handleSubmit();
      }
    },
    [step, onResult, formik],
  );

  return (
    <ContractCallDialog
      title="Create Portal Pool"
      open={open}
      onResult={handleResult}
      loading={step === 2 && isPending}
      confirmButtonText={step === 1 ? 'NEXT' : 'CONFIRM'}
      cancelButtonText="BACK"
      hideCancelButton={step === 1}
      disableConfirmButton={step === 1 ? !isStep1Valid : isStep2ConfirmDisabled}
      minWidth={640}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Step {step} of 2 — {step === 1 ? 'Pool Details' : 'Initial Deposit'}
      </Typography>
      {step === 1 ? (
        isLoading ? (
          <Loader />
        ) : (
          <Form onSubmit={formik.handleSubmit}>
            <FormRow>
              <FormikTextInput id="name" label="Name" formik={formik} showErrorOnlyOfTouched />
            </FormRow>
            <FormRow>
              <FormikTextInput
                id="tokenSuffix"
                label="Token Suffix"
                formik={formik}
                showErrorOnlyOfTouched
                placeholder={collapseTokenName(formik.values.name)}
                helperText="Used in the reward token symbol. Leave blank to derive from the pool name."
              />
            </FormRow>
            <FormRow>
              <FormikTextInput
                id="description"
                label="Description"
                formik={formik}
                showErrorOnlyOfTouched
                multiline
                minRows={3}
              />
            </FormRow>
            <FormRow>
              <FormikTextInput
                id="website"
                label="Website"
                formik={formik}
                showErrorOnlyOfTouched
              />
            </FormRow>
            <FormRow>
              <FormikTextInput
                id="capacity"
                label="Pool Capacity"
                formik={formik}
                placeholder={optimalCapacity.toString()}
                showErrorOnlyOfTouched
                helperText={`Minimum: ${fromSqd(minCapacity).toFormat()} SQD`}
                InputProps={{
                  endAdornment: (
                    <Chip
                      clickable
                      onClick={() => {
                        void formik.setValues({ ...formik.values, capacity: optimalCapacity });
                      }}
                      label="Auto"
                    />
                  ),
                }}
              />
            </FormRow>
            <FormRow>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Payment Token (for fee distribution)
                </Typography>
                {tokens && tokens.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {tokens.map(token => (
                      <Button
                        key={token.address}
                        variant={selectedTokenAddress === token.address ? 'contained' : 'outlined'}
                        color={'info'}
                        onClick={() => setSelectedTokenAddress(token.address)}
                      >
                        {token.symbol}
                      </Button>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="caption" color="error">
                    No payment tokens available
                  </Typography>
                )}
              </Box>
            </FormRow>
            <FormRow>
              <FormikTextInput
                id="earnings"
                label={`Expected Monthly Payment (${selectedToken?.symbol || 'Token'})`}
                placeholder="0"
                formik={formik}
                showErrorOnlyOfTouched
              />
            </FormRow>

            <FormDivider />
            <Stack direction="column" spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignContent="center">
                <Typography variant="body2">Estimated CUs</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {estimatedCUs.toLocaleString()}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignContent="center">
                <Typography variant="body2">Collection Deadline</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {deadlineDate}
                </Typography>
              </Stack>
            </Stack>
          </Form>
        )
      ) : (
        <DepositStepContent
          formik={formik}
          isLoading={isLoading}
          fee={fee}
          tokenSymbol={selectedToken?.symbol ?? 'Token'}
          tokenDecimals={selectedToken?.decimals ?? 18}
          suggestedInitialDeposit={suggestedInitialDeposit}
        />
      )}
    </ContractCallDialog>
  );
}

function collapseTokenName(name: string): string {
  return name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
}

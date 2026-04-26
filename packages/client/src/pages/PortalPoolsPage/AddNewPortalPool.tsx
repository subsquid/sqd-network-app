import { useCallback, useEffect, useMemo, useState } from 'react';

import { dateFormat } from '@i18n';
import { Add } from '@mui/icons-material';
import {
  Alert,
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
import { SplitPreviewRow } from '@pages/PortalPoolPage/components/SplitPreviewRow';
import {
  DISTRIBUTION_RATE_BPS,
  type FeePreviewState,
  useTopUpFeePreview,
} from '@pages/PortalPoolPage/hooks';
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
import { AccountType, type SourceWalletWithBalance } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { Form, FormDivider, FormRow, FormikSelect, FormikTextInput } from '@components/Form';
import { HelpTooltip } from '@components/HelpTooltip';
import { Loader } from '@components/Loader';
import { SourceWalletOption } from '@components/SourceWallet';
import { useContracts } from '@hooks/network/useContracts';
import { supportsPortalPoolMinSqdOut } from '@hooks/network/useSubsquidNetwork';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { fromSqd, toSqd } from '@lib/network/utils';

type Step = 1 | 2;

type FormikValues = {
  source: string;
  name: string;
  tokenSuffix: string;
  description: string;
  website: string;
  capacity: BigNumber | undefined;
  earnings: string;
  initialDeposit: BigNumber | undefined;
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
      .label('Monthly Distribution Rate')
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
  if (isLoading) return <Loader />;

  const showSplitPreview =
    fee.feeRouterReady && !fee.feeConfigError && !fee.feeConfigLoading && fee.display;

  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        Enter the {tokenSymbol} amount to deposit. A portion is automatically used to buy SQD from
        the market and burn it, supporting the SQD ecosystem. The rest funds token provider rewards.
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
          Connecting to fee router…
        </Typography>
      )}

      {fee.feeRouterReady && fee.feeConfigError && (
        <Typography variant="body2" color="error">
          Failed to load fee configuration. Check your network connection.
        </Typography>
      )}

      <Stack spacing={1}>
        <HelpTooltip title="Set on-chain and applies to all pools. May change over time.">
          <Typography component="span" variant="subtitle2" sx={depositStyles.splitPreviewTitle}>
            Where your deposit goes
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
              label="Rewards"
              feeBps={fee.providersFeeBps}
              value={formatTopUpAmountLine(fee.display.providerCredit, tokenDecimals, tokenSymbol)}
            />
            <SplitPreviewRow
              label="Worker pool"
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
              label="Burn"
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
                label="Total SQD bought"
                value={`~${formatTopUpAmountLine(fee.buybackSpotSqdWei, 18, fee.sqdSymbol)}`}
                bold
              />
            )}

            {fee.display.swapInputTotal > 0n && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                {formatTopUpAmountLine(fee.display.swapInputTotal, tokenDecimals, tokenSymbol)} is
                spent immediately to buy SQD from the market and cannot be recovered if the initial
                pool collection fails.
              </Alert>
            )}
          </Stack>
        )}
      </Stack>
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
  const showSlippageSelector = supportsPortalPoolMinSqdOut();

  const isLoading = isTokenRewardLoading;
  const initialSource = sources?.find(s => s.type === AccountType.User) ?? sources?.[0];

  const optimalCapacity = useMemo(() => {
    return fromSqd(minCapacity).multipliedBy(1.2);
  }, [minCapacity]);

  const validationSchema = useMemo(() => {
    return addPortalSchema({ minCapacity: fromSqd(minCapacity) });
  }, [minCapacity]);

  const formik = useFormik<FormikValues>({
    initialValues: {
      source: initialSource?.id || '',
      name: '',
      tokenSuffix: '',
      description: '',
      website: '',
      capacity: undefined,
      earnings: '',
      initialDeposit: undefined,
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

      const source = sources?.find(s => s.id === values.source && s.type === AccountType.User);
      if (!source) {
        toast.error('Please select a wallet source');
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
          .integerValue(BigNumber.ROUND_CEIL)
          .toFixed(0),
      );

      const params = {
        operator: source.id as `0x${string}`,
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
      };

      // Mainnet uses the single-arg overload; testnets use the two-arg overload with minSqdOut.
      const receipt = await writeTransactionAsync({
        abi: portalPoolFactoryAbi,
        address: PORTAL_POOL_FACTORY,
        functionName: 'createPortalPool',
        approve: initialDeposit,
        approveToken: selectedToken.address,
        args: showSlippageSelector ? [params, 0n] : [params],
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
    return BigNumber(formik.values.earnings || '0')
      .div(30)
      .decimalPlaces(2, BigNumber.ROUND_CEIL);
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
      return BigInt(
        bn
          .times(10 ** selectedToken.decimals)
          .integerValue(BigNumber.ROUND_CEIL)
          .toFixed(0),
      );
    } catch {
      return undefined;
    }
  }, [formik.values.initialDeposit, selectedToken]);

  const fee = useTopUpFeePreview({
    rewardSymbol: selectedToken?.symbol,
    rewardDecimals: selectedToken?.decimals,
    parsedAmount: parsedInitialDeposit,
    slippageBps: null,
  });

  const estimatedMonthlyTopUp = useMemo(() => {
    const symbol = selectedToken?.symbol ?? 'Token';
    const earningsBn = BigNumber(formik.values.earnings || '0');
    const bps = fee.providersFeeBps;
    if (
      !fee.feeRouterReady ||
      fee.feeConfigError ||
      fee.feeConfigLoading ||
      bps == null ||
      bps <= 0 ||
      earningsBn.isNaN() ||
      earningsBn.lte(0)
    ) {
      return { amount: '0', symbol };
    }
    const amount = earningsBn.times(10_000).div(bps).decimalPlaces(6, BigNumber.ROUND_HALF_UP);
    return { amount: amount.toFixed(), symbol };
  }, [
    selectedToken?.symbol,
    formik.values.earnings,
    fee.feeRouterReady,
    fee.feeConfigError,
    fee.feeConfigLoading,
    fee.providersFeeBps,
  ]);

  const isStep1Valid = useMemo(() => {
    if (!selectedToken) return false;
    return (['source', 'name', 'description', 'website', 'capacity', 'earnings'] as const).every(
      field => !formik.errors[field],
    );
  }, [formik.errors, selectedToken]);

  const isStep2ConfirmDisabled = useMemo(() => {
    const hasStep2Errors = !!formik.errors.initialDeposit;
    return (
      hasStep2Errors || !formik.values.initialDeposit || !fee.feeRouterReady || fee.feeConfigError
    );
  }, [
    formik.errors.initialDeposit,
    formik.values.initialDeposit,
    fee.feeRouterReady,
    fee.feeConfigError,
  ]);

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
              <FormikSelect
                id="source"
                showErrorOnlyOfTouched
                options={
                  sources?.map(s => ({
                    label: <SourceWalletOption source={s} />,
                    value: s.id,
                    disabled: s.type !== AccountType.User,
                  })) || []
                }
                formik={formik}
              />
            </FormRow>
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
                label={
                  <Stack direction="row" alignItems="center" spacing={0.5} component="span">
                    <span>Monthly Distribution Rate ({selectedToken?.symbol || 'Token'})</span>
                    <HelpTooltip title="This is what token providers earn. Your actual monthly top-up cost will be higher due to the fee split." />
                  </Stack>
                }
                placeholder="0"
                formik={formik}
                showErrorOnlyOfTouched
                helperText={`Your estimated monthly cost: ${estimatedMonthlyTopUp.amount} ${estimatedMonthlyTopUp.symbol}`}
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
                <HelpTooltip title="If the pool does not reach its full capacity by this deadline, it will be cancelled. Only part of your deposit will be recoverable - the rest is used immediately upon deposit. You'll see the exact breakdown in the next step.">
                  <Typography variant="body2" component="span">
                    Collection Deadline
                  </Typography>
                </HelpTooltip>
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

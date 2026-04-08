import { useCallback, useMemo, useState } from 'react';

import type { SxProps, Theme } from '@mui/material';
import { Button, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { parseUnits } from 'viem';
import * as yup from 'yup';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { FormRow, FormikTextInput } from '@components/Form';
import { HelpTooltip } from '@components/HelpTooltip';
import { Loader } from '@components/Loader';
import { supportsPortalPoolMinSqdOut } from '@hooks/network/useSubsquidNetwork';

import { SlippageSelector } from '../components/SlippageSelector';
import { SplitPreviewRow } from '../components/SplitPreviewRow';
import { type FeePreviewState, type PoolData, usePoolData, useTopUpFeePreview } from '../hooks';
import { invalidatePoolQueries } from '../utils/poolUtils';
import {
  formatTopUpAmountLine,
  formatTopUpFeeApproxLine,
  formatTopUpSuccessMessage,
} from '../utils/topUpRewardsFormat';

type FormValues = {
  amount: string;
  isAutoSlippage: boolean;
  slippagePct: string;
};

const styles: Record<string, SxProps<Theme>> = {
  splitPreviewTitle: {
    fontWeight: 600,
  },
};

const DEFAULT_SLIPPAGE_PCT = '1';

const validationSchema = yup.object({
  amount: yup
    .string()
    .required('Amount is required')
    .test('positive', 'Amount must be positive', value => {
      return parseFloat(value || '0') > 0;
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

function tryParseRewardAmount(s: string, decimals: number): bigint | undefined {
  try {
    const t = s?.trim();
    if (!t) return undefined;
    return parseUnits(t, decimals);
  } catch {
    return undefined;
  }
}

function TopUpDialogContent({
  formik,
  pool,
  isLoading,
  fee,
  showSlippageSelector,
}: {
  formik: ReturnType<typeof useFormik<FormValues>>;
  pool?: PoolData;
  isLoading: boolean;
  fee: FeePreviewState;
  showSlippageSelector: boolean;
}) {
  const handleSlippageChange = useCallback(
    (isAuto: boolean, pct: string) => {
      void formik.setFieldValue('isAutoSlippage', isAuto);
      void formik.setFieldValue('slippagePct', pct);
    },
    [formik.setFieldValue],
  );

  if (isLoading) return <Loader />;
  if (!pool) return null;

  const showSplitPreview =
    fee.feeRouterReady && !fee.feeConfigError && !fee.feeConfigLoading && fee.display;

  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        Enter the total {pool.rewardToken.symbol} to add. The pool contract splits provider credit,
        worker pool, and burn per the fee router; worker and burn portions are swapped toward SQD
        when enabled.
      </Typography>

      <FormRow>
        <FormikTextInput
          id="amount"
          label="Total"
          formik={formik}
          showErrorOnlyOfTouched
          autoComplete="off"
          placeholder="0"
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
        <HelpTooltip title="Estimated shares from on-chain fee settings (basis points). Worker and burn rows show approximate SQD from the current SQD/USD price when the reward token is treated as USD-pegged. Actual amounts may differ.">
          <Typography component="span" variant="subtitle2" sx={styles.splitPreviewTitle}>
            Fee split preview
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
              value={formatTopUpAmountLine(
                fee.display.providerCredit,
                pool.rewardToken.decimals,
                pool.rewardToken.symbol,
              )}
            />
            <SplitPreviewRow
              label="Worker pool"
              feeBps={fee.workerFeeBps}
              value={formatTopUpFeeApproxLine({
                stableWei: fee.display.workerStable,
                rewardDecimals: pool.rewardToken.decimals,
                rewardSymbol: pool.rewardToken.symbol,
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
                rewardDecimals: pool.rewardToken.decimals,
                rewardSymbol: pool.rewardToken.symbol,
                sqdPriceUsd: fee.sqdPrice,
                sqdPriceLoading: fee.sqdPriceLoading,
                sqdSymbol: fee.sqdSymbol,
              })}
            />

            {fee.buybackSpotSqdWei != null && (
              <SplitPreviewRow
                label="Buyback total (spot ~SQD)"
                value={`~${formatTopUpAmountLine(fee.buybackSpotSqdWei, 18, fee.sqdSymbol)}`}
                bold
              />
            )}
          </Stack>
        )}
      </Stack>

      {showSlippageSelector && (
        <>
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
        </>
      )}
    </Stack>
  );
}

export function TopUpDialog({ open, onClose, poolId }: TopUpDialogProps) {
  const queryClient = useQueryClient();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();
  const { data: pool, isLoading } = usePoolData(poolId);
  const showSlippageSelector = supportsPortalPoolMinSqdOut();

  const formik = useFormik<FormValues>({
    initialValues: {
      amount: '',
      isAutoSlippage: true,
      slippagePct: DEFAULT_SLIPPAGE_PCT,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async values => {
      if (!pool || !fee.feeRouter) return;

      const decimals = pool.rewardToken.decimals;
      const rewardAmount = tryParseRewardAmount(values.amount, decimals);
      if (rewardAmount === undefined || rewardAmount === 0n) return;

      const minSqdOut =
        showSlippageSelector && !values.isAutoSlippage ? (fee.minSqdFromPrice ?? 0n) : 0n;

      const receipt = await writeTransactionAsync({
        address: poolId as `0x${string}`,
        abi: portalPoolAbi,
        functionName: 'topUpRewards',
        args: [rewardAmount, minSqdOut],
        approve: rewardAmount,
        approveToken: pool.rewardToken.address,
      });

      toast.success(
        formatTopUpSuccessMessage({
          receipt,
          poolAddress: poolId as `0x${string}`,
          feeRouterAddress: fee.feeRouter!,
          rewardTokenAddress: pool.rewardToken.address,
          rewardDecimals: pool.rewardToken.decimals,
          rewardSymbol: pool.rewardToken.symbol,
          sqdSymbol: fee.sqdSymbol,
        }),
        { duration: 5_000 },
      );

      await invalidatePoolQueries(queryClient, poolId);
      formik.resetForm();
      onClose();
    },
  });

  const parsedAmount = useMemo(
    () => tryParseRewardAmount(formik.values.amount, pool?.rewardToken.decimals ?? 18),
    [formik.values.amount, pool?.rewardToken.decimals],
  );

  const slippageBps = useMemo(() => {
    if (!showSlippageSelector || formik.values.isAutoSlippage) return null;
    const n = parseFloat(formik.values.slippagePct);
    return isNaN(n) ? null : Math.round(n * 100);
  }, [showSlippageSelector, formik.values.isAutoSlippage, formik.values.slippagePct]);

  const fee = useTopUpFeePreview({
    rewardSymbol: pool?.rewardToken.symbol,
    rewardDecimals: pool?.rewardToken.decimals,
    parsedAmount,
    slippageBps,
  });

  const confirmDisabled =
    !formik.isValid || !formik.values.amount || !fee.feeRouterReady || fee.feeConfigError;

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
      title="Top Up Pool Rewards"
      open={open}
      onResult={handleResult}
      loading={isPending}
      confirmColor="success"
      disableConfirmButton={confirmDisabled}
      minWidth={640}
    >
      <TopUpDialogContent
        formik={formik}
        pool={pool}
        isLoading={isLoading}
        fee={fee}
        showSlippageSelector={showSlippageSelector}
      />
    </ContractCallDialog>
  );
}

interface TopUpDialogProps {
  open: boolean;
  onClose: () => void;
  poolId: string;
}

interface TopUpButtonProps {
  poolId: string;
}

export function TopUpButton({ poolId }: TopUpButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: pool } = usePoolData(poolId);

  const handleOpen = useCallback(() => setDialogOpen(true), []);
  const handleClose = useCallback(() => setDialogOpen(false), []);

  return (
    <>
      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={handleOpen}
        disabled={
          pool?.phase === 'collecting' || pool?.phase === 'failed' || pool?.phase === 'closed'
        }
      >
        TOP UP
      </Button>
      <TopUpDialog open={dialogOpen} onClose={handleClose} poolId={poolId} />
    </>
  );
}

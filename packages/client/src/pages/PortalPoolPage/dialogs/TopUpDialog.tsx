import { useCallback, useMemo, useState } from 'react';

import type { SxProps, Theme } from '@mui/material';
import { Alert, Button, Divider, Skeleton, Stack, Typography } from '@mui/material';
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
};

const styles: Record<string, SxProps<Theme>> = {
  splitPreviewTitle: {
    fontWeight: 600,
  },
};

const validationSchema = yup.object({
  amount: yup
    .string()
    .required('Amount is required')
    .test('positive', 'Amount must be positive', value => {
      return parseFloat(value || '0') > 0;
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
}: {
  formik: ReturnType<typeof useFormik<FormValues>>;
  pool?: PoolData;
  isLoading: boolean;
  fee: FeePreviewState;
}) {
  if (isLoading) return <Loader />;
  if (!pool) return null;

  const showSplitPreview =
    fee.feeRouterReady && !fee.feeConfigError && !fee.feeConfigLoading && fee.display;

  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        Enter the {pool.rewardToken.symbol} amount to deposit. A portion is automatically used to
        buy SQD from the market and burn it, supporting the SQD ecosystem. The rest funds token
        provider rewards.
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
        <HelpTooltip title="Set on-chain and applies to all pools. May change over time.">
          <Typography component="span" variant="subtitle2" sx={styles.splitPreviewTitle}>
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
                label="Total SQD bought"
                value={`~${formatTopUpAmountLine(fee.buybackSpotSqdWei, 18, fee.sqdSymbol)}`}
                bold
              />
            )}

            {pool.phase === 'collecting' && fee.display.swapInputTotal > 0n && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                {formatTopUpAmountLine(
                  fee.display.swapInputTotal,
                  pool.rewardToken.decimals,
                  pool.rewardToken.symbol,
                )}{' '}
                is spent immediately to buy SQD from the market and cannot be recovered if the
                initial pool collection fails.
              </Alert>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export function TopUpDialog({ open, onClose, poolId }: TopUpDialogProps) {
  const queryClient = useQueryClient();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();
  const { data: pool, isLoading } = usePoolData(poolId);

  const formik = useFormik<FormValues>({
    initialValues: {
      amount: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async values => {
      if (!pool || !fee.feeRouter) return;

      const decimals = pool.rewardToken.decimals;
      const rewardAmount = tryParseRewardAmount(values.amount, decimals);
      if (rewardAmount === undefined || rewardAmount === 0n) return;

      const receipt = await writeTransactionAsync({
        address: poolId as `0x${string}`,
        abi: portalPoolAbi,
        functionName: 'topUpRewards',
        args: [rewardAmount, 0n],
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

  const fee = useTopUpFeePreview({
    rewardSymbol: pool?.rewardToken.symbol,
    rewardDecimals: pool?.rewardToken.decimals,
    parsedAmount,
    slippageBps: null,
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
      <TopUpDialogContent formik={formik} pool={pool} isLoading={isLoading} fee={fee} />
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
        disabled={pool?.phase === 'failed' || pool?.phase === 'closed'}
      >
        TOP UP
      </Button>
      <TopUpDialog open={dialogOpen} onClose={handleClose} poolId={poolId} />
    </>
  );
}

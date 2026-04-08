import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { zeroAddress } from 'viem';

import { useReadFeeRouterGetFeeConfig, useReadPortalPoolFactoryFeeRouter } from '@api/contracts';
import { trpc } from '@api/trpc';
import { useContracts } from '@hooks/network/useContracts';

import { TOP_UP_DIALOG_TEXTS } from '../texts';
import {
  type TopUpDisplaySplit,
  approxExpectedSqdWeiFromStable,
  computeMinSqdOutFromSpotPrice,
  computeTopUpFeesFromEnteredAmount,
  isUsdPeggedRewardSymbol,
} from '../utils/topUpRewardsFormat';

export interface FeePreviewState {
  feeRouter: `0x${string}` | undefined;
  feeRouterReady: boolean;
  feeConfigLoading: boolean;
  feeConfigError: boolean;
  display: TopUpDisplaySplit | null;
  providersFeeBps?: number;
  workerFeeBps?: number;
  burnFeeBps?: number;
  sqdPrice: number | null | undefined;
  sqdPriceLoading: boolean;
  sqdSymbol: string;
  buybackSpotSqdWei: bigint | null;
  /** Computed min SQD out for the supplied slippageBps; null when unavailable or slippageBps is null. */
  minSqdFromPrice: bigint | null;
  /** Non-null string describes why minSqdFromPrice cannot be computed. */
  minSqdBlockedReason: string | null;
  isStableToken: boolean;
}

export function useTopUpFeePreview(opts: {
  rewardSymbol: string | undefined;
  rewardDecimals: number | undefined;
  parsedAmount: bigint | undefined;
  /** Slippage in basis points (100 = 1%). null means Auto/TWAP (minSqdOut = 0n). */
  slippageBps: number | null;
}): FeePreviewState {
  const { PORTAL_POOL_FACTORY, SQD_TOKEN } = useContracts();

  const { data: feeRouterAddr } = useReadPortalPoolFactoryFeeRouter({
    address: PORTAL_POOL_FACTORY,
  });
  const feeRouter = feeRouterAddr && feeRouterAddr !== zeroAddress ? feeRouterAddr : undefined;

  const { data: sqdPrice, isLoading: sqdPriceLoading } = useQuery(
    trpc.price.current.queryOptions(),
  );

  const {
    data: feeConfigResult,
    isLoading: feeConfigLoading,
    isError: feeConfigError,
  } = useReadFeeRouterGetFeeConfig({
    address: feeRouter ?? zeroAddress,
    query: { enabled: !!feeRouter },
  });

  const display = useMemo(() => {
    if (!feeConfigResult || !feeRouter) return null;
    return computeTopUpFeesFromEnteredAmount(opts.parsedAmount ?? 0n, {
      toProvidersBPS: feeConfigResult.toProvidersBPS,
      toWorkerPoolBPS: feeConfigResult.toWorkerPoolBPS,
      toBurnBPS: feeConfigResult.toBurnBPS,
    });
  }, [feeConfigResult, feeRouter, opts.parsedAmount]);

  const rewardDecimals = opts.rewardDecimals ?? 18;

  const isStableToken = useMemo(
    () => !!opts.rewardSymbol && isUsdPeggedRewardSymbol(opts.rewardSymbol),
    [opts.rewardSymbol],
  );

  const buybackSpotSqdWei = useMemo(() => {
    if (!display || sqdPrice == null || sqdPrice <= 0) return null;
    if (!isStableToken) return null;
    return approxExpectedSqdWeiFromStable({
      stableWei: display.swapInputTotal,
      rewardDecimals,
      sqdPriceUsd: sqdPrice,
    });
  }, [display, sqdPrice, isStableToken, rewardDecimals]);

  const minSqdFromPrice = useMemo(() => {
    if (opts.slippageBps === null) return null;
    if (!display || sqdPrice == null || sqdPrice <= 0) return null;
    if (!isStableToken) return null;
    return computeMinSqdOutFromSpotPrice({
      swapInputStableWei: display.swapInputTotal,
      rewardDecimals,
      sqdPriceUsd: sqdPrice,
      slippageBps: opts.slippageBps,
    });
  }, [opts.slippageBps, display, sqdPrice, isStableToken, rewardDecimals]);

  const minSqdBlockedReason = useMemo((): string | null => {
    if (opts.slippageBps === null) return null;
    const b = TOP_UP_DIALOG_TEXTS.slippageBlocked;
    if (!opts.rewardSymbol) return b.noPrice;
    if (!isStableToken) return b.stableOnly;
    if (sqdPriceLoading) return b.loadingPrice;
    if (sqdPrice == null || sqdPrice <= 0) return b.noPrice;
    if (!opts.parsedAmount || opts.parsedAmount === 0n) return b.enterAmount;
    if (feeConfigError) return TOP_UP_DIALOG_TEXTS.feeConfigError;
    if (feeConfigLoading || !display) return b.loadingPreview;
    if (display.swapInputTotal === 0n) return b.noSwap;
    return null;
  }, [
    opts.slippageBps,
    opts.rewardSymbol,
    isStableToken,
    sqdPriceLoading,
    sqdPrice,
    opts.parsedAmount,
    feeConfigError,
    feeConfigLoading,
    display,
  ]);

  return {
    feeRouter,
    feeRouterReady: !!feeRouter,
    feeConfigLoading,
    feeConfigError,
    display,
    providersFeeBps: feeConfigResult?.toProvidersBPS,
    workerFeeBps: feeConfigResult?.toWorkerPoolBPS,
    burnFeeBps: feeConfigResult?.toBurnBPS,
    sqdPrice,
    sqdPriceLoading,
    sqdSymbol: SQD_TOKEN,
    buybackSpotSqdWei,
    minSqdFromPrice,
    minSqdBlockedReason,
    isStableToken,
  };
}

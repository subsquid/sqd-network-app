import BigNumber from 'bignumber.js';
import {
  type Address,
  type TransactionReceipt,
  formatUnits,
  getAddress,
  parseEventLogs,
} from 'viem';

import { feeRouterAbi, portalPoolAbi } from '@api/contracts';
import { tokenFormatter } from '@lib/formatters/formatters';

const SQD_DECIMALS = 18;

/** Display / form strings: max fractional digits (floor). */
const TOP_UP_FRACTION_DIGITS = 3;

/** SQD wei → decimal string for form input (floored to 3 fractional digits, trims trailing zeros). */
export function minSqdWeiToInputString(wei: bigint): string {
  const rounded = BigNumber(formatUnits(wei, SQD_DECIMALS)).decimalPlaces(
    TOP_UP_FRACTION_DIGITS,
    BigNumber.ROUND_FLOOR,
  );
  let s = rounded.toFixed(TOP_UP_FRACTION_DIGITS);
  if (s.includes('.')) {
    s = s.replace(/\.?0+$/, '');
  }
  return s || '0';
}

/** Reward symbols treated as ~USD notional for spot-price min SQD estimates. */
const USD_PEGGED_REWARD_SYMBOLS = new Set([
  'USDC',
  'USDT',
  'DAI',
  'USDC.E',
  'USDBC',
  'MUSDC',
  'FRAX',
  'LUSD',
]);

export function isUsdPeggedRewardSymbol(symbol: string): boolean {
  const u = symbol.trim().toUpperCase();
  return USD_PEGGED_REWARD_SYMBOLS.has(u);
}

/**
 * minSqdOut from (swap stable human / SQD USD price) × (1 − slippageBPS/10000), floored to wei.
 * Assumes reward stable ≈ USD (see {@link isUsdPeggedRewardSymbol}).
 */
export function computeMinSqdOutFromSpotPrice(opts: {
  swapInputStableWei: bigint;
  rewardDecimals: number;
  sqdPriceUsd: number;
  slippageBps: number;
}): bigint | null {
  if (opts.sqdPriceUsd <= 0 || opts.slippageBps < 0 || opts.slippageBps >= 10_000) return null;

  const swapHuman = BigNumber(opts.swapInputStableWei.toString()).shiftedBy(-opts.rewardDecimals);
  if (swapHuman.lte(0)) return 0n;

  const expectedSqd = swapHuman.div(opts.sqdPriceUsd);
  const factor = BigNumber(1).minus(BigNumber(opts.slippageBps).div(10_000));
  const minSqd = expectedSqd.times(factor);
  if (minSqd.lte(0)) return 0n;

  const weiBn = minSqd.shiftedBy(SQD_DECIMALS).integerValue(BigNumber.ROUND_FLOOR);
  return BigInt(weiBn.toFixed(0));
}

/** Expected SQD wei from stable notionally at spot (no slippage); for UI previews only. */
export function approxExpectedSqdWeiFromStable(opts: {
  stableWei: bigint;
  rewardDecimals: number;
  sqdPriceUsd: number;
}): bigint | null {
  if (opts.sqdPriceUsd <= 0) return null;
  const stableHuman = BigNumber(opts.stableWei.toString()).shiftedBy(-opts.rewardDecimals);
  if (stableHuman.lte(0)) return 0n;
  const expectedSqd = stableHuman.div(opts.sqdPriceUsd);
  const weiBn = expectedSqd.shiftedBy(SQD_DECIMALS).integerValue(BigNumber.ROUND_FLOOR);
  return BigInt(weiBn.toFixed(0));
}

/**
 * e.g. `10 USDC → ~1,000 SQD` when price is available and reward is USD-pegged; otherwise stable only.
 */
export function formatTopUpFeeApproxLine(opts: {
  stableWei: bigint;
  rewardDecimals: number;
  rewardSymbol: string;
  sqdPriceUsd: number | null | undefined;
  sqdPriceLoading: boolean;
  sqdSymbol: string;
}): string {
  const stablePart = formatTopUpAmountLine(opts.stableWei, opts.rewardDecimals, opts.rewardSymbol);
  if (
    opts.sqdPriceLoading ||
    !isUsdPeggedRewardSymbol(opts.rewardSymbol) ||
    opts.sqdPriceUsd == null ||
    opts.sqdPriceUsd <= 0
  ) {
    return stablePart;
  }
  const approxWei = approxExpectedSqdWeiFromStable({
    stableWei: opts.stableWei,
    rewardDecimals: opts.rewardDecimals,
    sqdPriceUsd: opts.sqdPriceUsd,
  });
  if (approxWei === null) return stablePart;
  const sqdFormatted = fmt(approxWei, SQD_DECIMALS, opts.sqdSymbol);
  return `${stablePart} → ~${sqdFormatted}`;
}

export type FeeConfigBps = {
  toProvidersBPS: number;
  toWorkerPoolBPS: number;
  toBurnBPS: number;
};

const percentFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Basis points → percent label for UI (100 bps = 1%). */
export function formatFeeBpsAsPercent(bps: number): string {
  return `${percentFormat.format(bps / 100)}%`;
}

export type TopUpDisplaySplit = {
  providerCredit: bigint;
  workerStable: bigint;
  burnStable: bigint;
  swapInputTotal: bigint;
  isCombinedSwap: boolean;
};

const BPS_DENOM = 10000n;

/**
 * Fee preview from the entered top-up amount and on-chain BPS (no `calculateSplit` call).
 * Integer division dust is added to burn so components sum to `amount`.
 */
export function computeTopUpFeesFromEnteredAmount(
  amount: bigint,
  feeConfig: FeeConfigBps,
): TopUpDisplaySplit {
  const p = BigInt(feeConfig.toProvidersBPS);
  const w = BigInt(feeConfig.toWorkerPoolBPS);
  const b = BigInt(feeConfig.toBurnBPS);
  const providerCredit = (amount * p) / BPS_DENOM;
  const workerStable = (amount * w) / BPS_DENOM;
  let burnStable = (amount * b) / BPS_DENOM;
  const sum = providerCredit + workerStable + burnStable;
  burnStable += amount - sum;

  return {
    providerCredit,
    workerStable,
    burnStable,
    swapInputTotal: workerStable + burnStable,
    isCombinedSwap: false,
  };
}

function fmt(wei: bigint, decimals: number, symbol: string) {
  return tokenFormatter(BigNumber(formatUnits(wei, decimals)), symbol, TOP_UP_FRACTION_DIGITS);
}

export function formatTopUpAmountLine(wei: bigint, decimals: number, symbol: string) {
  return fmt(wei, decimals, symbol);
}

export function formatTopUpSuccessMessage(opts: {
  receipt: TransactionReceipt;
  poolAddress: Address;
  feeRouterAddress: Address;
  rewardTokenAddress: Address;
  rewardDecimals: number;
  rewardSymbol: string;
  sqdSymbol: string;
}): string {
  const pool = getAddress(opts.poolAddress);
  const router = getAddress(opts.feeRouterAddress);
  const rewardTok = getAddress(opts.rewardTokenAddress);

  const toppedUpLogs = parseEventLogs({
    abi: portalPoolAbi,
    eventName: 'RewardsToppedUp',
    logs: opts.receipt.logs,
  }).filter(l => getAddress(l.address) === pool);

  const buybackLogs = parseEventLogs({
    abi: feeRouterAbi,
    eventName: 'BuybackExecuted',
    logs: opts.receipt.logs,
  }).filter(l => getAddress(l.address) === router);

  const lastTop = toppedUpLogs[toppedUpLogs.length - 1];
  const matchedBuyback = [...buybackLogs]
    .reverse()
    .find(l => l.args.rewardToken !== undefined && getAddress(l.args.rewardToken) === rewardTok);

  const parts: string[] = [];

  if (lastTop?.args?.toProviders !== undefined) {
    parts.push(
      `${fmt(lastTop.args.toProviders, opts.rewardDecimals, opts.rewardSymbol)} to rewards`,
    );
  }

  if (matchedBuyback?.args?.sqdBought !== undefined) {
    parts.push(`${fmt(matchedBuyback.args.sqdBought, SQD_DECIMALS, opts.sqdSymbol)} bought`);
  }

  if (parts.length === 0) return 'Top-up completed.';
  return `Top-up completed — ${parts.join(', ')}.`;
}

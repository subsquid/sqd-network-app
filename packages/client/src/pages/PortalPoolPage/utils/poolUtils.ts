import type { QueryClient } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import { trpc } from '@api/trpc';

import type { PoolData, PoolPhase } from '../hooks/types';

export interface CapacityInfo {
  maxDepositPerAddress: BigNumber;
  currentUserBalance: BigNumber;
  userRemainingCapacity: BigNumber;
  currentPoolTvl: BigNumber;
  maxPoolCapacity: BigNumber;
  poolRemainingCapacity: BigNumber;
  effectiveMax: BigNumber;
}

export function calculateCapacity(
  pool: PoolData,
  currentUserBalance: BigNumber = BigNumber(0),
): CapacityInfo {
  const maxDepositPerAddress = pool.maxDepositPerAddress;
  const userRemainingCapacity = BigNumber.max(0, maxDepositPerAddress.minus(currentUserBalance));

  const currentPoolTvl = pool.tvl.current;
  const maxPoolCapacity = pool.tvl.max;
  const poolRemainingCapacity = BigNumber.max(0, maxPoolCapacity.minus(currentPoolTvl));

  const effectiveMax = BigNumber.min(userRemainingCapacity, poolRemainingCapacity);

  return {
    maxDepositPerAddress,
    currentUserBalance,
    userRemainingCapacity,
    currentPoolTvl,
    maxPoolCapacity,
    poolRemainingCapacity,
    effectiveMax,
  };
}

/**
 * Calculate APY (Annual Percentage Yield) for a pool
 * APY = (monthlyPayoutUsd * 12) / (tvlInSqd * sqdPrice)
 *
 * @param monthlyPayoutUsd - Monthly payout in USD
 * @param tvlInSqd - Total Value Locked in SQD tokens
 * @param sqdPrice - Price of SQD token in USD (optional)
 * @returns APY as a decimal (e.g., 0.15 for 15%), or undefined if sqdPrice is not provided
 */
export function calculateApy(
  monthlyPayoutUsd: number,
  tvlInSqd: number,
  sqdPrice?: number,
): number | undefined {
  if (sqdPrice === undefined || sqdPrice <= 0 || tvlInSqd <= 0) return undefined;
  const tvlInUsd = tvlInSqd * sqdPrice;
  const annualPayoutUsd = monthlyPayoutUsd * 12;
  return annualPayoutUsd / tvlInUsd;
}

/**
 * Calculate APY with a guaranteed return value (0 if inputs are invalid)
 * Useful for chart rendering where we always need a numeric value
 */
export function calculateApyOrZero(
  monthlyPayoutUsd: number,
  tvlInSqd: number,
  sqdPrice: number,
): number {
  return calculateApy(monthlyPayoutUsd, tvlInSqd, sqdPrice) ?? 0;
}

export function calculateExpectedMonthlyPayout(pool: PoolData, userDelegation: BigNumber): number {
  const maxPoolCapacity = pool.tvl.max;
  if (maxPoolCapacity.isZero()) return 0;
  return userDelegation
    .div(maxPoolCapacity)
    .times(pool.distributionRatePerSecond.times(30 * 86400))
    .toNumber();
}

export function getPhaseColor(
  phase: PoolPhase,
): 'success' | 'warning' | 'error' | 'default' | 'info' {
  switch (phase) {
    case 'active':
      return 'success';
    case 'collecting':
      return 'info';
    case 'idle':
    case 'debt':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
}

export function getPhaseLabel(phase: PoolPhase): string {
  switch (phase) {
    case 'active':
      return 'Active';
    case 'collecting':
      return 'Collecting';
    case 'debt':
      return 'In Debt';
    case 'idle':
      return 'Paused';
    case 'failed':
      return 'Failed';
    default:
      return phase;
  }
}

export function getPhaseTooltip(phase: PoolPhase): string {
  switch (phase) {
    case 'active':
      return 'Pool is active. Distributing yields to liquidity providers.';
    case 'collecting':
      return 'Pool is collecting tokens to activate. Pool activates once minimum threshold is met. If not met by deadline, you can withdraw all your tokens.';
    case 'idle':
      return 'Pool is paused due to insufficient liquidity. Rewards are not being distributed. Pool reactivates when liquidity increases above minimum threshold.';
    case 'debt':
      return 'Pool has run out of USDC rewards. No rewards are being distributed. Contact the pool operator to add more USDC to resume rewards.';
    case 'failed':
      return 'Pool has failed. No rewards are being distributed. You can withdraw your tokens.';
    default:
      return phase;
  }
}

/**
 * Invalidates all queries related to a specific pool
 * Uses tRPC typed query filters to avoid manual query-key parsing
 */
export async function invalidatePoolQueries(
  queryClient: QueryClient,
  poolId: string,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries(trpc.pool.get.queryFilter({ poolId })),
    queryClient.invalidateQueries(trpc.pool.userData.queryFilter({ poolId })),
    queryClient.invalidateQueries(trpc.pool.pendingWithdrawals.queryFilter({ poolId })),
    queryClient.invalidateQueries(trpc.pool.events.queryFilter({ poolId })),
    queryClient.invalidateQueries(trpc.pool.apyTimeseries.queryFilter({ poolId })),
    queryClient.invalidateQueries(trpc.pool.tvlTimeseries.queryFilter({ poolId })),
  ]);
}

/**
 * Calculate the unlock date based on a wait time string (e.g., "2 days", "3 hours")
 */
export function calculateUnlockDate(waitTime?: string): Date | null {
  if (!waitTime) return null;

  const now = new Date();
  const match = waitTime.toLowerCase().match(/(\d+)\s*(day|hour|week|minute)/);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  const unlockDate = new Date(now);
  switch (unit) {
    case 'minute':
      unlockDate.setMinutes(unlockDate.getMinutes() + value);
      break;
    case 'hour':
      unlockDate.setHours(unlockDate.getHours() + value);
      break;
    case 'day':
      unlockDate.setDate(unlockDate.getDate() + value);
      break;
    case 'week':
      unlockDate.setDate(unlockDate.getDate() + value * 7);
      break;
  }

  return unlockDate;
}

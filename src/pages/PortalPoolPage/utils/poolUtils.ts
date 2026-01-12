import type { QueryClient } from '@tanstack/react-query';

import { fromSqd } from '@lib/network';

import type { PoolData, PoolPhase } from '../hooks/types';

export interface CapacityInfo {
  maxDepositPerAddress: number;
  currentUserBalance: number;
  userRemainingCapacity: number;
  currentPoolTvl: number;
  maxPoolCapacity: number;
  poolRemainingCapacity: number;
  effectiveMax: number;
}

export function calculateCapacity(pool: PoolData, currentUserBalance: bigint = 0n): CapacityInfo {
  const maxDepositPerAddress = fromSqd(pool.maxDepositPerAddress).toNumber();
  const userBalance = fromSqd(currentUserBalance).toNumber();
  const userRemainingCapacity = Math.max(0, maxDepositPerAddress - userBalance);

  const currentPoolTvl = fromSqd(pool.tvl.current).toNumber();
  const maxPoolCapacity = fromSqd(pool.tvl.max).toNumber();
  const poolRemainingCapacity = Math.max(0, maxPoolCapacity - currentPoolTvl);

  const effectiveMax = Math.min(userRemainingCapacity, poolRemainingCapacity);

  return {
    maxDepositPerAddress,
    currentUserBalance: userBalance,
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

export function calculateExpectedMonthlyPayout(pool: PoolData, userDelegation: number): number {
  const maxPoolCapacity = fromSqd(pool.tvl.max).toNumber();
  const payoutCoefficientPerSqd = maxPoolCapacity > 0 ? pool.monthlyPayoutUsd / maxPoolCapacity : 0;
  return userDelegation * payoutCoefficientPerSqd;
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
    default:
      return phase;
  }
}

export function getPhaseTooltip(phase: PoolPhase): string {
  switch (phase) {
    case 'active':
      return 'Pool is active. Distributing yields to liquidity providers.';
    case 'collecting':
      return 'Pool is collecting deposits to activate. Pool activates once minimum threshold is met. If not met by deadline, you can withdraw your full deposit.';
    case 'idle':
      return 'Pool is paused due to insufficient liquidity. Rewards are not being distributed. Pool reactivates when liquidity increases above minimum threshold.';
    case 'debt':
      return 'Pool has run out of USDC rewards. No rewards are being distributed. Contact the pool operator to add more USDC to resume rewards.';
    default:
      return phase;
  }
}

/**
 * Invalidates all queries related to a specific pool
 * This includes readContract queries for the pool and all readContracts queries
 */
export async function invalidatePoolQueries(
  queryClient: QueryClient,
  poolId: string,
): Promise<void> {
  await queryClient.invalidateQueries({
    predicate: query => {
      const key = query.queryKey;
      if (!Array.isArray(key)) return false;

      // Invalidate readContract queries for this pool
      if (key[0] === 'readContract' && typeof key[1] === 'object' && key[1] !== null) {
        const params = key[1] as any;
        return params.address === poolId;
      }

      // Invalidate readContracts queries (user data, etc)
      if (key[0] === 'readContracts') {
        return true;
      }

      return false;
    },
  });
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

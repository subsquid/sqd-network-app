import { useMemo } from 'react';

import { BigNumber } from 'bignumber.js';

import { useQuery } from '@tanstack/react-query';

import { trpc } from '@api/trpc';

import type { PoolData } from './types';

export const DISTRIBUTION_RATE_BPS = 1000;
export const REWARD_TOKEN_DECIMALS = 10 ** 6;

/**
 * Hook to fetch complete pool data via the server.
 * Replaces 10+ individual contract reads and GraphQL queries
 * with a single aggregated tRPC call.
 */
export function usePoolData(poolId?: string) {
  const { data: raw, isLoading } = useQuery(trpc.pool.get.queryOptions(
    { poolId: poolId! },
    {
      enabled: !!poolId,
      refetchInterval: 10_000,
    },
  ));

  const data = useMemo<PoolData | undefined>(() => {
    if (!raw) return undefined;

    return {
      id: raw.id,
      name: raw.name,
      description: raw.description ?? undefined,
      website: raw.website ?? undefined,
      operator: raw.operator,
      phase: raw.phase as PoolData['phase'],
      distributionRatePerSecond: BigNumber(raw.distributionRatePerSecond),
      tvl: {
        current: BigNumber(raw.tvl.current),
        max: BigNumber(raw.tvl.max),
        min: BigNumber(raw.tvl.min),
        total: BigNumber(raw.tvl.total),
      },
      depositWindowEndsAt: raw.depositWindowEndsAt ? new Date(raw.depositWindowEndsAt) : undefined,
      maxDepositPerAddress: BigNumber(raw.maxDepositPerAddress),
      lptToken: {
        ...raw.lptToken,
        address: raw.lptToken.address as `0x${string}`,
      },
      rewardToken: {
        ...raw.rewardToken,
        address: raw.rewardToken.address as `0x${string}`,
      },
      createdAt: new Date(raw.createdAt),
      totalRewardsToppedUp: BigNumber(raw.totalRewardsToppedUp),
    };
  }, [raw]);

  return {
    data,
    isLoading,
  };
}

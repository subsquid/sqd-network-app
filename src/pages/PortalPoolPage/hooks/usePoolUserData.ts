import { useMemo } from 'react';

import { BigNumber } from 'bignumber.js';

import { useQuery } from '@tanstack/react-query';

import { trpc } from '@api/trpc';
import { useAccount } from 'wagmi';

import type { PoolUserData } from './types';

export function usePoolUserData(poolId?: string) {
  const { address } = useAccount();

  const { data: raw, isLoading } = useQuery(trpc.pool.userData.queryOptions(
    { poolId: poolId!, address: address! },
    {
      enabled: !!poolId && !!address,
      refetchInterval: 10000,
    },
  ));

  const data = useMemo<PoolUserData | undefined>(() => {
    if (!raw) return undefined;

    return {
      userBalance: BigNumber(raw.userBalance),
      userRewards: raw.userRewards,
      hasRewards: raw.hasRewards,
      whitelistEnabled: raw.whitelistEnabled,
      isWhitelisted: raw.isWhitelisted,
    };
  }, [raw]);

  return {
    data,
    isLoading,
  };
}

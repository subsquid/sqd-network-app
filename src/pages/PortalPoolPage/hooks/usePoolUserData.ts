import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';

import { portalPoolAbi } from '@api/contracts';
import { unwrapMulticallResult } from '@lib/network';
import { useAccount } from '@network/useAccount';

import type { PoolUserData } from './types';

export function usePoolUserData(poolId?: string) {
  const { address } = useAccount();

  const portalPoolContract = {
    abi: portalPoolAbi,
    address: poolId as `0x${string}`,
  } as const;

  const { data: contractData, isLoading } = useReadContracts({
    contracts: [
      {
        ...portalPoolContract,
        functionName: 'getProviderStake',
        args: [address as `0x${string}`],
      },
      {
        ...portalPoolContract,
        functionName: 'getClaimableRewards',
        args: [address as `0x${string}`],
      },
    ] as const,
    query: {
      enabled: !!poolId && !!address,
      refetchInterval: 10000,
    },
  });

  const data = useMemo<PoolUserData | undefined>(() => {
    if (!poolId || !address || !contractData) return undefined;

    const userBalance = unwrapMulticallResult(contractData?.[0]) || 0n;
    const userRewards = unwrapMulticallResult(contractData?.[1]) || 0n;

    return {
      userBalance,
      userRewards,
    };
  }, [poolId, address, contractData]);

  return {
    data,
    isLoading,
  };
}


import { useMemo } from 'react';

import { useReadContracts } from 'wagmi';

import { portalPoolAbi } from '@api/contracts';
import { fromSqd, unwrapMulticallResult } from '@lib/network';
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
        functionName: 'getPoolStatusWithRewards',
        args: [address as `0x${string}`],
      },
      {
        ...portalPoolContract,
        functionName: 'whitelistEnabled',
      },
      {
        ...portalPoolContract,
        functionName: 'isWhitelisted',
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

    const [poolCredit, poolDebt, poolBalance, runway, outOfMoney, userRewards, userStake] =
      unwrapMulticallResult(contractData?.[0]) || [0n, 0n, 0n, 0n, false, 0n, 0n];

    const whitelistEnabled = unwrapMulticallResult(contractData?.[1]) || false;
    const isWhitelisted = unwrapMulticallResult(contractData?.[2]) || false;

    return {
      userBalance: fromSqd(userStake),
      userRewards,
      whitelistEnabled,
      isWhitelisted,
    };
  }, [poolId, address, contractData]);

  return {
    data,
    isLoading,
  };
}

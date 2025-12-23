import { useMemo } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import { erc20Abi } from 'viem';
import { BigNumber } from 'bignumber.js';

import { portalPoolAbi, portalPoolFactoryAbi } from '@api/contracts';
import { unwrapMulticallResult } from '@lib/network';
import { useContracts } from '@network/useContracts';

import { getPhase, parseMetadata } from './helpers';
import type { PoolData } from './types';

/**
 * Hook to fetch complete pool data from the blockchain
 * Combines portal validation, contract data, and LP token information
 */
export function usePoolData(poolId?: string) {
  const { PORTAL_POOL_FACTORY } = useContracts();

  const portalPoolContract = {
    abi: portalPoolAbi,
    address: poolId as `0x${string}`,
  } as const;

  // Check if the address is a valid portal pool
  const { data: isPortal, isLoading: isCheckingPortal } = useReadContract({
    address: PORTAL_POOL_FACTORY,
    abi: portalPoolFactoryAbi,
    functionName: 'isPortal',
    args: [poolId as `0x${string}`],
    query: {
      enabled: !!poolId,
    },
  });

  // Fetch all pool contract data in a single multicall
  const { data: contractData, isLoading: isLoadingData } = useReadContracts({
    contracts: [
      {
        ...portalPoolContract,
        functionName: 'getActiveStake',
      },
      {
        ...portalPoolContract,
        functionName: 'getPortalInfo',
      },
      {
        ...portalPoolContract,
        functionName: 'getState',
      },
      {
        ...portalPoolContract,
        functionName: 'delegatorRatePerSec',
      },
      {
        ...portalPoolContract,
        functionName: 'getMetadata',
      },
      {
        ...portalPoolContract,
        functionName: 'lptToken',
      },
      {
        ...portalPoolContract,
        functionName: 'isOutOfMoney',
      },
      {
        ...portalPoolContract,
        functionName: 'getMinCapacity',
      },
    ] as const,
    query: {
      enabled: !!poolId && !!isPortal,
      refetchInterval: 10000,
      select(data) {
        const activeStake = unwrapMulticallResult(data?.[0]) || 0n;
        const portalInfo = unwrapMulticallResult(data?.[1]);
        const state = unwrapMulticallResult(data?.[2]);
        const distributionRatePerSecond = unwrapMulticallResult(data?.[3]) || 0n;
        const metadata = parseMetadata(unwrapMulticallResult(data?.[4]));
        const lptToken = unwrapMulticallResult(data?.[5]);
        const isOutOfMoney = unwrapMulticallResult(data?.[6]);
        const minCapacity = unwrapMulticallResult(data?.[7]);
        if (!portalInfo || !lptToken) return undefined;

        return {
          name: metadata.name || 'Portal Pool',
          description: metadata.description,
          website: metadata.website,
          activeStake,
          ...portalInfo,
          state,
          distributionRatePerSecond,
          lptToken,
          isOutOfMoney,
          minCapacity,
        };
      },
    },
  });

  // Fetch LP token symbol separately
  const { data: lpTokenSymbol } = useReadContract({
    address: contractData?.lptToken as `0x${string}`,
    abi: erc20Abi,
    functionName: 'symbol',
    query: {
      enabled: !!contractData?.lptToken,
    },
  });

  // Transform contract data into PoolData format
  const data = useMemo<PoolData | undefined>(() => {
    if (!poolId) return undefined;
    if (!contractData) return undefined;

    const {
      name,
      description,
      website,
      operator,
      state,
      distributionRatePerSecond,
      activeStake,
      capacity,
      depositDeadline,
      lptToken,
      isOutOfMoney,
      minCapacity,
    } = contractData;

    return {
      id: poolId,
      name,
      description,
      website,
      operator: {
        name: operator,
        address: operator,
      },
      phase: getPhase(state, isOutOfMoney),
      monthlyPayoutUsd: Math.round(
        BigNumber(distributionRatePerSecond)
          .dividedBy(10n ** 6n)
          .multipliedBy(30)
          .multipliedBy(86400)
          .toNumber(),
      ),
      distributionRatePerSecond,
      tvl: {
        current: activeStake,
        max: capacity,
        min: minCapacity || 0n,
      },
      depositWindowEndsAt: new Date(Number(depositDeadline) * 1000),
      withdrawalQueue: {
        windowLimit: BigInt('100000000000000000000000'),
        windowUsed: BigInt('35000000000000000000000'),
        windowDuration: '24 hours',
        windowResetIn: '18 hours',
      },
      maxDepositPerAddress: BigInt(1e36),
      withdrawWaitTime: '2 days',
      lptTokenSymbol: lpTokenSymbol,
      lptToken,
    };
  }, [poolId, contractData, lpTokenSymbol]);

  return {
    data,
    isLoading: isCheckingPortal || isLoadingData,
  };
}

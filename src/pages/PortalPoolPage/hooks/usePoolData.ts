import { useMemo } from 'react';

import { BigNumber } from 'bignumber.js';
import { useReadContract } from 'wagmi';

import { portalPoolAbi, portalPoolFactoryAbi } from '@api/contracts';
import { usePoolByIdQuery } from '@api/pool-squid/graphql';
import { useERC20Tokens } from '@hooks/useERC20';
import { fromSqd, toSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import { getPhase, parseMetadata } from './helpers';
import type { PoolData } from './types';

export const DISTRIBUTION_RATE_BPS = 1000;
export const REWARD_TOKEN_DECIMALS = 10 ** 6;

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

  // Common query options for all contract reads
  const queryOptions = {
    enabled: !!poolId && !!isPortal,
    refetchInterval: 10000,
  } as const;

  // Fetch pool contract data using separate hooks
  const { data: activeStake, isLoading: isLoadingActiveStake } = useReadContract({
    ...portalPoolContract,
    functionName: 'getActiveStake',
    query: queryOptions,
  });

  const { data: poolInfo, isLoading: isLoadingPoolInfo } = useReadContract({
    ...portalPoolContract,
    functionName: 'getPoolInfo',
    query: queryOptions,
  });

  const { data: distributionRatePerSecond, isLoading: isLoadingDistributionRate } = useReadContract(
    {
      ...portalPoolContract,
      functionName: 'providerRatePerSec',
      query: queryOptions,
    },
  );

  const { data: metadataRaw, isLoading: isLoadingMetadata } = useReadContract({
    ...portalPoolContract,
    functionName: 'getMetadata',
    query: queryOptions,
  });

  const { data: lptToken, isLoading: isLoadingLptToken } = useReadContract({
    ...portalPoolContract,
    functionName: 'lptToken',
    query: queryOptions,
  });

  const { data: isOutOfMoney, isLoading: isLoadingOutOfMoney } = useReadContract({
    ...portalPoolContract,
    functionName: 'isOutOfMoney',
    query: queryOptions,
  });

  const { data: minCapacity, isLoading: isLoadingMinCapacity } = useReadContract({
    ...portalPoolContract,
    functionName: 'getMinCapacity',
    query: queryOptions,
  });

  const { data: rewardToken, isLoading: isLoadingRewardToken } = useReadContract({
    ...portalPoolContract,
    functionName: 'getRewardToken',
    query: queryOptions,
  });

  const { data: poolIndexedData, isLoading: isLoadingPoolIndexedData } = usePoolByIdQuery(
    {
      id: poolId?.toLowerCase() as string,
    },
    {
      enabled: !!poolId,
    },
  );

  // Combine loading states
  const isLoadingData =
    isLoadingActiveStake ||
    isLoadingPoolInfo ||
    isLoadingDistributionRate ||
    isLoadingMetadata ||
    isLoadingLptToken ||
    isLoadingOutOfMoney ||
    isLoadingMinCapacity ||
    isLoadingRewardToken ||
    isLoadingPoolIndexedData;

  // Combine contract data
  const contractData = useMemo(() => {
    if (!poolInfo || !lptToken) return undefined;

    const metadata = parseMetadata(metadataRaw);

    return {
      name: metadata.name || 'Portal Pool',
      description: metadata.description,
      website: metadata.website,
      activeStake: activeStake || 0n,
      ...poolInfo,
      distributionRatePerSecond: distributionRatePerSecond || 0n,
      lptToken,
      isOutOfMoney,
      minCapacity,
      rewardToken,
    };
  }, [
    activeStake,
    poolInfo,
    distributionRatePerSecond,
    metadataRaw,
    lptToken,
    isOutOfMoney,
    minCapacity,
    rewardToken,
  ]);

  // Fetch ERC20 data for LP token and reward token
  const tokenAddresses = useMemo(() => {
    const addresses: `0x${string}`[] = [];
    if (contractData?.lptToken) addresses.push(contractData.lptToken);
    if (contractData?.rewardToken) addresses.push(contractData.rewardToken);
    return addresses;
  }, [contractData?.lptToken, contractData?.rewardToken]);

  const { data: tokenData, isLoading: isLoadingTokenData } = useERC20Tokens({
    addresses: tokenAddresses,
    enabled: tokenAddresses.length > 0,
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
      lptToken: lptTokenAddress,
      isOutOfMoney,
      minCapacity,
      totalStaked,
      rewardToken: rewardTokenAddress,
    } = contractData;

    // Find token data for LP and reward tokens
    const lptToken = tokenData.find(t => t.address === lptTokenAddress);
    const rewardToken = tokenData.find(t => t.address === rewardTokenAddress);

    // Don't return pool data until we have all token data
    if (!lptToken || !rewardTokenAddress || !rewardToken) return undefined;

    const depositWindowEndsAt = new Date(Number(depositDeadline) * 1000);
    const createdAt = new Date(poolIndexedData?.poolById?.createdAt ?? 0);

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
      distributionRatePerSecond: BigNumber(distributionRatePerSecond)
        .div(DISTRIBUTION_RATE_BPS)
        .shiftedBy(-rewardToken.decimals),
      tvl: {
        current: fromSqd(activeStake),
        max: fromSqd(capacity),
        min: fromSqd(minCapacity || 0n),
        total: fromSqd(totalStaked),
      },
      depositWindowEndsAt,
      maxDepositPerAddress: fromSqd(BigInt(toSqd(100_000))),
      lptToken,
      rewardToken,
      createdAt,
      totalRewardsToppedUp: BigNumber(
        poolIndexedData?.poolById?.totalRewardsToppedUp ?? 0n,
      ).shiftedBy(-rewardToken.decimals),
    };
  }, [poolId, contractData, tokenData, poolIndexedData]);

  return {
    data,
    isLoading: isCheckingPortal || isLoadingData || isLoadingTokenData,
  };
}

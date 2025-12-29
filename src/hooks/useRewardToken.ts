import { useReadContract } from 'wagmi';

import { portalPoolFactoryAbi } from '@api/contracts';
import { useContracts } from '@network/useContracts';

import { useERC20 } from './useERC20';

/**
 * Hook to get the reward token (USDC) configuration from the pool factory
 * Fetches the USDC address from the factory and then loads token metadata
 */
export function useRewardToken() {
  const { PORTAL_POOL_FACTORY } = useContracts();

  // Fetch USDC address from pool factory
  const { data: rewardTokenAddress, isLoading: isLoadingAddress } = useReadContract({
    address: PORTAL_POOL_FACTORY,
    abi: portalPoolFactoryAbi,
    functionName: 'usdc',
    query: {
      staleTime: Infinity, // Factory config doesn't change
    },
  });

  // Fetch token metadata
  const {
    data: tokenData,
    isLoading: isLoadingTokenData,
  } = useERC20({
    address: rewardTokenAddress as `0x${string}`,
    enabled: !!rewardTokenAddress,
  });

  return {
    address: rewardTokenAddress as `0x${string}` | undefined,
    data: tokenData,
    isLoading: isLoadingAddress || isLoadingTokenData,
  };
}



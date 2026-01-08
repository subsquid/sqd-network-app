import { portalPoolFactoryAbi } from '@api/contracts';
import { useContracts } from '@network/useContracts';
import { useReadContract } from 'wagmi';

import { useERC20 } from './useERC20';

/**
 * Hook to get the reward token (USDC) configuration from the pool factory
 * Fetches the USDC address from the factory and then loads token metadata
 */
export function useRewardToken() {
  const { PORTAL_POOL_FACTORY } = useContracts();

  // Fetch USDC address from pool factory
  const { data, isLoading: isLoadingAddress } = useReadContract({
    address: PORTAL_POOL_FACTORY,
    abi: portalPoolFactoryAbi,
    functionName: 'getAllowedPaymentTokens',
    query: {
      staleTime: Infinity, // Factory config doesn't change
    },
  });

  const rewardTokenAddress = data?.[0];

  // Fetch token metadata
  const { data: tokenData, isLoading: isLoadingTokenData } = useERC20({
    address: rewardTokenAddress ?? `0x`,
    enabled: !!rewardTokenAddress,
  });

  return {
    address: rewardTokenAddress,
    data: tokenData,
    isLoading: isLoadingAddress || isLoadingTokenData,
  };
}

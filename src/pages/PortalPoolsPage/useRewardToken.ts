import { useReadContract } from 'wagmi';

import { portalPoolFactoryAbi } from '@api/contracts';
import { useContracts } from '@hooks/network/useContracts';

import { useERC20Tokens } from '../../hooks/network/useERC20';

export function useRewardTokens() {
  const { PORTAL_POOL_FACTORY } = useContracts();

  // Fetch USDC address from pool factory
  const { data: addresses, isLoading: isLoadingAddress } = useReadContract({
    address: PORTAL_POOL_FACTORY,
    abi: portalPoolFactoryAbi,
    functionName: 'getAllowedPaymentTokens',
    query: {
      staleTime: Infinity, // Factory config doesn't change
    },
  });

  // Fetch token metadata
  const { data: tokenData, isLoading: isLoadingTokenData } = useERC20Tokens({
    addresses,
    enabled: !!addresses,
  });

  return {
    data: tokenData,
    isLoading: isLoadingAddress || isLoadingTokenData,
  };
}

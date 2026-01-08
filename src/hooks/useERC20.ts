import { unwrapMulticallResult } from '@lib/network';
import { useMemo } from 'react';
import { erc20Abi } from 'viem';
import { useReadContracts } from 'wagmi';

export interface ERC20TokenData {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  name: string;
}

interface UseERC20Options {
  address: `0x${string}`;
  enabled?: boolean;
}

/**
 * Hook to read ERC20 token data from the blockchain
 * Fetches symbol, decimals, and name in a single multicall
 */
export function useERC20({ address, enabled = true }: UseERC20Options) {
  const tokenContract = {
    abi: erc20Abi,
    address,
  } as const;

  const { data: contractData, isLoading } = useReadContracts({
    contracts: [
      {
        ...tokenContract,
        functionName: 'symbol',
      },
      {
        ...tokenContract,
        functionName: 'decimals',
      },
      {
        ...tokenContract,
        functionName: 'name',
      },
    ] as const,
    query: {
      enabled: !!address && enabled,
      staleTime: Infinity, // Token metadata doesn't change
    },
  });

  const data = useMemo<ERC20TokenData | undefined>(() => {
    if (!contractData) return undefined;

    const symbol = unwrapMulticallResult(contractData[0]);
    const decimals = unwrapMulticallResult(contractData[1]);
    const name = unwrapMulticallResult(contractData[2]);

    if (symbol === undefined || decimals === undefined || name === undefined) {
      return undefined;
    }

    return {
      address,
      symbol,
      decimals,
      name,
    };
  }, [contractData, address]);

  return {
    data,
    isLoading,
  };
}

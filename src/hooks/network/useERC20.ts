import { useMemo } from 'react';

import { erc20Abi } from 'viem';
import { useReadContracts } from 'wagmi';

import { unwrapMulticallResult } from '@lib/network';

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
 * Helper function to create contract calls for ERC20 tokens
 */
function createTokenContracts(addresses: readonly `0x${string}`[]) {
  return addresses.flatMap(
    address =>
      [
        {
          abi: erc20Abi,
          address,
          functionName: 'symbol',
        },
        {
          abi: erc20Abi,
          address,
          functionName: 'decimals',
        },
        {
          abi: erc20Abi,
          address,
          functionName: 'name',
        },
      ] as const,
  );
}

/**
 * Helper function to parse multicall results into token data
 */
function parseTokenData(
  contractData: readonly unknown[],
  addresses: readonly `0x${string}`[],
): ERC20TokenData[] {
  const tokens: ERC20TokenData[] = [];

  // Each token has 3 calls (symbol, decimals, name)
  for (let i = 0; i < addresses.length; i++) {
    const baseIndex = i * 3;
    const symbol =
      (unwrapMulticallResult(contractData[baseIndex] as any) as string | undefined) ?? 'UNKNOWN';
    const decimals =
      (unwrapMulticallResult(contractData[baseIndex + 1] as any) as number | undefined) ?? 1;
    const name =
      (unwrapMulticallResult(contractData[baseIndex + 2] as any) as string | undefined) ??
      'Unknown Token';

    tokens.push({
      address: addresses[i],
      symbol,
      decimals,
      name,
    });
  }

  return tokens;
}

/**
 * Hook to read ERC20 token data from the blockchain
 * Fetches symbol, decimals, and name in a single multicall
 */
export function useERC20({ address, enabled = true }: UseERC20Options) {
  const contracts = useMemo(() => createTokenContracts([address]), [address]);

  const { data: contractData, isLoading } = useReadContracts({
    contracts,
    query: {
      enabled: !!address && enabled,
      staleTime: Infinity, // Token metadata doesn't change
    },
  });

  const data = useMemo<ERC20TokenData | undefined>(() => {
    if (!contractData) return undefined;
    return parseTokenData(contractData, [address])[0];
  }, [contractData, address]);

  return {
    data,
    isLoading,
  };
}

interface UseERC20TokensOptions {
  addresses?: readonly `0x${string}`[];
  enabled?: boolean;
}

/**
 * Hook to read ERC20 token data for multiple tokens from the blockchain
 * Fetches symbol, decimals, and name for all tokens in a single multicall
 */
export function useERC20Tokens({ addresses = [], enabled = true }: UseERC20TokensOptions) {
  const contracts = useMemo(() => createTokenContracts(addresses), [addresses]);

  const { data: contractData, isLoading } = useReadContracts({
    contracts,
    query: {
      enabled: addresses.length > 0 && enabled,
      staleTime: Infinity, // Token metadata doesn't change
    },
  });

  const data = useMemo<ERC20TokenData[]>(() => {
    if (!contractData) return [];
    return parseTokenData(contractData, addresses);
  }, [contractData, addresses]);

  return {
    data,
    isLoading,
  };
}

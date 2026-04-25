import { type Address, createPublicClient, erc20Abi, http } from 'viem';
import { arbitrum, arbitrumSepolia } from 'viem/chains';

import { getContractAddresses, getNetwork, getRpcUrl } from '../env.js';

let client: ReturnType<typeof createPublicClient> | undefined;

export function getPublicClient() {
  if (!client) {
    const baseChain = getNetwork() === 'tethys' ? arbitrumSepolia : arbitrum;
    const { MULTICALL } = getContractAddresses();
    // Override the chain's multicall3 address so viem batches against the
    // correct deployment. In mock/test mode the address differs from the
    // canonical 0xcA11… that the Arbitrum chain definition ships with.
    const chain = {
      ...baseChain,
      contracts: {
        ...baseChain.contracts,
        multicall3: { address: MULTICALL },
      },
    } as typeof baseChain;
    client = createPublicClient({
      chain,
      transport: http(getRpcUrl()),
      batch: {
        multicall: true,
      },
    });
  }
  return client;
}

export interface ERC20TokenData {
  address: Address;
  symbol: string;
  decimals: number;
  name: string;
}

export async function readERC20Tokens(addresses: Address[]): Promise<ERC20TokenData[]> {
  if (addresses.length === 0) return [];

  const publicClient = getPublicClient();

  const calls = addresses.flatMap(address => [
    { abi: erc20Abi, address, functionName: 'symbol' as const },
    { abi: erc20Abi, address, functionName: 'decimals' as const },
    { abi: erc20Abi, address, functionName: 'name' as const },
  ]);

  const results = await publicClient.multicall({ contracts: calls });

  const tokens: ERC20TokenData[] = [];
  for (let i = 0; i < addresses.length; i++) {
    const baseIndex = i * 3;
    const symbol =
      results[baseIndex].status === 'success' ? (results[baseIndex].result as string) : 'UNKNOWN';
    const decimals =
      results[baseIndex + 1].status === 'success' ? (results[baseIndex + 1].result as number) : 1;
    const name =
      results[baseIndex + 2].status === 'success'
        ? (results[baseIndex + 2].result as string)
        : 'Unknown Token';

    tokens.push({ address: addresses[i], symbol, decimals, name });
  }

  return tokens;
}

import { rewardDistributionAbi } from '@subsquid/common';
import type { Address } from 'viem';

import { getContractAddresses } from '../env.js';
import { getPublicClient } from './blockchain.js';

/**
 * Reads the total claimable reward amount (worker + delegation rewards combined)
 * for a set of addresses directly from the DistributedRewardsDistribution
 * contract via RPC. This is preferred over querying the Squid GraphQL indexer
 * because the on-chain value is the source of truth that the `claimFor` call
 * will actually settle against, so the UI stays in sync with the chain even
 * when the indexer is lagging.
 */
export async function readClaimableRewards(addresses: string[]): Promise<Map<string, bigint>> {
  const result = new Map<string, bigint>();
  if (addresses.length === 0) return result;

  const publicClient = getPublicClient();
  const { REWARD_DISTRIBUTION } = getContractAddresses();
  const contract: Address = REWARD_DISTRIBUTION;

  const calls = addresses.map(address => ({
    abi: rewardDistributionAbi,
    address: contract,
    functionName: 'claimable' as const,
    args: [address as Address],
  }));

  const results = await publicClient.multicall({ contracts: calls, allowFailure: true });

  for (let i = 0; i < addresses.length; i++) {
    const res = results[i];
    const value = res.status === 'success' ? (res.result as bigint) : 0n;
    result.set(addresses[i].toLowerCase(), value);
  }

  return result;
}

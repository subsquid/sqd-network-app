/**
 * Read-through resolvers for the token-squid surface.
 *
 * `sources` / `accountsByOwner`: MockSQD.balanceOf via viem.
 * `vestingByAddress` / `vestingsByAccount`: registry tells us *which*
 *   vesting contracts exist for the queried address; per-vesting balance
 *   comes from MockSQD.balanceOf(<vesting-addr>).
 *
 * The `delegations`-claimable-count field is approximated from
 * `Staking.delegates(staker).length` — exact enough for the UI's
 * "do I have anything to claim?" badge.
 */
import { type Address, type PublicClient, erc20Abi } from 'viem';

import { networkArtifact } from '../../artifacts';
import type { AddressMap } from '../../deployments';
import { type Resolver, registerResolver } from '../dispatcher';
import type { IndexerRegistry } from '../registry';

export interface TokenResolverDeps {
  client: PublicClient;
  deployments: AddressMap;
  registry: IndexerRegistry;
}

const stakingAbi = networkArtifact('Staking').abi;

async function balanceOf(deps: TokenResolverDeps, address: Address): Promise<bigint> {
  if (!deps.deployments.SQD) return 0n;
  try {
    return (await deps.client.readContract({
      abi: erc20Abi,
      address: deps.deployments.SQD as Address,
      functionName: 'balanceOf',
      args: [address],
    })) as bigint;
  } catch {
    return 0n;
  }
}

async function delegationCount(deps: TokenResolverDeps, owner: Address): Promise<number> {
  if (!deps.deployments.STAKING) return 0;
  try {
    const ids = (await deps.client.readContract({
      abi: stakingAbi,
      address: deps.deployments.STAKING as Address,
      functionName: 'delegates',
      args: [owner],
    })) as readonly bigint[];
    return ids.length;
  } catch {
    return 0;
  }
}

async function projectVesting(
  deps: TokenResolverDeps,
  vestingId: string,
): Promise<Record<string, unknown> | null> {
  const beneficiary = deps.registry.vestings.get(vestingId);
  if (!beneficiary) return null;
  const balance = await balanceOf(deps, vestingId as Address);
  return {
    id: vestingId,
    type: 'VESTING',
    balance: balance.toString(),
    claimableDelegationCount: 0,
    owner: { id: beneficiary, type: 'USER' },
    ownerId: beneficiary,
  };
}

export function registerTokenResolvers(deps: TokenResolverDeps): void {
  const sources: Resolver = async vars => {
    const address = (vars.address as string | undefined)?.toLowerCase();
    if (!address) return { accounts: [] };
    const balance = await balanceOf(deps, address as Address);
    return {
      accounts: [
        {
          id: address,
          type: 'USER',
          balance: balance.toString(),
          claimableDelegationCount: await delegationCount(deps, address as Address),
          owner: null,
          ownerId: null,
        },
      ],
    };
  };
  registerResolver('sources', sources);

  const accountsByOwner: Resolver = async vars => {
    const address = (vars.address as string | undefined)?.toLowerCase();
    if (!address) return { accounts: [] };
    const accounts: Record<string, unknown>[] = [];
    const balance = await balanceOf(deps, address as Address);
    accounts.push({
      id: address,
      type: 'USER',
      balance: balance.toString(),
      claimableDelegationCount: await delegationCount(deps, address as Address),
      owner: null,
      ownerId: null,
    });
    const vestingIds = deps.registry.vestingsByBeneficiary.get(address);
    if (vestingIds) {
      for (const vid of vestingIds) {
        const projected = await projectVesting(deps, vid);
        if (projected) accounts.push(projected);
      }
    }
    return { accounts };
  };
  registerResolver('accountsByOwner', accountsByOwner);

  registerResolver('vestingByAddress', async vars => {
    const address = (vars.address as string | undefined)?.toLowerCase();
    if (!address) return { accountById: null };
    const projected = await projectVesting(deps, address);
    return { accountById: projected };
  });

  registerResolver('vestingsByAccount', async vars => {
    const address = (vars.address as string | undefined)?.toLowerCase();
    if (!address) return { accounts: [] };
    const vestingIds = deps.registry.vestingsByBeneficiary.get(address);
    if (!vestingIds) return { accounts: [] };
    const accounts: Record<string, unknown>[] = [];
    for (const vid of vestingIds) {
      const projected = await projectVesting(deps, vid);
      if (projected) accounts.push(projected);
    }
    return { accounts };
  });
}

/**
 * Chain-derived resolvers for the token-squid surface: sources,
 * accountsByOwner, vestingByAddress, vestingsByAccount.
 *
 * `sources` and `accountsByOwner` read MockSQD.balanceOf via viem so the
 * Assets page reflects the persona's actual on-chain SQD balance after
 * dev-mode operations (deposits, withdrawals, etc.).
 *
 * Vesting accounts stay hand-rolled until the deploy harness creates one
 * via VestingFactory (deferred).
 */
import { type Address, type PublicClient, erc20Abi } from 'viem';

import type { AddressMap } from '../../deployments';
import { type Resolver, registerResolver } from '../dispatcher';
import type { EntityStore } from '../entities';

export interface TokenResolverDeps {
  client: PublicClient;
  deployments: AddressMap;
  store: EntityStore;
}

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

/** Count how many delegations (across all workers) the address has stake in. */
function claimableDelegationCount(deps: TokenResolverDeps, owner: string): number {
  const keys = deps.store.delegationsByOwner.get(owner.toLowerCase());
  if (!keys) return 0;
  let count = 0;
  for (const key of keys) {
    const d = deps.store.delegations.get(key);
    if (d && d.deposit > 0n) count += 1;
  }
  return count;
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
          claimableDelegationCount: claimableDelegationCount(deps, address),
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
    const balance = await balanceOf(deps, address as Address);
    return {
      accounts: [
        {
          id: address,
          type: 'USER',
          balance: balance.toString(),
          claimableDelegationCount: claimableDelegationCount(deps, address),
          owner: null,
          ownerId: null,
        },
      ],
    };
  };
  registerResolver('accountsByOwner', accountsByOwner);

  // Vesting flows aren't deployed yet; return null/empty so the UI knows
  // there's no vesting account for the queried address.
  registerResolver('vestingByAddress', () => ({ accountById: null }));
  registerResolver('vestingsByAccount', () => ({ accounts: [] }));
}

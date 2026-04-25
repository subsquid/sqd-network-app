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

/**
 * Project a vesting entity into the GraphQL `account` shape with a
 * chain-derived current balance. The contract holds SQD, so its current
 * locked balance is just `MockSQD.balanceOf(vesting)`.
 */
async function projectVesting(
  deps: TokenResolverDeps,
  vestingId: string,
): Promise<Record<string, unknown> | null> {
  const v = deps.store.vestings.get(vestingId);
  if (!v) return null;
  const balance = await balanceOf(deps, vestingId as Address);
  return {
    id: v.id,
    type: 'VESTING',
    balance: balance.toString(),
    claimableDelegationCount: 0,
    owner: { id: v.beneficiaryId, type: 'USER' },
    ownerId: v.beneficiaryId,
  };
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
    const accounts: Record<string, unknown>[] = [];
    // USER account.
    const balance = await balanceOf(deps, address as Address);
    accounts.push({
      id: address,
      type: 'USER',
      balance: balance.toString(),
      claimableDelegationCount: claimableDelegationCount(deps, address),
      owner: null,
      ownerId: null,
    });
    // VESTING accounts owned by `address`.
    const vestingIds = deps.store.vestingsByBeneficiary.get(address);
    if (vestingIds) {
      for (const vid of vestingIds) {
        const projected = await projectVesting(deps, vid);
        if (projected) accounts.push(projected);
      }
    }
    return { accounts };
  };
  registerResolver('accountsByOwner', accountsByOwner);

  // vestingByAddress: address arg is the vesting contract id.
  registerResolver('vestingByAddress', async vars => {
    const address = (vars.address as string | undefined)?.toLowerCase();
    if (!address) return { accountById: null };
    const projected = await projectVesting(deps, address);
    return { accountById: projected };
  });

  // vestingsByAccount: address arg is the beneficiary; return all VESTING
  // accounts owned by them.
  registerResolver('vestingsByAccount', async vars => {
    const address = (vars.address as string | undefined)?.toLowerCase();
    if (!address) return { accounts: [] };
    const vestingIds = deps.store.vestingsByBeneficiary.get(address);
    if (!vestingIds) return { accounts: [] };
    const accounts: Record<string, unknown>[] = [];
    for (const vid of vestingIds) {
      const projected = await projectVesting(deps, vid);
      if (projected) accounts.push(projected);
    }
    return { accounts };
  });
}

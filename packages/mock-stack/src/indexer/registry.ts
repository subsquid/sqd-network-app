/**
 * Slim address registry maintained by the indexer.
 *
 * The mini-indexer's only job is enumerating dynamic addresses that the
 * contracts don't expose via view functions:
 *   - All deployed portal pool addresses (PortalPoolFactory.PoolCreated).
 *   - Vesting contract addresses keyed by beneficiary
 *     (VestingFactory.VestingCreated).
 *
 * Everything else (workers, delegations, balances, pool TVL, vesting
 * balances) is read through to chain inside each resolver via
 * `viem.readContract` — the contracts already expose the right view
 * functions (`getActiveWorkerIds`, `getWorker`, `Staking.delegates`,
 * `Staking.getDeposit`, `Pool.getPoolInfo`, etc.). No projection layer.
 */

export interface IndexerRegistry {
  /** Lower-cased portal pool addresses keyed for set-membership lookups. */
  portalPools: Set<string>;
  /** poolId → block number it was created at (for newest-first ordering). */
  portalPoolCreatedAt: Map<string, bigint>;
  /** Lower-cased vesting contract address → lower-cased beneficiary. */
  vestings: Map<string, string>;
  /** Beneficiary address → set of vesting contract addresses owned by it. */
  vestingsByBeneficiary: Map<string, Set<string>>;
}

export function createRegistry(): IndexerRegistry {
  return {
    portalPools: new Set(),
    portalPoolCreatedAt: new Map(),
    vestings: new Map(),
    vestingsByBeneficiary: new Map(),
  };
}

export function clearRegistry(registry: IndexerRegistry): void {
  registry.portalPools.clear();
  registry.portalPoolCreatedAt.clear();
  registry.vestings.clear();
  registry.vestingsByBeneficiary.clear();
}

export function rememberPortalPool(
  registry: IndexerRegistry,
  pool: string,
  createdAtBlock: bigint,
): void {
  const id = pool.toLowerCase();
  registry.portalPools.add(id);
  registry.portalPoolCreatedAt.set(id, createdAtBlock);
}

export function rememberVesting(
  registry: IndexerRegistry,
  vesting: string,
  beneficiary: string,
): void {
  const v = vesting.toLowerCase();
  const b = beneficiary.toLowerCase();
  registry.vestings.set(v, b);
  let set = registry.vestingsByBeneficiary.get(b);
  if (!set) {
    set = new Set();
    registry.vestingsByBeneficiary.set(b, set);
  }
  set.add(v);
}

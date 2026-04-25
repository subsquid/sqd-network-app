/**
 * Entity store: the indexer's projection of on-chain logs into TS Maps that
 * resolvers consult.
 *
 * The schema mirrors the tiny subset of squid-subsquid-network entities the
 * GraphQL layer actually needs — workers + delegations are the only ones
 * with chain-derived identity. Everything else (timeseries, summaries,
 * gateway state, portal state) stays synthetic.
 */

export interface WorkerEntity {
  /** Numeric workerId minted by `WorkerRegistration.register`. */
  id: bigint;
  /** Raw bytes the contract stores; resolvers base58-encode before serving. */
  peerId: `0x${string}`;
  /** Lower-cased registrar address. */
  ownerId: string;
  /** Registration block + timestamp captured from the event log. */
  registeredAtBlock: bigint;
  registeredAtTimestamp: bigint;
  /** Set on WorkerDeregistered; null while active. */
  deregisteredAtBlock: bigint | null;
  /** Free-form metadata string the registrar passed in. */
  metadata: string;
}

export interface DelegationEntity {
  workerId: bigint;
  /** Lower-cased staker address. */
  ownerId: string;
  /** Cumulative amount currently deposited (Deposited - Withdrawn). */
  deposit: bigint;
  /** Last block at which this delegation was mutated. */
  updatedAtBlock: bigint;
}

export interface VestingEntity {
  /** Lower-cased Vesting contract address — used as the GraphQL `id`. */
  id: string;
  /** Lower-cased beneficiary address. */
  beneficiaryId: string;
  /** When linear vesting starts (unix seconds). */
  startTimestamp: bigint;
  /** Total vesting duration (seconds). */
  durationSeconds: bigint;
  /** Total amount the contract is expected to hold (wei). */
  expectedTotalAmount: bigint;
}

/** In-memory entity store. Exported so tests can inspect it directly. */
export interface EntityStore {
  workers: Map<bigint, WorkerEntity>;
  workersByPeerId: Map<string, bigint>;
  workersByOwner: Map<string, Set<bigint>>;
  delegations: Map<string, DelegationEntity>;
  delegationsByOwner: Map<string, Set<string>>;
  delegationsByWorker: Map<bigint, Set<string>>;
  /** Vesting accounts keyed by lower-cased contract address. */
  vestings: Map<string, VestingEntity>;
  /** Inverse lookup: beneficiary address → set of vesting ids. */
  vestingsByBeneficiary: Map<string, Set<string>>;
}

export function createEntityStore(): EntityStore {
  return {
    workers: new Map(),
    workersByPeerId: new Map(),
    workersByOwner: new Map(),
    delegations: new Map(),
    delegationsByOwner: new Map(),
    delegationsByWorker: new Map(),
    vestings: new Map(),
    vestingsByBeneficiary: new Map(),
  };
}

/** Composite key for the delegations map. */
export function delegationKey(workerId: bigint, owner: string): string {
  return `${workerId}:${owner.toLowerCase()}`;
}

/** Add an item to a `Map<K, Set<V>>` value-set, creating the inner set lazily. */
export function addToSetMap<K, V>(map: Map<K, Set<V>>, key: K, value: V): void {
  let set = map.get(key);
  if (!set) {
    set = new Set();
    map.set(key, set);
  }
  set.add(value);
}

export function clearEntities(store: EntityStore): void {
  store.workers.clear();
  store.workersByPeerId.clear();
  store.workersByOwner.clear();
  store.delegations.clear();
  store.delegationsByOwner.clear();
  store.delegationsByWorker.clear();
  store.vestings.clear();
  store.vestingsByBeneficiary.clear();
}

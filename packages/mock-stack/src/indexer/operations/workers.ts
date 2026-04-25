/**
 * Chain-derived resolvers for worker / delegation operations.
 *
 * Each resolver consults the entity store (`store.workers`,
 * `store.delegations`, …) populated by the log-driven indexer, plus pulls
 * synthetic metric fields (uptime / APR / queries / served data) from
 * `synthetic.ts` so the UI still has dummy timeseries to render.
 */
import bs58 from 'bs58';
import { type Address, type PublicClient, hexToBytes } from 'viem';

import type { AddressMap } from '../../deployments';
import type {
  DelegationEntity,
  EntityStore,
  WorkerEntity,
} from '../entities';
import { type Resolver, registerResolver } from '../dispatcher';

export interface WorkersResolverDeps {
  store: EntityStore;
  client: PublicClient;
  deployments: AddressMap;
  /** Block timestamp helper used to project registeredAt into ISO strings. */
  blockTimestamp(block: bigint): string;
}

/** PRNG-derived synthetic metrics shared between worker projections. */
interface SyntheticMetrics {
  apr: number;
  stakerApr: number;
  uptime90Days: number;
  uptime24Hours: number;
  queries24Hours: number;
  queries90Days: number;
  servedData24Hours: string;
  servedData90Days: string;
  scannedData24Hours: string;
  scannedData90Days: string;
  storedData: string;
}

/** Deterministic synthetic metrics seeded by workerId. */
function syntheticMetrics(workerId: bigint): SyntheticMetrics {
  // Wide multiplier keeps numbers visually distinct between workers without
  // pulling in a full PRNG for these few fields.
  const offset = Number(workerId);
  return {
    apr: 0.12 + offset * 0.005,
    stakerApr: 0.07 + offset * 0.003,
    uptime90Days: 0.97 + Math.min(offset * 0.005, 0.029),
    uptime24Hours: 0.99,
    queries24Hours: 100_000 + offset * 5_000,
    queries90Days: 8_000_000 + offset * 250_000,
    servedData24Hours: String(536_870_912 + offset * 1_048_576),
    servedData90Days: String(48_318_382_080 + offset * 134_217_728),
    scannedData24Hours: String(2_147_483_648 + offset * 268_435_456),
    scannedData90Days: String(193_273_528_320 + offset * 1_073_741_824),
    storedData: String(5_368_709_120 + offset * 1_073_741_824),
  };
}

function bytesToBase58(hex: `0x${string}`): string {
  return bs58.encode(hexToBytes(hex));
}

function projectWorker(
  worker: WorkerEntity,
  deps: WorkersResolverDeps,
  bondAmount: bigint,
  delegationLimit: bigint,
): Record<string, unknown> {
  const delegations = collectDelegations(worker.id, deps.store);
  const totalDelegation = delegations.reduce((acc, d) => acc + d.deposit, 0n);
  const cap = delegationLimit > 0n ? bondAmount * delegationLimit : totalDelegation;
  const capedDelegation = totalDelegation > cap ? cap : totalDelegation;
  const metrics = syntheticMetrics(worker.id);
  const status = worker.deregisteredAtBlock !== null ? 'DEREGISTERED' : 'ACTIVE';

  return {
    id: String(worker.id),
    name: parseWorkerName(worker.metadata) ?? `Worker ${worker.id}`,
    peerId: bytesToBase58(worker.peerId),
    ownerId: worker.ownerId,
    status,
    online: true,
    jailed: false,
    dialOk: true,
    jailReason: null,
    statusHistory: [
      {
        blockNumber: Number(worker.registeredAtBlock),
        pending: false,
        timestamp: deps.blockTimestamp(worker.registeredAtBlock),
      },
    ],
    version: '1.1.2',
    createdAt: deps.blockTimestamp(worker.registeredAtBlock),
    apr: metrics.apr,
    stakerApr: metrics.stakerApr,
    uptime90Days: metrics.uptime90Days,
    uptime24Hours: metrics.uptime24Hours,
    totalDelegation: totalDelegation.toString(),
    capedDelegation: capedDelegation.toString(),
    delegationCount: delegations.length,
    locked: false,
    lockEnd: null,
    bond: bondAmount.toString(),
    claimableReward: '0',
    claimedReward: '0',
    totalDelegationRewards: '0',
    queries24Hours: metrics.queries24Hours,
    queries90Days: metrics.queries90Days,
    scannedData24Hours: metrics.scannedData24Hours,
    scannedData90Days: metrics.scannedData90Days,
    servedData24Hours: metrics.servedData24Hours,
    servedData90Days: metrics.servedData90Days,
    storedData: metrics.storedData,
    website: null,
    email: null,
    description: null,
    dayUptimes: Array.from({ length: 7 }, (_, i) => ({
      timestamp: new Date(Date.now() - (7 - i) * 86_400_000).toISOString(),
      uptime: metrics.uptime90Days,
    })),
    delegations: delegations.map(d => ({
      deposit: d.deposit.toString(),
      claimableReward: '0',
      claimedReward: '0',
      locked: false,
      lockEnd: null,
      ownerId: d.ownerId,
    })),
  };
}

function parseWorkerName(metadata: string): string | null {
  try {
    const obj = JSON.parse(metadata) as { name?: string };
    return obj.name ?? null;
  } catch {
    return null;
  }
}

function collectDelegations(workerId: bigint, store: EntityStore): DelegationEntity[] {
  const keys = store.delegationsByWorker.get(workerId);
  if (!keys) return [];
  const result: DelegationEntity[] = [];
  for (const key of keys) {
    const d = store.delegations.get(key);
    if (d && d.deposit > 0n) result.push(d);
  }
  return result;
}

let cachedBondAmount: bigint | null = null;
async function getBondAmount(deps: WorkersResolverDeps): Promise<bigint> {
  if (cachedBondAmount !== null) return cachedBondAmount;
  if (!deps.deployments.NETWORK_CONTROLLER) return 100_000n * 10n ** 18n;
  cachedBondAmount = (await deps.client.readContract({
    abi: [
      {
        type: 'function',
        name: 'bondAmount',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint256' }],
      },
    ],
    address: deps.deployments.NETWORK_CONTROLLER as Address,
    functionName: 'bondAmount',
  })) as bigint;
  return cachedBondAmount;
}

let cachedDelegationLimit: bigint | null = null;
async function getDelegationLimitCoefficient(deps: WorkersResolverDeps): Promise<bigint> {
  if (cachedDelegationLimit !== null) return cachedDelegationLimit;
  if (!deps.deployments.STAKING) return 20n;
  // Best-effort: viem.readContract throws if the function is missing; fall
  // back to the default coefficient of 20 used in production today.
  try {
    cachedDelegationLimit = (await deps.client.readContract({
      abi: [
        {
          type: 'function',
          name: 'delegationLimitCoefficient',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ type: 'uint256' }],
        },
      ],
      address: deps.deployments.STAKING as Address,
      functionName: 'delegationLimitCoefficient',
    })) as bigint;
  } catch {
    cachedDelegationLimit = 20n;
  }
  return cachedDelegationLimit;
}

/**
 * Build a `(operationName, variables) => result` for each chain-derived
 * worker operation and register it with the global dispatcher.
 */
export function registerWorkerResolvers(deps: WorkersResolverDeps): void {
  const allWorkers: Resolver = async () => {
    const bond = await getBondAmount(deps);
    const limit = await getDelegationLimitCoefficient(deps);
    const list = [...deps.store.workers.values()]
      .filter(w => w.deregisteredAtBlock === null)
      .sort((a, b) => Number(a.id - b.id))
      .map(w => projectWorker(w, deps, bond, limit));
    return { workers: list };
  };
  registerResolver('allWorkers', allWorkers);

  registerResolver('workerByPeerId', async vars => {
    const bond = await getBondAmount(deps);
    const limit = await getDelegationLimitCoefficient(deps);
    const peerId = vars.peerId as string | undefined;
    if (!peerId) return { workers: [] };
    const peerHex = `0x${Buffer.from(bs58.decode(peerId)).toString('hex')}`.toLowerCase();
    const id = deps.store.workersByPeerId.get(peerHex);
    if (!id) return { workers: [] };
    const w = deps.store.workers.get(id);
    return { workers: w ? [projectWorker(w, deps, bond, limit)] : [] };
  });

  registerResolver('myWorkers', async vars => {
    const bond = await getBondAmount(deps);
    const limit = await getDelegationLimitCoefficient(deps);
    const owners = ((vars.ownerIds as string[] | undefined) ?? []).map(s => s.toLowerCase());
    const list: Record<string, unknown>[] = [];
    for (const owner of owners) {
      const ids = deps.store.workersByOwner.get(owner);
      if (!ids) continue;
      for (const id of [...ids].sort((a, b) => Number(a - b))) {
        const w = deps.store.workers.get(id);
        if (w && w.deregisteredAtBlock === null) {
          list.push(projectWorker(w, deps, bond, limit));
        }
      }
    }
    return { workers: list };
  });

  registerResolver('myWorkersCount', vars => {
    const owners = ((vars.ownerIds as string[] | undefined) ?? []).map(s => s.toLowerCase());
    let count = 0;
    for (const owner of owners) {
      const ids = deps.store.workersByOwner.get(owner);
      if (!ids) continue;
      for (const id of ids) {
        const w = deps.store.workers.get(id);
        if (w && w.deregisteredAtBlock === null) count += 1;
      }
    }
    return { workersConnection: { totalCount: count } };
  });

  registerResolver('workerDelegationInfo', async vars => {
    const bond = await getBondAmount(deps);
    const limit = await getDelegationLimitCoefficient(deps);
    const wid = BigInt(vars.workerId as string);
    const w = deps.store.workers.get(wid);
    if (!w) return { workerById: null, settings: [] };
    const delegations = collectDelegations(wid, deps.store);
    const total = delegations.reduce((acc, d) => acc + d.deposit, 0n);
    const cap = limit > 0n ? bond * limit : total;
    const capedDelegation = total > cap ? cap : total;
    return {
      workerById: {
        bond: bond.toString(),
        totalDelegation: total.toString(),
        capedDelegation: capedDelegation.toString(),
        liveness: 0.99,
        dTenure: 0.95,
        trafficWeight: 0.85,
      },
      settings: [{ utilizedStake: '60000000000000000000000000', baseApr: 0.15 }],
    };
  });

  registerResolver('workersByOwner', vars => {
    const owners = ((vars.ownerIds as string[] | undefined) ?? []).map(s => s.toLowerCase());
    const list: Record<string, unknown>[] = [];
    for (const owner of owners) {
      const ids = deps.store.workersByOwner.get(owner);
      if (!ids) continue;
      for (const id of [...ids].sort((a, b) => Number(a - b))) {
        const w = deps.store.workers.get(id);
        if (!w) continue;
        list.push({
          id: String(w.id),
          name: parseWorkerName(w.metadata) ?? `Worker ${w.id}`,
          peerId: bytesToBase58(w.peerId),
          ownerId: w.ownerId,
          bond: '100000000000000000000000', // synthetic; matches NetworkController.bondAmount
          claimableReward: '0',
        });
      }
    }
    return { workers: list };
  });

  registerResolver('myDelegations', async vars => {
    const bond = await getBondAmount(deps);
    const limit = await getDelegationLimitCoefficient(deps);
    const owners = ((vars.ownerIds as string[] | undefined) ?? []).map(s => s.toLowerCase());
    const seenWorkers = new Set<bigint>();
    const list: Record<string, unknown>[] = [];
    for (const owner of owners) {
      const keys = deps.store.delegationsByOwner.get(owner);
      if (!keys) continue;
      for (const key of keys) {
        const d = deps.store.delegations.get(key);
        if (!d || d.deposit === 0n) continue;
        const w = deps.store.workers.get(d.workerId);
        if (!w) continue;
        if (seenWorkers.has(w.id)) continue;
        seenWorkers.add(w.id);
        const projected = projectWorker(w, deps, bond, limit);
        // Filter the delegations array to only those owned by the queried
        // owners (matches the GraphQL where: { ownerId_in } filter).
        const filtered = collectDelegations(w.id, deps.store)
          .filter(x => owners.includes(x.ownerId))
          .map(x => ({
            deposit: x.deposit.toString(),
            claimableReward: '0',
            claimedReward: '0',
            locked: false,
            lockEnd: null,
            ownerId: x.ownerId,
          }));
        list.push({ ...projected, delegations: filtered });
      }
    }
    return { workers: list };
  });

  registerResolver('delegationsByOwner', vars => {
    const owners = ((vars.ownerIds as string[] | undefined) ?? []).map(s => s.toLowerCase());
    const list: Record<string, unknown>[] = [];
    for (const owner of owners) {
      const keys = deps.store.delegationsByOwner.get(owner);
      if (!keys) continue;
      for (const key of keys) {
        const d = deps.store.delegations.get(key);
        if (!d || d.deposit === 0n) continue;
        list.push({
          id: `delegation-${d.workerId}-${d.ownerId}`,
          ownerId: d.ownerId,
          deposit: d.deposit.toString(),
          claimableReward: '0',
          claimedReward: '0',
          locked: false,
          lockEnd: null,
        });
      }
    }
    return { delegations: list };
  });
}

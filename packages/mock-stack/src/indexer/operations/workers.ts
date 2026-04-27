/**
 * Read-through resolvers for worker / delegation operations.
 *
 * Every worker projection comes from `WorkerRegistration.getWorker(id)` +
 * `Staking.delegated(id)` for the per-worker total. Per-staker delegations
 * come from `Staking.delegates(staker)` + `Staking.getDeposit(staker, id)`.
 *
 * The mini-indexer registry isn't consulted here — the contracts already
 * expose enumeration views (`getActiveWorkerIds`, `getOwnedWorkers(addr)`,
 * `Staking.delegates(staker)`).
 */
import bs58 from 'bs58';
import { type Abi, type Address, type PublicClient, hexToBytes, toHex } from 'viem';

import { networkArtifact } from '../../artifacts';
import type { AddressMap } from '../../deployments';
import { type Resolver, registerResolver } from '../dispatcher';

export interface WorkersResolverDeps {
  client: PublicClient;
  deployments: AddressMap;
  /** Block timestamp helper used to project registeredAt into ISO strings. */
  blockTimestamp(block: bigint): string;
}

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

function syntheticMetrics(workerId: bigint): SyntheticMetrics {
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

interface OnChainWorker {
  creator: `0x${string}`;
  peerId: `0x${string}`;
  bond: bigint;
  registeredAt: bigint;
  deregisteredAt: bigint;
  metadata: string;
}

function bytesToBase58(hex: `0x${string}`): string {
  return bs58.encode(hexToBytes(hex));
}

function parseWorkerName(metadata: string, fallback: string): string {
  try {
    const obj = JSON.parse(metadata) as { name?: string };
    return obj.name ?? fallback;
  } catch {
    return fallback;
  }
}

// ABIs are loaded lazily — `forge build` may not have run yet at module-load
// time (e.g. when the @subsquid/server bundle imports a downstream module
// that pulls these in before the chain process has prepared artefacts).
let _workerRegAbi: Abi | undefined;
let _stakingAbi: Abi | undefined;
let _networkAbi: Abi | undefined;
function workerRegAbi(): Abi {
  return (_workerRegAbi ??= networkArtifact('WorkerRegistration').abi);
}
function stakingAbi(): Abi {
  return (_stakingAbi ??= networkArtifact('Staking').abi);
}
function networkAbi(): Abi {
  return (_networkAbi ??= networkArtifact('NetworkController').abi);
}

async function readWorker(
  client: PublicClient,
  registration: Address,
  workerId: bigint,
): Promise<OnChainWorker | null> {
  try {
    const w = (await client.readContract({
      abi: workerRegAbi(),
      address: registration,
      functionName: 'getWorker',
      args: [workerId],
    })) as OnChainWorker;
    return w;
  } catch {
    return null;
  }
}

async function readDelegated(
  client: PublicClient,
  staking: Address,
  workerId: bigint,
): Promise<bigint> {
  try {
    return (await client.readContract({
      abi: stakingAbi(),
      address: staking,
      functionName: 'delegated',
      args: [workerId],
    })) as bigint;
  } catch {
    return 0n;
  }
}

async function readBondAmount(
  client: PublicClient,
  controller: Address | undefined,
): Promise<bigint> {
  if (!controller) return 100_000n * 10n ** 18n;
  try {
    return (await client.readContract({
      abi: networkAbi(),
      address: controller,
      functionName: 'bondAmount',
    })) as bigint;
  } catch {
    return 100_000n * 10n ** 18n;
  }
}

async function readActiveWorkerIds(
  client: PublicClient,
  registration: Address,
): Promise<readonly bigint[]> {
  try {
    return (await client.readContract({
      abi: workerRegAbi(),
      address: registration,
      functionName: 'getActiveWorkerIds',
    })) as readonly bigint[];
  } catch {
    return [];
  }
}

async function readOwnedWorkers(
  client: PublicClient,
  registration: Address,
  owner: Address,
): Promise<readonly bigint[]> {
  try {
    return (await client.readContract({
      abi: workerRegAbi(),
      address: registration,
      functionName: 'getOwnedWorkers',
      args: [owner],
    })) as readonly bigint[];
  } catch {
    return [];
  }
}

async function readDelegates(
  client: PublicClient,
  staking: Address,
  staker: Address,
): Promise<readonly bigint[]> {
  try {
    return (await client.readContract({
      abi: stakingAbi(),
      address: staking,
      functionName: 'delegates',
      args: [staker],
    })) as readonly bigint[];
  } catch {
    return [];
  }
}

/**
 * Aggregate per-worker staker reward totals by replaying every `Distributed`
 * event emitted by `DistributedRewardsDistribution`. Returns
 * `Map<workerId, totalStakerReward>` in raw token units (1e18-scaled).
 *
 * In the mock, deposits are placed before any reward commit and never change
 * afterwards, so `totalStaked[worker]` is constant across all commits — that
 * makes the per-(worker, staker) pending reward exactly:
 *
 *   pending = totalStakerReward[worker] * depositAmount[staker, worker]
 *           / totalStaked[worker]
 *
 * which matches what `Staking.claimable(staker)` would report for that
 * single worker. We use this to populate `delegations[].claimableReward`
 * (the indexer-side projection) so the UI's "Total reward" column lines up
 * with the on-chain `Staking.claimable` value the Assets page reads.
 */
async function readPerWorkerStakerRewards(
  client: PublicClient,
  rewardDistribution: Address | undefined,
): Promise<Map<bigint, bigint>> {
  const out = new Map<bigint, bigint>();
  if (!rewardDistribution) return out;
  const abi = networkArtifact(
    'DistributedRewardDistribution',
    'DistributedRewardsDistribution',
  ).abi;
  let logs: Awaited<ReturnType<PublicClient['getContractEvents']>>;
  try {
    logs = await client.getContractEvents({
      abi,
      address: rewardDistribution,
      eventName: 'Distributed',
      fromBlock: 0n,
      toBlock: 'latest',
    });
  } catch {
    return out;
  }
  for (const log of logs) {
    const args = (log as { args?: Record<string, unknown> }).args ?? {};
    const recipients = (args.recipients as readonly bigint[] | undefined) ?? [];
    const stakerRewards = (args.stakerRewards as readonly bigint[] | undefined) ?? [];
    for (let i = 0; i < recipients.length; i++) {
      const reward = stakerRewards[i] ?? 0n;
      if (reward === 0n) continue;
      const wid = recipients[i];
      out.set(wid, (out.get(wid) ?? 0n) + reward);
    }
  }
  return out;
}

async function readDeposit(
  client: PublicClient,
  staking: Address,
  staker: Address,
  workerId: bigint,
): Promise<{ depositAmount: bigint; withdrawAllowed: bigint }> {
  try {
    const result = (await client.readContract({
      abi: stakingAbi(),
      address: staking,
      functionName: 'getDeposit',
      args: [staker, workerId],
    })) as readonly [bigint, bigint];
    return { depositAmount: result[0], withdrawAllowed: result[1] };
  } catch {
    return { depositAmount: 0n, withdrawAllowed: 0n };
  }
}

async function projectWorker(
  deps: WorkersResolverDeps,
  workerId: bigint,
  bondAmount: bigint,
  delegationLimit: bigint,
  ownersForDelegationFilter?: readonly string[],
  perWorkerStakerRewards?: ReadonlyMap<bigint, bigint>,
): Promise<Record<string, unknown> | null> {
  const w = await readWorker(deps.client, deps.deployments.WORKER_REGISTRATION, workerId);
  if (!w) return null;
  const totalDelegation = await readDelegated(deps.client, deps.deployments.STAKING, workerId);
  const cap = delegationLimit > 0n ? bondAmount * delegationLimit : totalDelegation;
  const capedDelegation = totalDelegation > cap ? cap : totalDelegation;
  const metrics = syntheticMetrics(workerId);
  const status = w.deregisteredAt !== 0n ? 'DEREGISTERED' : 'ACTIVE';
  const ownerId = w.creator.toLowerCase();
  const totalStakerReward = perWorkerStakerRewards?.get(workerId) ?? 0n;

  const delegations: Record<string, unknown>[] = [];
  if (ownersForDelegationFilter && ownersForDelegationFilter.length > 0) {
    for (const owner of ownersForDelegationFilter) {
      const { depositAmount } = await readDeposit(
        deps.client,
        deps.deployments.STAKING,
        owner as Address,
        workerId,
      );
      if (depositAmount > 0n) {
        const claimable =
          totalStakerReward > 0n && totalDelegation > 0n
            ? (totalStakerReward * depositAmount) / totalDelegation
            : 0n;
        delegations.push({
          deposit: depositAmount.toString(),
          claimableReward: claimable.toString(),
          claimedReward: '0',
          locked: false,
          lockEnd: null,
          ownerId: owner.toLowerCase(),
        });
      }
    }
  }

  return {
    id: String(workerId),
    name: parseWorkerName(w.metadata, `Worker ${workerId}`),
    peerId: bytesToBase58(w.peerId),
    ownerId,
    status,
    online: true,
    jailed: false,
    dialOk: true,
    jailReason: null,
    statusHistory: [
      {
        blockNumber: Number(w.registeredAt),
        pending: false,
        timestamp: deps.blockTimestamp(w.registeredAt),
      },
    ],
    version: '1.1.2',
    createdAt: deps.blockTimestamp(w.registeredAt),
    apr: metrics.apr,
    stakerApr: metrics.stakerApr,
    uptime90Days: metrics.uptime90Days,
    uptime24Hours: metrics.uptime24Hours,
    totalDelegation: totalDelegation.toString(),
    capedDelegation: capedDelegation.toString(),
    delegationCount: 0, // resolver doesn't enumerate stakers; UI mostly uses totalDelegation
    locked: false,
    lockEnd: null,
    bond: w.bond.toString(),
    claimableReward: '0',
    claimedReward: '0',
    totalDelegationRewards: totalStakerReward.toString(),
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
    delegations,
  };
}

export function registerWorkerResolvers(deps: WorkersResolverDeps): void {
  const allWorkers: Resolver = async () => {
    const ids = await readActiveWorkerIds(deps.client, deps.deployments.WORKER_REGISTRATION);
    const bond = await readBondAmount(deps.client, deps.deployments.NETWORK_CONTROLLER);
    const limit = 20n;
    const list: Record<string, unknown>[] = [];
    for (const id of ids) {
      const projected = await projectWorker(deps, id, bond, limit);
      if (projected) list.push(projected);
    }
    return { workers: list };
  };
  registerResolver('allWorkers', allWorkers);

  registerResolver('workerByPeerId', async vars => {
    const peerId = vars.peerId as string | undefined;
    if (!peerId) return { workers: [] };
    let peerHex: `0x${string}`;
    try {
      peerHex = toHex(bs58.decode(peerId));
    } catch {
      return { workers: [] };
    }
    let id: bigint = 0n;
    try {
      id = (await deps.client.readContract({
        abi: workerRegAbi(),
        address: deps.deployments.WORKER_REGISTRATION,
        functionName: 'workerIds',
        args: [peerHex],
      })) as bigint;
    } catch {
      return { workers: [] };
    }
    if (id === 0n) return { workers: [] };
    const bond = await readBondAmount(deps.client, deps.deployments.NETWORK_CONTROLLER);
    const projected = await projectWorker(deps, id, bond, 20n);
    return { workers: projected ? [projected] : [] };
  });

  registerResolver('myWorkers', async vars => {
    const owners = ((vars.ownerIds as string[] | undefined) ?? []).map(s => s.toLowerCase());
    const bond = await readBondAmount(deps.client, deps.deployments.NETWORK_CONTROLLER);
    const seen = new Set<bigint>();
    const list: Record<string, unknown>[] = [];
    for (const owner of owners) {
      const ids = await readOwnedWorkers(
        deps.client,
        deps.deployments.WORKER_REGISTRATION,
        owner as Address,
      );
      for (const id of ids) {
        if (seen.has(id)) continue;
        seen.add(id);
        const projected = await projectWorker(deps, id, bond, 20n);
        if (projected) list.push(projected);
      }
    }
    return { workers: list };
  });

  registerResolver('myWorkersCount', async vars => {
    const owners = ((vars.ownerIds as string[] | undefined) ?? []).map(s => s.toLowerCase());
    const seen = new Set<bigint>();
    for (const owner of owners) {
      const ids = await readOwnedWorkers(
        deps.client,
        deps.deployments.WORKER_REGISTRATION,
        owner as Address,
      );
      for (const id of ids) seen.add(id);
    }
    return { workersConnection: { totalCount: seen.size } };
  });

  registerResolver('workerDelegationInfo', async vars => {
    const wid = BigInt(vars.workerId as string);
    const w = await readWorker(deps.client, deps.deployments.WORKER_REGISTRATION, wid);
    if (!w) return { workerById: null, settings: [] };
    const total = await readDelegated(deps.client, deps.deployments.STAKING, wid);
    const bond = await readBondAmount(deps.client, deps.deployments.NETWORK_CONTROLLER);
    const cap = bond * 20n;
    const capedDelegation = total > cap ? cap : total;
    return {
      workerById: {
        bond: w.bond.toString(),
        totalDelegation: total.toString(),
        capedDelegation: capedDelegation.toString(),
        liveness: 0.99,
        dTenure: 0.95,
        trafficWeight: 0.85,
      },
      settings: [{ utilizedStake: '60000000000000000000000000', baseApr: 0.15 }],
    };
  });

  registerResolver('workersByOwner', async vars => {
    const owners = ((vars.ownerIds as string[] | undefined) ?? []).map(s => s.toLowerCase());
    const list: Record<string, unknown>[] = [];
    for (const owner of owners) {
      const ids = await readOwnedWorkers(
        deps.client,
        deps.deployments.WORKER_REGISTRATION,
        owner as Address,
      );
      for (const id of ids) {
        const w = await readWorker(deps.client, deps.deployments.WORKER_REGISTRATION, id);
        if (!w) continue;
        list.push({
          id: String(id),
          name: parseWorkerName(w.metadata, `Worker ${id}`),
          peerId: bytesToBase58(w.peerId),
          ownerId: w.creator.toLowerCase(),
          bond: w.bond.toString(),
          claimableReward: '0',
        });
      }
    }
    return { workers: list };
  });

  registerResolver('myDelegations', async vars => {
    const owners = ((vars.ownerIds as string[] | undefined) ?? []).map(s => s.toLowerCase());
    const peerIdFilter = vars.peerId as string | undefined;

    // Resolve peerId → workerId for filtering, mirroring the production
    // `peerId_eq` filter in the myDelegations GraphQL query.
    let workerIdFilter: bigint | undefined;
    if (peerIdFilter) {
      try {
        const peerHex = toHex(bs58.decode(peerIdFilter));
        const wid = (await deps.client.readContract({
          abi: workerRegAbi(),
          address: deps.deployments.WORKER_REGISTRATION,
          functionName: 'workerIds',
          args: [peerHex],
        })) as bigint;
        if (wid !== 0n) workerIdFilter = wid;
      } catch {
        // ignore peerId filter on error — fall back to returning all delegations
      }
    }

    const bond = await readBondAmount(deps.client, deps.deployments.NETWORK_CONTROLLER);
    const stakerRewardsByWorker = await readPerWorkerStakerRewards(
      deps.client,
      deps.deployments.REWARD_DISTRIBUTION,
    );
    const seen = new Set<string>(); // workerId-ownerCSV — combine to dedupe per-spec
    const list: Record<string, unknown>[] = [];
    for (const owner of owners) {
      const ids = await readDelegates(deps.client, deps.deployments.STAKING, owner as Address);
      for (const id of ids) {
        if (workerIdFilter !== undefined && id !== workerIdFilter) continue;
        const key = `${id}:${owner}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const projected = await projectWorker(deps, id, bond, 20n, [owner], stakerRewardsByWorker);
        if (projected) list.push(projected);
      }
    }
    return { workers: list };
  });

  registerResolver('delegationsByOwner', async vars => {
    const owners = ((vars.ownerIds as string[] | undefined) ?? []).map(s => s.toLowerCase());
    const stakerRewardsByWorker = await readPerWorkerStakerRewards(
      deps.client,
      deps.deployments.REWARD_DISTRIBUTION,
    );
    const list: Record<string, unknown>[] = [];
    for (const owner of owners) {
      const ids = await readDelegates(deps.client, deps.deployments.STAKING, owner as Address);
      for (const id of ids) {
        const { depositAmount } = await readDeposit(
          deps.client,
          deps.deployments.STAKING,
          owner as Address,
          id,
        );
        if (depositAmount === 0n) continue;
        const totalStakerReward = stakerRewardsByWorker.get(id) ?? 0n;
        const totalStaked = await readDelegated(deps.client, deps.deployments.STAKING, id);
        const claimable =
          totalStakerReward > 0n && totalStaked > 0n
            ? (totalStakerReward * depositAmount) / totalStaked
            : 0n;
        list.push({
          id: `delegation-${id}-${owner}`,
          ownerId: owner,
          deposit: depositAmount.toString(),
          claimableReward: claimable.toString(),
          claimedReward: '0',
          locked: false,
          lockEnd: null,
        });
      }
    }
    return { delegations: list };
  });
}

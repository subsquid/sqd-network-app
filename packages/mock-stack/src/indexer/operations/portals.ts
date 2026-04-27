/**
 * Read-through resolvers for portal-pool data.
 *
 * The indexer's slim registry tells us which pool addresses exist (via
 * PortalPoolFactory.PoolCreated). Every other field is read on demand via
 * `Pool.getPoolInfo()`, `Pool.getActiveStake()`, `Pool.getProviderStake(addr)`,
 * `Pool.getRewardToken()`. No cached entity store, no projection layer.
 */
import type { Abi, Address, PublicClient } from 'viem';

import { portalArtifact } from '../../artifacts';
import { type Resolver, registerResolver } from '../dispatcher';
import type { IndexerRegistry } from '../registry';

export interface PortalsResolverDeps {
  client: PublicClient;
  registry: IndexerRegistry;
  blockTimestamp(block: bigint): string;
}

interface PoolInfo {
  operator: `0x${string}`;
  capacity: bigint;
  totalStaked: bigint;
  depositDeadline: bigint;
  activationTime: bigint;
  state: number;
  paused: boolean;
  firstActivated: boolean;
}

// Lazy ABI load — see workers.ts for rationale (forge artefacts may not
// exist yet at module-import time when the chain process hasn't run
// autoPrepare).
let _portalPoolAbi: Abi | undefined;
function portalPoolAbi(): Abi {
  return (_portalPoolAbi ??= portalArtifact('PortalPoolImplementation').abi);
}

async function readPoolInfo(client: PublicClient, pool: Address): Promise<PoolInfo | null> {
  try {
    return (await client.readContract({
      abi: portalPoolAbi(),
      address: pool,
      functionName: 'getPoolInfo',
    })) as PoolInfo;
  } catch {
    return null;
  }
}

async function readActiveStake(client: PublicClient, pool: Address): Promise<bigint> {
  try {
    return (await client.readContract({
      abi: portalPoolAbi(),
      address: pool,
      functionName: 'getActiveStake',
    })) as bigint;
  } catch {
    return 0n;
  }
}

async function readProviderStake(
  client: PublicClient,
  pool: Address,
  provider: Address,
): Promise<bigint> {
  try {
    return (await client.readContract({
      abi: portalPoolAbi(),
      address: pool,
      functionName: 'getProviderStake',
      args: [provider],
    })) as bigint;
  } catch {
    return 0n;
  }
}

async function readRewardToken(client: PublicClient, pool: Address): Promise<string> {
  try {
    const addr = (await client.readContract({
      abi: portalPoolAbi(),
      address: pool,
      functionName: 'getRewardToken',
    })) as Address;
    return addr.toLowerCase();
  } catch {
    return '0x0000000000000000000000000000000000000000';
  }
}

async function projectPool(
  deps: PortalsResolverDeps,
  poolId: string,
): Promise<Record<string, unknown> | null> {
  const info = await readPoolInfo(deps.client, poolId as Address);
  if (!info) return null;
  const activeStake = await readActiveStake(deps.client, poolId as Address);
  const rewardToken = await readRewardToken(deps.client, poolId as Address);
  const createdAtBlock = deps.registry.portalPoolCreatedAt.get(poolId) ?? 0n;
  return {
    id: poolId,
    operatorId: info.operator.toLowerCase(),
    rewardToken,
    capacity: info.capacity.toString(),
    rewardRate: '0', // not exposed via view; UI tolerates string-zero
    totalRewardsToppedUp: '0',
    tvlStable: activeStake.toString(),
    tvlTotal: activeStake.toString(),
    closedAt: null,
    closedAtBlock: null,
    createdAt: deps.blockTimestamp(createdAtBlock),
    createdAtBlock: Number(createdAtBlock),
    metadata: '',
    tokenSuffix: '',
  };
}

export function registerPortalResolvers(deps: PortalsResolverDeps): void {
  const portalPools: Resolver = async vars => {
    const limit = Number(vars.limit ?? 50);
    const offset = Number(vars.offset ?? 0);
    const ids = [...deps.registry.portalPools].sort((a, b) => {
      const ba = deps.registry.portalPoolCreatedAt.get(a) ?? 0n;
      const bb = deps.registry.portalPoolCreatedAt.get(b) ?? 0n;
      return Number(bb - ba);
    });
    const slice = ids.slice(offset, offset + limit);
    const list: Record<string, unknown>[] = [];
    for (const id of slice) {
      const projected = await projectPool(deps, id);
      if (projected) list.push(projected);
    }
    return { portalPools: list };
  };
  registerResolver('portalPools', portalPools);

  registerResolver('portalPoolById', async vars => {
    const id = (vars.id as string | undefined)?.toLowerCase();
    if (!id || !deps.registry.portalPools.has(id)) {
      return { portalPoolById: null };
    }
    return { portalPoolById: await projectPool(deps, id) };
  });

  registerResolver('poolProvidersByOwner', async vars => {
    const owners = ((vars.ownerIds as string[] | undefined) ?? []).map(s => s.toLowerCase());
    const list: Record<string, unknown>[] = [];
    for (const poolId of deps.registry.portalPools) {
      for (const owner of owners) {
        const stake = await readProviderStake(deps.client, poolId as Address, owner as Address);
        if (stake === 0n) continue;
        list.push({
          id: `${poolId}:${owner}`,
          deposited: stake.toString(),
          providerId: owner,
          poolId,
        });
      }
    }
    return { poolProviders: list };
  });

  // Per-deposit event timeline isn't reproducible from view functions and
  // the UI's recent-activity list is purely cosmetic in mock mode.
  registerResolver('poolEvents', () => ({
    poolEvents: [],
    poolEventsConnection: { totalCount: 0 },
  }));
  registerResolver('poolEventsConnection', () => ({
    poolEventsConnection: { totalCount: 0 },
  }));

  registerResolver('gatewaysSummary', async () => {
    let tvl = 0n;
    for (const poolId of deps.registry.portalPools) {
      tvl += await readActiveStake(deps.client, poolId as Address);
    }
    return {
      gatewaysSummary: {
        totalGateways: 0,
        totalGatewayStake: '0',
        totalPortalPoolTvl: tvl.toString(),
      },
    };
  });
}

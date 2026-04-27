/**
 * Mini-indexer runtime — slim version.
 *
 * Subscribes to two factory events (`PortalPoolFactory.PoolCreated`,
 * `VestingFactory.VestingCreated`) and maintains a small address registry.
 * Every other piece of data the resolvers need is read through to the chain
 * via `viem.readContract`, keyed off these enumerated addresses + the
 * contracts' own view functions (`getActiveWorkerIds`, `Staking.delegates`,
 * `Pool.getPoolInfo`, etc.).
 *
 * Public surface:
 *   - resetAndReplay() / waitUntilCaughtUp() / lastBlock for test setup
 *   - registry: the only state the indexer keeps in memory
 */
import { type Abi, type Address, type PublicClient, createPublicClient, http } from 'viem';

import { networkArtifact, portalArtifact } from '../artifacts';
import type { AddressMap } from '../deployments';
import { applyPortalFactoryLog } from './mappings/portalFactory';
import { applyVestingFactoryLog } from './mappings/vestingFactory';
import { type IndexerRegistry, clearRegistry, createRegistry } from './registry';

export interface IndexerRuntime {
  readonly registry: IndexerRegistry;
  resetAndReplay(): Promise<void>;
  waitUntilCaughtUp(): Promise<void>;
  readonly lastBlock: number;
  stop(): void;
}

export interface StartIndexerOpts {
  rpcUrl: string;
  deployments: AddressMap;
  pollIntervalMs?: number;
}

interface LogSource {
  address: Address;
  abi: Abi;
  apply: (
    registry: IndexerRegistry,
    abi: Abi,
    log: Parameters<typeof applyPortalFactoryLog>[2],
  ) => void;
}

export function startIndexer(opts: StartIndexerOpts): IndexerRuntime {
  const client: PublicClient = createPublicClient({ transport: http(opts.rpcUrl) });
  const pollMs = opts.pollIntervalMs ?? 100;
  const registry = createRegistry();
  let lastBlock = 0;
  let cursor = 0n;
  let stopped = false;
  let inFlight: Promise<void> | null = null;

  const sources: LogSource[] = [];
  if (opts.deployments.PORTAL_POOL_FACTORY) {
    sources.push({
      address: opts.deployments.PORTAL_POOL_FACTORY,
      abi: portalArtifact('PortalPoolFactory').abi,
      apply: applyPortalFactoryLog,
    });
  }
  if (opts.deployments.VESTING_FACTORY) {
    sources.push({
      address: opts.deployments.VESTING_FACTORY,
      abi: networkArtifact('VestingFactory').abi,
      apply: applyVestingFactoryLog,
    });
  }

  async function ingest(fromBlock: bigint, toBlock: bigint): Promise<void> {
    if (sources.length === 0) return;
    for (const source of sources) {
      const logs = await client.getLogs({
        address: source.address,
        fromBlock,
        toBlock,
      });
      for (const log of logs) {
        source.apply(registry, source.abi, log);
      }
    }
  }

  async function bootstrap(): Promise<void> {
    const head = await client.getBlockNumber();
    if (sources.length > 0) await ingest(0n, head);
    cursor = head + 1n;
    lastBlock = Number(head);
  }

  async function tick(): Promise<void> {
    if (stopped) return;
    try {
      const head = await client.getBlockNumber();
      if (head >= cursor) {
        await ingest(cursor, head);
        cursor = head + 1n;
        const newBlock = Number(head);
        if (newBlock > lastBlock) {
          // biome-ignore lint/suspicious/noConsole: block-mined progress indicator
          console.log(`[mock-stack] block #${newBlock}`);
        }
        lastBlock = newBlock;
      }
    } catch {
      // ignore — anvil may be temporarily unavailable
    }
    if (!stopped) {
      setTimeout(() => {
        inFlight = tick();
      }, pollMs);
    }
  }

  inFlight = bootstrap().then(() => {
    if (!stopped) tick();
  });

  return {
    registry,
    get lastBlock() {
      return lastBlock;
    },
    async resetAndReplay() {
      clearRegistry(registry);
      cursor = 0n;
      await bootstrap();
    },
    async waitUntilCaughtUp() {
      const target = Number(await client.getBlockNumber());
      if (inFlight) await inFlight;
      const deadline = Date.now() + 5_000;
      while (lastBlock < target && Date.now() < deadline) {
        await new Promise(resolve => setTimeout(resolve, pollMs));
      }
      if (lastBlock < target) {
        throw new Error(
          `[mock-stack] indexer.waitUntilCaughtUp: target=${target}, lastBlock=${lastBlock}`,
        );
      }
    },
    stop() {
      stopped = true;
    },
  };
}

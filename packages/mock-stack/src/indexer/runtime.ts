/**
 * Mini-indexer runtime — subscribes to logs from the network contracts and
 * projects them into entities consumed by the chain-derived resolvers.
 *
 * Phase 7 shipped only the lastBlock barrier; this iteration adds:
 *   1. **Bootstrap**: `getLogs(fromBlock=0, toBlock='latest', address=[…])`,
 *      apply mappings.
 *   2. **Tail**: every `pollIntervalMs` ms, fetch logs since the last
 *      processed block, apply mappings, advance the cursor.
 *   3. `resetAndReplay()` clears the entity store and re-runs bootstrap.
 *   4. `waitUntilCaughtUp()` resolves once the indexer has consumed up to
 *      the latest chain block.
 */
import { type Abi, type Address, http, type PublicClient, createPublicClient } from 'viem';

import { networkArtifact } from '../artifacts';
import type { AddressMap } from '../deployments';

import { clearEntities, createEntityStore, type EntityStore } from './entities';
import { applyStakingLog } from './mappings/staking';
import { applyWorkerRegistrationLog } from './mappings/workerRegistration';

export interface IndexerRuntime {
  readonly store: EntityStore;
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
  apply: (store: EntityStore, abi: Abi, log: Parameters<typeof applyStakingLog>[2]) => void;
}

export function startIndexer(opts: StartIndexerOpts): IndexerRuntime {
  const client: PublicClient = createPublicClient({ transport: http(opts.rpcUrl) });
  const pollMs = opts.pollIntervalMs ?? 100;
  const store = createEntityStore();
  let lastBlock = 0;
  let cursor = 0n;
  let stopped = false;
  let inFlight: Promise<void> | null = null;

  // Build the list of log sources only for addresses present in `.deployments.json`.
  // If a contract isn't deployed (e.g. portal-contracts skipped), simply
  // don't subscribe — its events were never going to fire.
  const sources: LogSource[] = [];
  if (opts.deployments.WORKER_REGISTRATION) {
    sources.push({
      address: opts.deployments.WORKER_REGISTRATION,
      abi: networkArtifact('WorkerRegistration').abi,
      apply: applyWorkerRegistrationLog,
    });
  }
  if (opts.deployments.STAKING) {
    sources.push({
      address: opts.deployments.STAKING,
      abi: networkArtifact('Staking').abi,
      apply: applyStakingLog,
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
        source.apply(store, source.abi, log);
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
        lastBlock = Number(head);
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

  // Eagerly bootstrap so the resetAndReplay()/waitUntilCaughtUp() callers
  // don't race with an empty store.
  inFlight = bootstrap().then(() => {
    if (!stopped) tick();
  });

  return {
    store,
    get lastBlock() {
      return lastBlock;
    },
    async resetAndReplay() {
      clearEntities(store);
      cursor = 0n;
      await bootstrap();
    },
    async waitUntilCaughtUp() {
      const target = Number(await client.getBlockNumber());
      // Make sure the in-flight bootstrap (if any) has completed before we
      // observe lastBlock.
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

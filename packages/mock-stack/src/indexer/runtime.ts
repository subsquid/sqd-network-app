/**
 * Mini-indexer runtime — log subscription + entity store + control surface.
 *
 * Phase 7 ships the **control surface** (resetAndReplay, waitUntilCaughtUp,
 * lastBlock) backed by a viem `getBlockNumber()` poll. The actual log → entity
 * projections live behind the synthetic-fallback dispatcher today; per-operation
 * chain-derived overrides land in follow-up commits as Phase 8 specs need them.
 *
 * The control surface is non-trivial even now: tests use it as a barrier
 * (e.g. `expect.poll(() => indexer.lastBlock).toBeGreaterThan(...)` after a
 * write, before asserting against indexer-served data).
 */
import { type PublicClient, createPublicClient, http } from 'viem';

export interface IndexerRuntime {
  resetAndReplay(): Promise<void>;
  waitUntilCaughtUp(): Promise<void>;
  readonly lastBlock: number;
  /** Stop background polling. Idempotent. */
  stop(): void;
}

export interface StartIndexerOpts {
  rpcUrl: string;
  /** Poll interval for `lastBlock` updates (ms). Default 100. */
  pollIntervalMs?: number;
}

export function startIndexer(opts: StartIndexerOpts): IndexerRuntime {
  const client: PublicClient = createPublicClient({ transport: http(opts.rpcUrl) });
  const pollMs = opts.pollIntervalMs ?? 100;
  let lastBlock = 0;
  let stopped = false;

  // Poll lastBlock so consumers can observe progress without forcing a
  // synchronous RPC round-trip on every read.
  const tick = async () => {
    if (stopped) return;
    try {
      const n = await client.getBlockNumber();
      if (Number(n) > lastBlock) lastBlock = Number(n);
    } catch {
      // ignore — anvil may be temporarily unavailable during tests
    }
    if (!stopped) setTimeout(tick, pollMs);
  };
  void tick();

  return {
    get lastBlock() {
      return lastBlock;
    },
    async resetAndReplay() {
      // Phase 7 stub: no entity store yet, so nothing to clear. The barrier
      // semantics (lastBlock observation) remain useful.
      await this.waitUntilCaughtUp();
    },
    async waitUntilCaughtUp() {
      const target = Number(await client.getBlockNumber());
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

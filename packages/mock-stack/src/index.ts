/**
 * Public entrypoint of `@subsquid/mock-stack`.
 *
 * The single owner of the mock environment lifecycle. Every consumer —
 * Vitest globalSetup, future Playwright globalSetup, and the `pnpm dev`
 * mock mode — calls `startMockStack()` and never instantiates anvil /
 * the mini-indexer / the deploy harness directly.
 */
import fs from 'node:fs';
import path from 'node:path';

import { type Address, createPublicClient, http } from 'viem';

import { packageRoot } from './artifacts';
import { type AnvilHandle, spawnAnvil } from './chain';
import { chainFor, loadAnvilState } from './deploy';
import { type AddressMap, readDeployments } from './deployments';
import { clearResolvers } from './indexer/dispatcher';
import type { EntityStore } from './indexer/entities';
import { registerNetworkResolvers } from './indexer/operations/network';
import { registerTokenResolvers } from './indexer/operations/token';
import { registerWorkerResolvers } from './indexer/operations/workers';
import { startIndexer } from './indexer/runtime';
import { type MockGraphqlServer, startGraphqlServer } from './indexer/server';

export type { AddressMap };

export type { Resolver, ResolverContext } from './indexer/dispatcher';
export { clearResolvers, dispatch, registerResolver } from './indexer/dispatcher';
export type {
  DelegationEntity,
  EntityStore,
  VestingEntity,
  WorkerEntity,
} from './indexer/entities';
export { delegationKey } from './indexer/entities';

export interface MockStackHandle {
  /** URL of the anvil JSON-RPC endpoint. */
  rpcUrl: string;
  /** URL of the mini-indexer's GraphQL HTTP endpoint. */
  graphqlUrl: string;
  /** Map of contract name → deployed address (mirror of `.deployments.json`). */
  deployments: AddressMap;
  indexer: {
    resetAndReplay(): Promise<void>;
    waitUntilCaughtUp(): Promise<void>;
    readonly lastBlock: number;
    readonly store: EntityStore;
  };
  stop(): Promise<void>;
}

export interface StartMockStackOpts {
  /**
   * Path to the anvil dump-state file produced by
   * `pnpm --filter @subsquid/mock-stack stack:prepare`.
   * Defaults to `<package-root>/.anvil-state.json`.
   * Set explicitly to `null` to start with a fresh chain (no prior state load).
   */
  stateFile?: string | null;
  /**
   * Anvil RPC port. Default `0` — ephemeral, picked by the OS. Pass an
   * explicit port (e.g. 8545) for `pnpm dev` mock mode where the client
   * vite config points at a fixed URL.
   */
  rpcPort?: number;
  /** GraphQL HTTP port. Default `0` — ephemeral. */
  graphqlPort?: number;
  /** Chain id (default 42161 / arbitrum mainnet — matches mainnet build). */
  chainId?: number;
  /**
   * If true, run `stack:prepare` automatically when no state file is found.
   * Useful for tests so a fresh checkout works without a manual setup step.
   * Defaults to false (the default state file path is checked first).
   */
  autoPrepare?: boolean;
}

/**
 * Boot the full mock environment.
 *
 * Order:
 *   1. Read `.deployments.json` so we know which addresses to advertise.
 *   2. Spawn anvil.
 *   3. Load the dumped state (if available) into anvil via `anvil_loadState`.
 *   4. Start the GraphQL HTTP server (operation-name dispatcher).
 *   5. Start the indexer runtime (lastBlock polling).
 *
 * The stop() function tears down everything in reverse.
 */
export async function startMockStack(opts: StartMockStackOpts = {}): Promise<MockStackHandle> {
  const rpcPort = opts.rpcPort ?? 0;
  const graphqlPort = opts.graphqlPort ?? 0;
  const chainId = opts.chainId ?? 42161;
  const stateFile =
    opts.stateFile === null
      ? null
      : (opts.stateFile ?? path.resolve(packageRoot(), '.anvil-state.json'));

  // Auto-prepare: if the state file doesn't exist and the caller opted in,
  // run the deploy harness in-process. Keeps the test setup contract to a
  // single command (`pnpm test`) on a fresh checkout — no manual prepare step.
  if (opts.autoPrepare && stateFile && !fileExists(stateFile)) {
    const { runPrepare } = await import('./prepare');
    await runPrepare();
  }

  const deployments = readDeployments() ?? {};

  let anvil: AnvilHandle | undefined;
  let graphql: MockGraphqlServer | undefined;
  let indexer: ReturnType<typeof startIndexer> | undefined;
  try {
    anvil = await spawnAnvil({ port: rpcPort, chainId });

    if (stateFile) {
      try {
        await loadAnvilState(anvil.url, stateFile);
      } catch (err) {
        // biome-ignore lint/suspicious/noConsole: warn-and-continue path
        console.warn(
          `[mock-stack] could not load state from ${stateFile}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    }

    graphql = await startGraphqlServer({ port: graphqlPort });
    indexer = startIndexer({ rpcUrl: anvil.url, deployments });
    await indexer.waitUntilCaughtUp();

    // Register chain-derived resolvers. Wipe any previously-registered
    // resolvers so a hot-restart inside the same process picks up the new
    // entity store without leaking stale closures.
    clearResolvers();
    const publicClient = createPublicClient({
      chain: chainFor(chainId),
      transport: http(anvil.url),
    });
    const blockTimestampNow = (block: bigint): string => {
      const head = indexer!.lastBlock;
      const ageBlocks = Math.max(0, head - Number(block));
      return new Date(Date.now() - ageBlocks * 12_000).toISOString();
    };
    registerWorkerResolvers({
      store: indexer.store,
      client: publicClient,
      deployments,
      blockTimestamp: blockTimestampNow,
    });
    registerNetworkResolvers({
      client: publicClient,
      deployments,
      getLastBlock: () => indexer!.lastBlock,
    });
    registerTokenResolvers({
      client: publicClient,
      deployments,
      store: indexer.store,
    });
  } catch (err) {
    // Tear down anything we managed to start before re-throwing.
    indexer?.stop();
    if (graphql) await graphql.stop();
    if (anvil) await anvil.stop();
    throw err;
  }

  const handle: MockStackHandle = {
    rpcUrl: anvil.url,
    graphqlUrl: graphql.url,
    deployments,
    indexer: {
      get lastBlock() {
        return indexer!.lastBlock;
      },
      get store() {
        return indexer!.store;
      },
      resetAndReplay: () => indexer!.resetAndReplay(),
      waitUntilCaughtUp: () => indexer!.waitUntilCaughtUp(),
    },
    async stop() {
      indexer?.stop();
      if (graphql) await graphql.stop();
      if (anvil) await anvil.stop();
    },
  };
  return handle;
}

function fileExists(p: string): boolean {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

// Re-export selected helpers so consumers don't need to reach into subpaths.
export type { Address };

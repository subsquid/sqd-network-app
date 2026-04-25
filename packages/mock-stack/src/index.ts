/**
 * Public entrypoint of `@subsquid/mock-stack`.
 *
 * The single owner of the mock environment lifecycle. Every consumer —
 * Vitest globalSetup, future Playwright globalSetup, and the `pnpm dev`
 * mock mode — calls `startMockStack()` and never instantiates anvil /
 * the mini-indexer / the deploy harness directly.
 */
import path from 'node:path';

import type { Address } from 'viem';

import { packageRoot } from './artifacts';
import { type AnvilHandle, spawnAnvil } from './chain';
import { loadAnvilState } from './deploy';
import { type AddressMap, readDeployments } from './deployments';
import { startIndexer } from './indexer/runtime';
import { type MockGraphqlServer, startGraphqlServer } from './indexer/server';

export type { AddressMap };

export type { Resolver, ResolverContext } from './indexer/dispatcher';
export { clearResolvers, dispatch, registerResolver } from './indexer/dispatcher';

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
  /** Override the anvil RPC port (default 8545). */
  rpcPort?: number;
  /** Override the GraphQL HTTP port (default 4321). */
  graphqlPort?: number;
  /** Chain id (default 42161 / arbitrum mainnet — matches mainnet build). */
  chainId?: number;
}

const DEFAULT_RPC_PORT = 8545;
const DEFAULT_GRAPHQL_PORT = 4321;

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
  const rpcPort = opts.rpcPort ?? DEFAULT_RPC_PORT;
  const graphqlPort = opts.graphqlPort ?? DEFAULT_GRAPHQL_PORT;
  const chainId = opts.chainId ?? 42161;
  const stateFile =
    opts.stateFile === null
      ? null
      : (opts.stateFile ?? path.resolve(packageRoot(), '.anvil-state.json'));

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
    indexer = startIndexer({ rpcUrl: anvil.url });
    await indexer.waitUntilCaughtUp();
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

// Re-export selected helpers so consumers don't need to reach into subpaths.
export type { Address };

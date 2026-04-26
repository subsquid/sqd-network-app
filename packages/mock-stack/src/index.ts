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

import { type ArbitrumShimHandle, startArbitrumShim } from './arbitrumShim';
import { packageRoot } from './artifacts';
import { type AnvilHandle, spawnAnvil } from './chain';
import { chainFor, loadAnvilState } from './deploy';
import { type AddressMap, readDeployments } from './deployments';
import { clearResolvers } from './indexer/dispatcher';
import { registerNetworkResolvers } from './indexer/operations/network';
import { registerPortalResolvers } from './indexer/operations/portals';
import { registerTokenResolvers } from './indexer/operations/token';
import { registerWorkerResolvers } from './indexer/operations/workers';
import type { IndexerRegistry } from './indexer/registry';
import { startIndexer } from './indexer/runtime';
import { type MockGraphqlServer, startGraphqlServer } from './indexer/server';

export type { AddressMap };

export type { Resolver, ResolverContext } from './indexer/dispatcher';
export { clearResolvers, dispatch, registerResolver } from './indexer/dispatcher';
export type { IndexerRegistry } from './indexer/registry';

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
    /** Slim address registry. The only state the indexer keeps in memory. */
    readonly registry: IndexerRegistry;
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
   */
  autoPrepare?: boolean;
  /**
   * Interval mining: mine a new block every N seconds. Default is instant
   * mining (a block per transaction). Pass `12` to mimic Arbitrum block cadence.
   */
  blockTime?: number;
  /**
   * Attach to an already-running chain at this URL instead of spawning anvil.
   * Useful for `tsx watch` dev mode: the chain keeps running across hot reloads.
   * When set, `rpcPort`, `blockTime`, `stateFile`, and `autoPrepare` are ignored.
   */
  externalRpcUrl?: string;
}

export async function startMockStack(opts: StartMockStackOpts = {}): Promise<MockStackHandle> {
  const graphqlPort = opts.graphqlPort ?? 0;
  const chainId = opts.chainId ?? 42161;
  const externalRpcUrl = opts.externalRpcUrl;

  // Chain is either spawned fresh or reused from an already-running process.
  let chainRpcUrl: string;
  let anvil: AnvilHandle | undefined;
  let shim: ArbitrumShimHandle | undefined;

  if (!externalRpcUrl) {
    const rpcPort = opts.rpcPort ?? 0;
    const stateFile =
      opts.stateFile === null
        ? null
        : (opts.stateFile ?? path.resolve(packageRoot(), '.anvil-state.json'));

    if (opts.autoPrepare && stateFile && !fileExists(stateFile)) {
      const { runPrepare } = await import('./prepare');
      await runPrepare();
    }

    // Anvil binds an ephemeral OS-allocated port; the Arbitrum shim then
    // listens on the caller-requested port (e.g. 8545 in `pnpm mock:chain`)
    // and forwards JSON-RPC traffic to anvil while patching block responses
    // to inject `l1BlockNumber := number`. From the consumer's POV this
    // looks like a real Arbitrum nitro RPC.
    anvil = await spawnAnvil({ port: 0, chainId, blockTime: opts.blockTime });
    shim = await startArbitrumShim({ upstreamUrl: anvil.url, port: rpcPort });
    chainRpcUrl = anvil.url;

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
  } else {
    chainRpcUrl = externalRpcUrl;
  }

  const deployments = readDeployments() ?? {};

  let graphql: MockGraphqlServer | undefined;
  let indexer: ReturnType<typeof startIndexer> | undefined;
  try {
    graphql = await startGraphqlServer({ port: graphqlPort });
    indexer = startIndexer({ rpcUrl: chainRpcUrl, deployments });
    await indexer.waitUntilCaughtUp();

    clearResolvers();
    const publicClient = createPublicClient({
      chain: chainFor(chainId),
      transport: http(chainRpcUrl),
    });
    const blockTimestampNow = (block: bigint): string => {
      const head = indexer!.lastBlock;
      const ageBlocks = Math.max(0, head - Number(block));
      return new Date(Date.now() - ageBlocks * 12_000).toISOString();
    };
    registerWorkerResolvers({
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
      registry: indexer.registry,
    });
    registerPortalResolvers({
      client: publicClient,
      registry: indexer.registry,
      blockTimestamp: blockTimestampNow,
    });
  } catch (err) {
    indexer?.stop();
    if (graphql) await graphql.stop();
    if (!externalRpcUrl) {
      if (shim) await shim.stop();
      if (anvil) await anvil.stop();
    }
    throw err;
  }

  const handle: MockStackHandle = {
    rpcUrl: externalRpcUrl ?? shim!.url,
    graphqlUrl: graphql!.url,
    deployments,
    indexer: {
      get lastBlock() {
        return indexer!.lastBlock;
      },
      get registry() {
        return indexer!.registry;
      },
      resetAndReplay: () => indexer!.resetAndReplay(),
      waitUntilCaughtUp: () => indexer!.waitUntilCaughtUp(),
    },
    async stop() {
      indexer?.stop();
      if (graphql) await graphql.stop();
      // Only tear down the chain when we own it.
      if (!externalRpcUrl) {
        if (shim) await shim.stop();
        if (anvil) await anvil.stop();
      }
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

export type { Address };

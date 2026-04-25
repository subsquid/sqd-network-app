/**
 * Vitest globalSetup for the `integration` project.
 *
 * Boots the mock stack (anvil + GraphQL fixture server) plus an in-process
 * tRPC server so layer-2 specs render the real app and observe real reads.
 *
 * Workflow:
 *   1. Spawn anvil + GraphQL via `startMockStack()` — single source of truth
 *      for chain + indexer state.
 *   2. Set the env vars consumed by `@subsquid/server` so its modules read
 *      from the mock stack instead of mainnet/Squid endpoints.
 *   3. Boot the tRPC HTTP server on a free port and stash its base URL on
 *      `globalThis.__INTEGRATION_TRPC_URL__` so individual specs can wire
 *      their tRPC client to it.
 *   4. Tear everything down in reverse on test-suite exit.
 *
 * Vitest invokes the default-exported function once per project. The
 * returned function (or async function) is called for teardown.
 */
import http from 'node:http';
import path from 'node:path';
import url from 'node:url';

// Avoid pulling @subsquid/mock-stack into the unit tests' bundle by importing
// it dynamically — this file is only resolved by the `integration` project.
import type { MockStackHandle } from '@subsquid/mock-stack';

// Brings `ProvidedContext` augmentations into scope.
import './types';

/**
 * Vitest's globalSetup invokes the default export with a project-context
 * argument that exposes a typed `provide()`. Vitest 4 does not export the
 * type alias for this argument under any stable name, so we declare a minimal
 * structural interface here — only `provide()` is consumed.
 */
interface GlobalSetupCtx {
  provide<K extends keyof import('vitest').ProvidedContext>(
    key: K,
    value: import('vitest').ProvidedContext[K],
  ): void;
}

let stack: MockStackHandle | undefined;
let trpcServer: http.Server | undefined;

export default async function setup(ctx: GlobalSetupCtx): Promise<() => Promise<void>> {
  const { startMockStack } = await import('@subsquid/mock-stack');

  // Resolve the .anvil-state.json deterministically — the package root sits
  // two levels up from this file regardless of cwd.
  const here = url.fileURLToPath(import.meta.url);
  const mockStackRoot = path.resolve(here, '../../../../../mock-stack');
  const stateFile = path.resolve(mockStackRoot, '.anvil-state.json');

  // Pick high ports so we don't collide with any dev server the user might
  // already have running (8545 / 4321 are the defaults).
  const rpcPort = 18_545;
  const graphqlPort = 14_321;

  stack = await startMockStack({
    stateFile,
    rpcPort,
    graphqlPort,
  });

  // Configure the server package's env so its routers read from the mock
  // stack. These must be set BEFORE we import the appRouter for the env
  // module to capture them.
  process.env.MOCK_WALLET = 'true';
  process.env.MOCK_GRAPHQL = 'true';
  process.env.MOCK_GRAPHQL_PORT = String(graphqlPort);
  process.env.MOCK_STACK_DEPLOYMENTS = path.resolve(mockStackRoot, '.deployments.json');
  process.env.RPC_URL = stack.rpcUrl;
  process.env.NETWORK = process.env.NETWORK ?? 'mainnet';

  const trpcUrl = await startInProcessTrpc();

  // Vitest workers run in separate processes; share values through `provide()`
  // (consumed via `inject()` inside tests).
  ctx.provide('trpcUrl', trpcUrl);
  ctx.provide('rpcUrl', stack.rpcUrl);
  ctx.provide('graphqlUrl', stack.graphqlUrl);
  ctx.provide('deployments', stack.deployments);

  return async () => {
    if (trpcServer) {
      await new Promise<void>(resolve => trpcServer!.close(() => resolve()));
    }
    if (stack) await stack.stop();
  };
}

/**
 * Boot the real tRPC HTTP server in-process on an ephemeral port.
 * Returns the base URL (without trailing slash) usable as the tRPC client's
 * `httpBatchLink({ url })`.
 */
async function startInProcessTrpc(): Promise<string> {
  const { createHTTPServer } = await import('@trpc/server/adapters/standalone');
  const { appRouter } = await import('@subsquid/server/router');
  const { createContext } = await import('@subsquid/server/trpc');

  const server = createHTTPServer({
    router: appRouter as never,
    createContext: createContext as never,
  });

  const port = await new Promise<number>((resolve, reject) => {
    server.listen(0, '127.0.0.1');
    server.once('listening', () => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') {
        reject(new Error('tRPC server listen produced no port'));
        return;
      }
      resolve(addr.port);
    });
    server.once('error', reject);
  });

  trpcServer = server as unknown as http.Server;
  return `http://127.0.0.1:${port}`;
}

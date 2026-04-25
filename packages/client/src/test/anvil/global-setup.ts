/**
 * Vitest globalSetup for the `integration` project.
 *
 * Boots:
 *   - Anvil (pre-loaded with `.anvil-state.json`)
 *   - Mini-indexer GraphQL HTTP server
 *   - In-process tRPC HTTP server, configured via `setRuntimeOverride()` so
 *     no `process.env.*` mutation or pseudo-env vars leak into test code.
 *
 * Everything runs on **ephemeral OS-allocated ports** — concurrent runs and
 * rerun loops can't collide. The auto-prepare flag means a fresh checkout
 * runs `pnpm test` without any manual setup step (Foundry must still be
 * installed for the integration project).
 *
 * Vitest invokes the default-exported function once per project. The
 * returned function is called for teardown.
 */
import http from 'node:http';

import type { MockStackHandle } from '@subsquid/mock-stack';

// Brings `ProvidedContext` augmentations into scope.
import './types';

/**
 * Vitest 4 doesn't export the globalSetup context type alias. Declare a
 * minimal structural interface — only `provide()` is consumed.
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

  // autoPrepare: regenerate the anvil snapshot if it's missing. Removes the
  // need for a separate `pnpm --filter @subsquid/mock-stack stack:prepare`
  // step on a fresh checkout.
  stack = await startMockStack({ autoPrepare: true });

  // Configure the server's runtime: tests use a single mock GraphQL endpoint
  // for all three squids, the anvil instance for RPC, and the mock-stack
  // address book for contract resolution. No env vars, no MOCK_* flags.
  const { setRuntimeOverride } = await import('@subsquid/server/env');
  setRuntimeOverride({
    network: 'mainnet',
    mockMode: true,
    squidGraphqlUrl: stack.graphqlUrl,
    rpcUrl: stack.rpcUrl,
    contractAddressOverride: stack.deployments,
  });

  const trpcUrl = await startInProcessTrpc();

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
 * Boot the real tRPC HTTP server in-process on an ephemeral port (port 0).
 * Returns the base URL usable as `httpLink({ url })` / `httpBatchLink`.
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

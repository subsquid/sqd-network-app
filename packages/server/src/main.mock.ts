/**
 * Entrypoint for `pnpm mock`.
 *
 * Boots the full mock-stack (anvil + deploy harness + log-driven
 * mini-indexer + GraphQL HTTP server pinned to 4321), then injects the
 * resulting URLs + deployed addresses into the server's runtime override
 * and starts the regular tRPC HTTP server via `main.ts`.
 *
 * No env-var indirection: setRuntimeOverride() reaches the same getters
 * the live `main.ts` consumes, so all of the GraphQL + RPC + contract-
 * address resolution lines up without flag plumbing.
 */
import { startMockStack } from '@subsquid/mock-stack';

import { setRuntimeOverride } from './env.js';

const stack = await startMockStack({
  autoPrepare: true,
  rpcPort: 8545,
  graphqlPort: 4321,
});

setRuntimeOverride({
  network: 'mainnet',
  squidGraphqlUrl: stack.graphqlUrl,
  rpcUrl: stack.rpcUrl,
  contractAddressOverride: stack.deployments,
});

const shutdown = async () => {
  await stack.stop();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// biome-ignore lint/suspicious/noConsole: startup diagnostic
console.log(
  `[mock] anvil=${stack.rpcUrl} graphql=${stack.graphqlUrl} ` +
    `deployments=${Object.keys(stack.deployments).length}`,
);

// Hand off to the regular startup. main.ts reads getXxxSquidUrl() etc.
// which now return the override values instead of process.env.
await import('./main.js');

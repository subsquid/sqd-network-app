/**
 * Entrypoint for `pnpm mock`.
 *
 * Boots the full mock-stack (anvil + deploy harness + mini-indexer + GraphQL
 * HTTP server pinned to 4321), then injects the resulting URLs + deployed
 * addresses into the server's runtime override and starts the regular
 * tRPC HTTP server via `main.ts`.
 *
 * No env-var indirection: setRuntimeOverride() reaches the same getters
 * the live `main.ts` consumes, so all of the GraphQL + RPC + contract-
 * address resolution lines up without flag plumbing.
 *
 * Up-front guard rails:
 *   - Verifies `forge` and `anvil` are on PATH before doing anything; if
 *     not, prints an actionable Foundry-install hint instead of letting
 *     the deploy harness fail with a cryptic "Failed running" tsx error.
 *   - Surfaces stack-bootstrap errors with full context.
 */
import { spawnSync } from 'node:child_process';

import { startMockStack } from '@subsquid/mock-stack';

import { setRuntimeOverride } from './env.js';

function ensureFoundryInstalled(): void {
  for (const bin of ['forge', 'anvil']) {
    const result = spawnSync(bin, ['--version'], { stdio: 'ignore' });
    if (result.status !== 0) {
      // biome-ignore lint/suspicious/noConsole: actionable startup diagnostic
      console.error(
        `\n[mock] \`${bin}\` not found on PATH.\n` +
          '\n' +
          'Foundry is required for `pnpm mock`. Install with:\n' +
          '  curl -L https://foundry.paradigm.xyz | bash\n' +
          '  exec $SHELL\n' +
          '  foundryup\n' +
          '\n' +
          'See https://book.getfoundry.sh/getting-started/installation\n',
      );
      process.exit(1);
    }
  }
}

ensureFoundryInstalled();

let stack: Awaited<ReturnType<typeof startMockStack>>;
try {
  stack = await startMockStack({
    autoPrepare: true,
    rpcPort: 8545,
    graphqlPort: 4321,
  });
} catch (err) {
  // biome-ignore lint/suspicious/noConsole: surface the real failure
  console.error(
    `\n[mock] failed to boot the mock stack: ${
      err instanceof Error ? err.message : String(err)
    }\n` +
      '\n' +
      'Common causes:\n' +
      '  - A previous `pnpm mock` is still running on port 8545 or 4321.\n' +
      '    Kill it (Ctrl+C in that terminal) and try again.\n' +
      '  - Foundry is installed but `forge build` failed in one of the\n' +
      '    contract submodules. Run `git submodule update --init --recursive`\n' +
      '    and `forge build` manually inside packages/mock-stack/ to see\n' +
      '    the actual compiler error.\n',
  );
  if (err instanceof Error && err.stack) {
    // biome-ignore lint/suspicious/noConsole: full stack helps when the hint isn't enough
    console.error(err.stack);
  }
  process.exit(1);
}

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

/**
 * Indexer + GraphQL layer — spawned by serve.ts via `tsx watch`.
 *
 * Attaches to the already-running chain at :8545 and exposes the
 * mini-indexer GraphQL HTTP server at :4321.
 *
 * Not intended to be run directly; use `pnpm mock:chain` instead.
 */
import { startMockStack } from '../src';
import { GRAPHQL_PORT, RPC_PORT } from '../src/config';

const CHAIN_URL = `http://localhost:${RPC_PORT}`;

let stack: Awaited<ReturnType<typeof startMockStack>>;
try {
  stack = await startMockStack({
    externalRpcUrl: CHAIN_URL,
    graphqlPort: GRAPHQL_PORT,
  });
} catch (err) {
  // biome-ignore lint/suspicious/noConsole: surface the real failure
  console.error(
    `\n[mock-stack] failed to start indexer: ${
      err instanceof Error ? err.message : String(err)
    }\n\n` +
      'Make sure the chain is running first:\n' +
      '  pnpm mock:chain\n',
  );
  process.exit(1);
}

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  // biome-ignore lint/suspicious/noConsole: shutdown indicator
  console.log(`\n[mock-stack] received ${signal}, stopping indexer…`);
  await stack.stop();
  process.exit(0);
};
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

// biome-ignore lint/suspicious/noConsole: status banner
console.log(
  `\n[mock-stack] indexer is ready\n` +
    `  chain:   ${CHAIN_URL}\n` +
    `  graphql: ${stack.graphqlUrl}\n`,
);

setInterval(() => {}, 60_000);

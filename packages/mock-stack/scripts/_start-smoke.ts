/**
 * Smoke test of startMockStack().
 *
 *   pnpm --filter @subsquid/mock-stack tsx scripts/_start-smoke.ts
 *
 * Boots the stack, hits the GraphQL endpoint with a known operation, prints
 * the response, then tears down. Underscore-prefixed so it's not wired to
 * any Turbo task.
 */
import { startMockStack } from '../src';

async function main() {
  // biome-ignore lint/suspicious/noConsole: smoke output
  console.log('[smoke] starting mock stack...');
  const handle = await startMockStack();
  try {
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('[smoke] rpc:', handle.rpcUrl);
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('[smoke] graphql:', handle.graphqlUrl);
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('[smoke] deployments:', handle.deployments);

    // Hit a known operation.
    const res = await fetch(handle.graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operationName: 'allWorkers',
        variables: {},
      }),
    });
    const json = (await res.json()) as { data: { workers: unknown[] } };
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('[smoke] allWorkers count:', json.data.workers.length);
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('[smoke] indexer.lastBlock:', handle.indexer.lastBlock);
  } finally {
    await handle.stop();
  }
}

void main().catch(err => {
  // biome-ignore lint/suspicious/noConsole: error path
  console.error(err);
  process.exit(1);
});

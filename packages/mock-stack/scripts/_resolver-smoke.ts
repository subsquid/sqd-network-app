/**
 * Smoke test for chain-derived resolvers — ensures workers / delegations
 * round-trip through the dispatcher and look like real on-chain state.
 */
import { startMockStack } from '../src';

async function main() {
  const handle = await startMockStack({ autoPrepare: true });
  try {
    const ops = ['allWorkers', 'myWorkers', 'myDelegations', 'sources', 'settings'];
    for (const op of ops) {
      const variables: Record<string, unknown> =
        op === 'myWorkers' || op === 'workersByOwner'
          ? { ownerIds: ['0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'] }
          : op === 'myDelegations' || op === 'delegationsByOwner'
            ? { ownerIds: ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8'] }
            : op === 'sources' || op === 'accountsByOwner'
              ? { address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' }
              : {};
      const res = await fetch(handle.graphqlUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName: op, variables }),
      });
      const json = (await res.json()) as { data: unknown };
      // biome-ignore lint/suspicious/noConsole: smoke output
      console.log(`\n=== ${op} ===`);
      // biome-ignore lint/suspicious/noConsole: smoke output
      console.log(JSON.stringify(json.data, null, 2).slice(0, 800));
    }
  } finally {
    await handle.stop();
  }
}

void main().catch(err => {
  // biome-ignore lint/suspicious/noConsole: error path
  console.error(err);
  process.exit(1);
});

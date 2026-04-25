/**
 * Manual smoke test of the indexer + entity store.
 * Run with `pnpm --filter @subsquid/mock-stack tsx scripts/_indexer-smoke.ts`.
 */
import { startMockStack } from '../src';

async function main() {
  const handle = await startMockStack({ autoPrepare: true });
  try {
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('lastBlock:', handle.indexer.lastBlock);
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('workers:', handle.indexer.store.workers.size);
    for (const [id, w] of handle.indexer.store.workers) {
      // biome-ignore lint/suspicious/noConsole: smoke output
      console.log(`  worker ${id}: peerId=${w.peerId.slice(0, 18)}… owner=${w.ownerId}`);
    }
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('delegations:', handle.indexer.store.delegations.size);
    for (const [k, d] of handle.indexer.store.delegations) {
      // biome-ignore lint/suspicious/noConsole: smoke output
      console.log(`  ${k}: deposit=${d.deposit}`);
    }
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('vestings:', handle.indexer.store.vestings.size);
    for (const [id, v] of handle.indexer.store.vestings) {
      // biome-ignore lint/suspicious/noConsole: smoke output
      console.log(
        `  ${id}: beneficiary=${v.beneficiaryId} expectedTotal=${v.expectedTotalAmount}`,
      );
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

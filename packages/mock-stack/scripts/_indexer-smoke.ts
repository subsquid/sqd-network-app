/**
 * Manual smoke test of the indexer registry — confirms the slim
 * enumeration sets (portal pools, vesting contracts) populate after
 * `pnpm --filter @subsquid/mock-stack stack:prepare`. Worker /
 * delegation data is read through to the chain on demand and isn't
 * tracked by the indexer.
 *
 *   pnpm --filter @subsquid/mock-stack tsx scripts/_indexer-smoke.ts
 */
import { startMockStack } from '../src';

async function main() {
  const handle = await startMockStack({ autoPrepare: true });
  try {
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('lastBlock:', handle.indexer.lastBlock);
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('portal pools:', handle.indexer.registry.portalPools.size);
    for (const id of handle.indexer.registry.portalPools) {
      const block = handle.indexer.registry.portalPoolCreatedAt.get(id);
      // biome-ignore lint/suspicious/noConsole: smoke output
      console.log(`  ${id} (createdAt=${block})`);
    }
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('vestings:', handle.indexer.registry.vestings.size);
    for (const [id, beneficiary] of handle.indexer.registry.vestings) {
      // biome-ignore lint/suspicious/noConsole: smoke output
      console.log(`  ${id}: beneficiary=${beneficiary}`);
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

/**
 * Smoke test for dump → load round-trip. Not a Vitest spec; run manually
 * after `pnpm --filter @subsquid/mock-stack stack:prepare` to confirm a
 * fresh anvil + loadAnvilState() produces the same chain state.
 *
 *   pnpm --filter @subsquid/mock-stack tsx scripts/_round-trip-smoke.ts
 *
 * Underscore-prefixed so it doesn't get accidentally wired into a Turbo task.
 */
import { createPublicClient, http } from 'viem';

import { spawnAnvil } from '../src/chain';
import { loadAnvilState } from '../src/deploy';
import { readDeployments } from '../src/deployments';

async function main() {
  const anvil = await spawnAnvil({ port: 8549 });
  try {
    await loadAnvilState(anvil.url, '/workspace/packages/mock-stack/.anvil-state.json');
    const client = createPublicClient({ transport: http(anvil.url) });
    const bob = await client.getBalance({
      address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    });
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('Bob ETH:', bob.toString());
    const deployments = readDeployments();
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('Deployments:', deployments);
    if (!deployments) throw new Error('no deployments');
    const code = await client.getCode({ address: deployments.SQD });
    // biome-ignore lint/suspicious/noConsole: smoke output
    console.log('SQD bytecode length:', code?.length);
  } finally {
    await anvil.stop();
  }
}

void main().catch(err => {
  // biome-ignore lint/suspicious/noConsole: error path
  console.error(err);
  process.exit(1);
});

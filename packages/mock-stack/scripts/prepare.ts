/**
 * Entrypoint for the `mock-stack#stack:prepare` Turbo task.
 *
 * Steps:
 *   1. Spawn anvil at the configured port.
 *   2. Run the TS deploy harness against it.
 *   3. Dump anvil state to `.anvil-state.json`.
 *   4. Persist deployed addresses to `.deployments.json`.
 *   5. Kill anvil.
 */
import path from 'node:path';

import { packageRoot } from '../src/artifacts';
import { spawnAnvil } from '../src/chain';
import { dumpAnvilState, runDeploy } from '../src/deploy';
import { writeDeployments } from '../src/deployments';

async function main(): Promise<void> {
  const port = Number(process.env.MOCK_RPC_PORT ?? 8545);
  const chainId = Number(process.env.MOCK_CHAIN_ID ?? 42161);
  const stateFile = path.resolve(packageRoot(), '.anvil-state.json');

  // biome-ignore lint/suspicious/noConsole: progress
  console.log(`[mock-stack] spawning anvil on :${port} chainId=${chainId}`);
  const anvil = await spawnAnvil({ port, chainId });

  try {
    const result = await runDeploy({ rpcUrl: anvil.url, chainId });
    writeDeployments(result.deployments);
    // biome-ignore lint/suspicious/noConsole: progress
    console.log(`[mock-stack] dumping anvil state to ${stateFile}`);
    await dumpAnvilState(anvil.url, stateFile);
    // biome-ignore lint/suspicious/noConsole: success summary
    console.log(
      `[mock-stack] prepare complete — bootBlock=${result.bootBlock}, ${
        Object.keys(result.deployments).length
      } contracts deployed`,
    );
  } finally {
    await anvil.stop();
  }
}

main().catch(err => {
  // biome-ignore lint/suspicious/noConsole: surfaced as task error
  console.error('[mock-stack] prepare failed:', err);
  process.exit(1);
});

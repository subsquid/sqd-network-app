/**
 * Long-lived mock environment for `pnpm mock:chain`.
 *
 * Runs two processes under a single terminal:
 *   1. Chain   — anvil + Arbitrum shim at :8545 (inline, stable)
 *   2. Indexer — mini-indexer + GraphQL at :4321 via `tsx watch` (restarts on
 *                source changes without touching the chain)
 *
 * Auto-prepares (.anvil-state.json + .deployments.json + forge artefacts)
 * if anything is missing.
 *
 * The companion `pnpm mock:app` runs the client + tRPC server; all pieces
 * can be restarted independently.
 */
import fs from 'node:fs';
import path from 'node:path';
import { type ChildProcess, spawn, spawnSync } from 'node:child_process';

import { startArbitrumShim } from '../src/arbitrumShim';
import { packageRoot } from '../src/artifacts';
import { spawnAnvil } from '../src/chain';
import { BLOCK_TIME_SEC, CHAIN_ID, RPC_PORT } from '../src/config';
import { loadAnvilState } from '../src/deploy';
import { runPrepare } from '../src/prepare';

const STATE_FILE = path.resolve(packageRoot(), '.anvil-state.json');
const INDEXER_SCRIPT = path.resolve(import.meta.dirname, '_indexer.ts');

function ensureFoundryInstalled(): void {
  for (const bin of ['forge', 'anvil']) {
    const result = spawnSync(bin, ['--version'], { stdio: 'ignore' });
    if (result.status !== 0) {
      // biome-ignore lint/suspicious/noConsole: actionable startup diagnostic
      console.error(
        `\n[mock-stack] \`${bin}\` not found on PATH.\n\n` +
          'Foundry is required for `pnpm mock:chain`. Install with:\n' +
          '  curl -L https://foundry.paradigm.xyz | bash\n' +
          '  exec $SHELL\n' +
          '  foundryup\n\n' +
          'See https://book.getfoundry.sh/getting-started/installation\n',
      );
      process.exit(1);
    }
  }
}

ensureFoundryInstalled();

if (!fs.existsSync(STATE_FILE)) {
  // biome-ignore lint/suspicious/noConsole: progress indicator
  console.log('[mock-stack] state file missing — running stack:prepare…');
  await runPrepare();
}

let anvil: Awaited<ReturnType<typeof spawnAnvil>>;
let shim: Awaited<ReturnType<typeof startArbitrumShim>>;
try {
  anvil = await spawnAnvil({ port: 0, chainId: CHAIN_ID, blockTime: BLOCK_TIME_SEC });
  shim = await startArbitrumShim({ upstreamUrl: anvil.url, port: RPC_PORT });
  await loadAnvilState(anvil.url, STATE_FILE);
} catch (err) {
  // biome-ignore lint/suspicious/noConsole: surface the real failure
  console.error(
    `\n[mock-stack] failed to boot the chain: ${
      err instanceof Error ? err.message : String(err)
    }\n\n` +
      'Common causes:\n' +
      `  - A previous \`pnpm mock:chain\` is still running on port ${RPC_PORT}.\n` +
      `    Kill it (Ctrl+C in that terminal, or \`lsof -i:${RPC_PORT}\`) and try again.\n` +
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

// biome-ignore lint/suspicious/noConsole: status banner
console.log(`\n[mock-stack] chain ready at ${shim.url}\n`);

// Spawn the indexer under tsx watch so resolver / indexer changes hot-reload
// without touching the chain.
const tsxBin = path.resolve(import.meta.dirname, '../node_modules/.bin/tsx');
const indexer: ChildProcess = spawn(tsxBin, ['watch', INDEXER_SCRIPT], {
  stdio: 'inherit',
  env: process.env,
});

indexer.on('error', err => {
  // biome-ignore lint/suspicious/noConsole: surface child-process spawn errors
  console.error(`[mock-stack] indexer spawn error: ${err.message}`);
});

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  // biome-ignore lint/suspicious/noConsole: shutdown indicator
  console.log(`\n[mock-stack] received ${signal}, shutting down…`);
  if (indexer.exitCode === null) indexer.kill('SIGTERM');
  await shim.stop();
  await anvil.stop();
  process.exit(0);
};
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

setInterval(() => {}, 60_000);

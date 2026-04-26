/**
 * Long-lived chain process for `pnpm mock:chain`.
 *
 * Boots the mock-stack — anvil at :8545 + the mini-indexer GraphQL HTTP
 * server at :4321 — and stays alive. Auto-prepares (.anvil-state.json +
 * .deployments.json + forge artefacts) if anything is missing.
 *
 * The companion `pnpm mock:app` runs the client + tRPC server pointed at
 * these fixed URLs; the two halves can be restarted independently. App
 * code can hot-reload freely without tearing down the chain.
 *
 * Up-front Foundry guard so the failure mode is "actionable error +
 * exit 1" rather than tsx swallowing the spawn error.
 */
import { spawnSync } from 'node:child_process';

import { startMockStack } from '../src';

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

let stack: Awaited<ReturnType<typeof startMockStack>>;
try {
  stack = await startMockStack({
    autoPrepare: true,
    rpcPort: 8545,
    graphqlPort: 4321,
    blockTime: 12,
  });
} catch (err) {
  // biome-ignore lint/suspicious/noConsole: surface the real failure
  console.error(
    `\n[mock-stack] failed to boot the chain: ${
      err instanceof Error ? err.message : String(err)
    }\n\n` +
      'Common causes:\n' +
      '  - A previous `pnpm mock:chain` is still running on port 8545 or 4321.\n' +
      '    Kill it (Ctrl+C in that terminal, or `lsof -i:8545`) and try again.\n' +
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

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  // biome-ignore lint/suspicious/noConsole: shutdown indicator
  console.log(`\n[mock-stack] received ${signal}, stopping chain…`);
  await stack.stop();
  process.exit(0);
};
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

// biome-ignore lint/suspicious/noConsole: status banner
console.log(
  `\n[mock-stack] chain is ready\n` +
    `  anvil:    ${stack.rpcUrl}\n` +
    `  graphql:  ${stack.graphqlUrl}\n` +
    `  contracts: ${Object.keys(stack.deployments).length} deployed\n` +
    `\nKeep this process running. Start the app with \`pnpm mock:app\` in another terminal.\n`,
);

// Keep the process alive until SIGINT/SIGTERM. The indexer's tail-loop
// setTimeout already holds the loop open, but a heartbeat interval makes
// the intent explicit and survives if the indexer ever stops scheduling.
setInterval(() => {
  // intentional no-op — keeps the process up
}, 60_000);

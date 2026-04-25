/**
 * Entrypoint for the `mock-stack#stack:prepare` Turbo task.
 *
 * Delegates to `runPrepare()` (in `src/prepare.ts`) so the same code path
 * is reused when `startMockStack({ autoPrepare: true })` re-prepares the
 * snapshot in-process.
 */
import { runPrepare } from '../src/prepare';

async function main(): Promise<void> {
  // biome-ignore lint/suspicious/noConsole: progress
  console.log('[mock-stack] preparing anvil snapshot (ephemeral port)');
  const result = await runPrepare();
  // biome-ignore lint/suspicious/noConsole: success summary
  console.log(
    `[mock-stack] prepare complete — bootBlock=${result.bootBlock}, ${
      Object.keys(result.deployments).length
    } contracts deployed → ${result.stateFile}`,
  );
}

main().catch(err => {
  // biome-ignore lint/suspicious/noConsole: surfaced as task error
  console.error('[mock-stack] prepare failed:', err);
  process.exit(1);
});

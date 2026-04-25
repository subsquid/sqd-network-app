/**
 * Entrypoint for the `mock-stack#prepare` Turbo task.
 *
 * Steps (Phases 5–6):
 *   1. Spawn anvil at the configured port.
 *   2. Run the TS deploy harness against it (`src/deploy.ts`).
 *      - Deploys mock + network + portal contracts.
 *      - Seeds persona state.
 *   3. Dump anvil state to `.anvil-state.json`.
 *   4. Persist deployed addresses to `.deployments.json`.
 *   5. Kill anvil.
 *
 * Phase 4: this file exists so the Turbo task is wired correctly. The body is
 * a clear-error stub. Once Phase 6 lands, the real implementation replaces it.
 */

async function main(): Promise<void> {
  // biome-ignore lint/suspicious/noConsole: surfaced as the prepare task output
  console.error(
    '[mock-stack] prepare: not implemented yet (pending Phases 5–6 of the rollout).',
  );
  // biome-ignore lint/suspicious/noConsole: instructional output
  console.error(
    '[mock-stack] See plans/wagmi-viem-testing.md and packages/mock-stack/src/index.ts.',
  );
  process.exit(1);
}

void main();

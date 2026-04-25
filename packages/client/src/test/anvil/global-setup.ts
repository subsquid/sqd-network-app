/**
 * Vitest globalSetup for the `integration` project.
 *
 * In Phase 8 this will spawn anvil + the mini-indexer + an in-process tRPC server
 * via `startMockStack()` from `@subsquid/mock-stack` and store the handle on
 * `globalThis`. For now (Phase 1 scaffold) this is a no-op so `pnpm test` runs
 * cleanly even without any integration specs in the tree.
 */
export default async function setup(): Promise<() => Promise<void>> {
  // Phase 8 will replace this with the real bootstrap.
  return async () => {
    // teardown
  };
}

/**
 * Per-test setup file applied only to the `integration` project.
 *
 * In Phase 8 this will:
 *   - revert the shared Anvil instance to the base snapshot
 *   - clear the React Query cache
 *   - reset and replay the mini-indexer
 *   - take a fresh snapshot for the next test
 *
 * For Phase 1 it's a placeholder that imports cleanly.
 */
import { beforeEach } from 'vitest';

beforeEach(async () => {
  // Phase 8: testClient.revert(baseSnapshot) + indexer.resetAndReplay() etc.
});

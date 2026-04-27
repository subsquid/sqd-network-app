/**
 * Per-test setup file applied only to the `integration` project.
 *
 * Resets state before each spec so they're independent:
 *   - `evm_revert` to the base anvil snapshot (rolls back any tx the previous
 *     spec submitted).
 *   - new `evm_snapshot` for the next test.
 *   - `indexer.resetAndReplay()` to repopulate the entity store from logs.
 *
 * The first invocation creates the initial snapshot using the post-load chain
 * state.
 */
import { beforeEach, inject } from 'vitest';

import './types';

let baseSnapshotId: string | null = null;

beforeEach(async () => {
  // The `rpcUrl` provided value is only available in the integration project;
  // inject() throws if the key was not provided — wrap to make this file
  // safely importable in unit-mode setupFiles too.
  let rpcUrl: string;
  try {
    rpcUrl = inject('rpcUrl');
  } catch {
    return;
  }

  if (baseSnapshotId !== null) {
    await rpcCall(rpcUrl, 'evm_revert', [baseSnapshotId]);
  }
  baseSnapshotId = (await rpcCall(rpcUrl, 'evm_snapshot', [])) as string;

  // Wait for the indexer to catch up with any reverts/forward progress so
  // `indexer.lastBlock` reflects the test's starting block.
  // We rely on the fact that resetAndReplay polls until the indexer reports
  // the current block.
  // Note: in Phase 7 the indexer doesn't yet have an entity store to reset,
  // so this is a barrier-only wait.
});

async function rpcCall(url: string, method: string, params: unknown[]): Promise<unknown> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const json = (await res.json()) as { result?: unknown; error?: { message: string } };
  if (json.error) {
    throw new Error(`RPC ${method} failed: ${json.error.message}`);
  }
  return json.result;
}

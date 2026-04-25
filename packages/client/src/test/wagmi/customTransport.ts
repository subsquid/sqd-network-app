import { type Transport, custom } from 'viem';

/**
 * Map of JSON-RPC method names to canned response producers.
 *
 * Each handler receives the `params` array as the wagmi/viem caller would send,
 * and must return the raw RPC result (already in hex / appropriate shape) — the
 * helper does not encode anything.
 */
export type CannedRpcMap = Record<string, (params: readonly unknown[]) => unknown>;

/**
 * Build a viem `custom` transport that responds to a fixed set of methods.
 *
 * Used by Layer-1 hook tests so we can assert against deterministic responses
 * without spawning Anvil or any HTTP server.
 *
 * Unhandled methods throw a clear error so the test surface stays small —
 * if a hook reaches for an RPC method we didn't anticipate, the spec fails
 * with the method name visible in the stack trace.
 */
export function makeCannedTransport(map: CannedRpcMap): Transport {
  return custom({
    request: async ({ method, params }) => {
      const handler = map[method];
      if (!handler) {
        throw new Error(`Unmocked RPC method in test transport: ${method}`);
      }
      return handler((params as readonly unknown[] | undefined) ?? []);
    },
  });
}

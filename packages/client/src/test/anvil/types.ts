/**
 * Type declarations for Vitest's `inject()` helper, populated by
 * `global-setup.ts` via `ctx.provide(key, value)`.
 *
 * Importing this file from any spec brings the augmentation into scope.
 */
import 'vitest';

declare module 'vitest' {
  export interface ProvidedContext {
    /** Base URL of the in-process tRPC server (no trailing slash). */
    trpcUrl: string;
    /** Anvil JSON-RPC URL. */
    rpcUrl: string;
    /** Mini-indexer GraphQL URL. */
    graphqlUrl: string;
    /** Map of contract name → deployed address. */
    deployments: Record<string, string>;
  }
}

/**
 * Operation-name dispatcher for the mini-indexer.
 *
 * Mirrors the contract that `packages/server/src/services/mockGraphqlServer.ts`
 * exposes today: HTTP POST `/graphql` with body `{ operationName, variables }`
 * → JSON `{ data }`.
 *
 * The dispatcher consults registered resolvers in the following order:
 *   1. **Custom resolvers** registered via `registerResolver()` — used by
 *      the log-driven entity store (Phase 7+) to override synthetic data
 *      with chain-derived results for a given operation.
 *   2. **Synthetic fallback** in `synthetic.ts` — covers all 41 operations
 *      from `packages/server/graphql/*.graphql` so the dev mock stack
 *      stays functional throughout the rollout.
 *   3. **Empty data** when no resolver matches — preserves the legacy
 *      server's behaviour of returning `{}` rather than 404-ing the
 *      operation. A diagnostic warning is logged so missing operations
 *      surface during development.
 */
import { resolveSynthetic } from './synthetic';

export type Resolver = (variables: Record<string, unknown>, ctx: ResolverContext) => unknown;

export interface ResolverContext {
  operationName: string;
}

const customResolvers = new Map<string, Resolver>();

export function registerResolver(operationName: string, resolver: Resolver): void {
  customResolvers.set(operationName, resolver);
}

export function clearResolvers(): void {
  customResolvers.clear();
}

export function dispatch(operationName: string, variables: Record<string, unknown>): unknown {
  const ctx: ResolverContext = { operationName };
  const custom = customResolvers.get(operationName);
  if (custom) return custom(variables, ctx);
  const synthetic = resolveSynthetic(operationName, variables);
  if (synthetic !== null) return synthetic;
  // biome-ignore lint/suspicious/noConsole: dev diagnostic for missing operations
  console.warn(`[mock-stack] dispatcher: unknown operation "${operationName}" — returning {}`);
  return {};
}

/**
 * Public entrypoint of `@subsquid/mock-stack`.
 *
 * This is the **single owner** of the mock environment lifecycle. Every
 * consumer — Vitest globalSetup, future Playwright globalSetup, and the
 * `pnpm dev` mock mode — calls `startMockStack()` and never instantiates
 * anvil / the mini-indexer / the deploy harness directly.
 *
 * Phases 5–7 fill this in:
 *   - Phase 5: ship local mock contracts and produce `out/` artifacts.
 *   - Phase 6: TS deploy harness writes `.deployments.json` + `.anvil-state.json`.
 *   - Phase 7: log-driven mini-indexer + HTTP server with the operation-name
 *     dispatcher contract `mockGraphqlServer.ts` exposes today.
 *
 * For now the entrypoint exists, types are stable, and the stub throws — so
 * consumers can wire imports without forcing the indexer to be ready first.
 */
import type { Address } from 'viem';

export type AddressMap = Record<string, Address>;

export interface MockStackHandle {
  /** URL of the in-process anvil instance. */
  rpcUrl: string;
  /** URL of the mini-indexer's GraphQL HTTP endpoint. */
  graphqlUrl: string;
  /** Map of contract name → deployed address (mirror of `.deployments.json`). */
  deployments: AddressMap;
  /**
   * Mini-indexer control surface used by per-test setup hooks.
   *
   * `resetAndReplay` clears the entity store and re-fetches logs from genesis.
   * `waitUntilCaughtUp` resolves once `getLogs` has caught up to the current
   * block — used as a barrier before assertions to keep tests deterministic.
   */
  indexer: {
    resetAndReplay(): Promise<void>;
    waitUntilCaughtUp(): Promise<void>;
    readonly lastBlock: number;
  };
  /** Tear down anvil + indexer + servers. Must be idempotent. */
  stop(): Promise<void>;
}

export interface StartMockStackOpts {
  /**
   * Path to the anvil dump-state file produced by `pnpm --filter @subsquid/mock-stack prepare`.
   * Defaults to `<package-root>/.anvil-state.json` resolved relative to this module.
   */
  stateFile?: string;
  /** Override the mock RPC port (default: 8545). */
  rpcPort?: number;
  /** Override the mini-indexer GraphQL port (default: 4321). */
  graphqlPort?: number;
}

/**
 * Boot the full mock environment: anvil pre-loaded with deployed contracts,
 * the mini-indexer subscribing to logs, and the HTTP server replicating the
 * operation-name dispatcher contract from `mockGraphqlServer.ts`.
 *
 * **Phase 4 stub:** throws so dev mode falls back to the legacy
 * `mockRpcServer.ts` / `mockGraphqlServer.ts` until Phases 5–7 implement
 * the real bootstrap. Layer-2 integration tests (Phase 8) will fail with a
 * clear error if invoked before then — by design.
 */
export function startMockStack(_opts: StartMockStackOpts = {}): Promise<MockStackHandle> {
  return Promise.reject(
    new Error(
      'startMockStack() not implemented yet — pending phases 5–7 of the mock-stack rollout. ' +
        'See plans/wagmi-viem-testing.md.',
    ),
  );
}

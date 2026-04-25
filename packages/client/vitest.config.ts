import path from 'node:path';

import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * Bare-minimum `process.env.*` substitutions so the production-mode
 * `process.env.X` accesses scattered through the client bundle don't
 * crash inside tests. Tests **don't** use these for behaviour control —
 * mock mode is signalled via wagmi config in unit tests and via the
 * server's `setRuntimeOverride()` in integration tests.
 */
const TEST_DEFINES = Object.fromEntries(
  Object.entries({
    APP_VERSION: 'test',
    NETWORK: 'mainnet',
    WALLET_CONNECT_PROJECT_ID: '',
    SENTRY_DSN: '',
    ENABLE_DEMO_FEATURES: 'false',
    HOST_URL: '',
    TESTNET_WORKERS_CHAT_URL: '',
    MAINNET_WORKERS_CHAT_URL: '',
    // MOCK_WALLET stays falsy in unit tests — they configure the mock
    // connector directly via `createUnitWagmiConfig()` and never read this.
    MOCK_WALLET: '',
    MOCK_RPC_URL: 'http://localhost:8545',
  }).map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)]),
);

/**
 * Vitest config for @subsquid/client.
 *
 * - `unit`        — fast, parallel, jsdom; canned viem transports + wagmi
 *                  mock connector. No process.env reads, no Anvil.
 * - `integration` — single-fork, jsdom; backed by Anvil + mini-indexer +
 *                  in-process tRPC server (all spawned on ephemeral ports
 *                  by `src/test/anvil/global-setup.ts`).
 */
export default defineConfig({
  test: {
    // Allow projects to pass with zero specs (e.g. before the first
    // integration test lands in a feature branch).
    passWithNoTests: true,
    projects: [
      {
        plugins: [tsconfigPaths(), react()],
        define: TEST_DEFINES,
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: [
            'src/**/*.integration.test.{ts,tsx}',
            'node_modules/**',
            'build/**',
            'dist/**',
          ],
          setupFiles: [path.resolve(dirname, './src/test/setup.ts')],
          pool: 'threads',
        },
      },
      {
        plugins: [tsconfigPaths(), react()],
        define: TEST_DEFINES,
        test: {
          name: 'integration',
          environment: 'jsdom',
          globals: true,
          include: ['src/**/*.integration.test.{ts,tsx}'],
          exclude: ['node_modules/**', 'build/**', 'dist/**'],
          setupFiles: [
            path.resolve(dirname, './src/test/setup.ts'),
            path.resolve(dirname, './src/test/anvil/snapshot.ts'),
          ],
          globalSetup: [path.resolve(dirname, './src/test/anvil/global-setup.ts')],
          pool: 'forks',
          // Run all integration specs in a single forked process so they
          // share one Anvil instance + mini-indexer.
          forks: { singleFork: true },
          testTimeout: 30_000,
          hookTimeout: 60_000,
        },
      },
    ],
  },
});

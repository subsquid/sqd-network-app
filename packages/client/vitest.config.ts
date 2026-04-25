import path from 'node:path';

import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * Vitest config for @subsquid/client.
 *
 * Two projects:
 * - `unit`        — fast, parallel, jsdom; canned viem transports + wagmi mock connector.
 *                  Globs all `*.test.{ts,tsx}` except `*.integration.test.*`.
 * - `integration` — single-fork, jsdom; backed by Anvil + mini-indexer + tRPC server
 *                  (wired up in Phase 8). Globs `*.integration.test.{ts,tsx}`.
 */
export default defineConfig({
  test: {
    // Allow the integration project to pass while it has zero specs (added incrementally
    // as Phase 8 lands) — saves needing a placeholder spec just to satisfy the runner.
    passWithNoTests: true,
    projects: [
      {
        plugins: [tsconfigPaths(), react()],
        define: {
          // Mirror the bare-minimum subset of vite.config.ts `define` block so that
          // production-mode `process.env.*` accesses don't crash inside tests.
          'process.env.MOCK_WALLET': JSON.stringify(''),
          'process.env.MOCK_RPC_URL': JSON.stringify('http://localhost:8545'),
          'process.env.NETWORK': JSON.stringify('mainnet'),
          'process.env.WALLET_CONNECT_PROJECT_ID': JSON.stringify(''),
          'process.env.SENTRY_DSN': JSON.stringify(''),
          'process.env.APP_VERSION': JSON.stringify('test'),
          'process.env.ENABLE_DEMO_FEATURES': JSON.stringify('false'),
          'process.env.HOST_URL': JSON.stringify(''),
          'process.env.TESTNET_WORKERS_CHAT_URL': JSON.stringify(''),
          'process.env.MAINNET_WORKERS_CHAT_URL': JSON.stringify(''),
        },
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
        define: {
          'process.env.MOCK_WALLET': JSON.stringify('true'),
          'process.env.MOCK_RPC_URL': JSON.stringify('http://localhost:8545'),
          'process.env.NETWORK': JSON.stringify('mainnet'),
          'process.env.WALLET_CONNECT_PROJECT_ID': JSON.stringify(''),
          'process.env.SENTRY_DSN': JSON.stringify(''),
          'process.env.APP_VERSION': JSON.stringify('test'),
          'process.env.ENABLE_DEMO_FEATURES': JSON.stringify('false'),
          'process.env.HOST_URL': JSON.stringify(''),
          'process.env.TESTNET_WORKERS_CHAT_URL': JSON.stringify(''),
          'process.env.MAINNET_WORKERS_CHAT_URL': JSON.stringify(''),
        },
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
          // Vitest 4: pool-specific options are now top-level.
          // Run all integration specs in a single forked process so they share
          // one Anvil instance + mini-indexer.
          forks: {
            singleFork: true,
          },
          // Integration tests must complete; allow longer timeouts for tx confirmations.
          testTimeout: 30000,
          hookTimeout: 60000,
        },
      },
    ],
  },
});

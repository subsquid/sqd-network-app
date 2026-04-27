import { defineConfig } from 'vitest/config';

/**
 * Vitest config for @subsquid/server.
 *
 * Single Node project — no jsdom, no React. Specs live under
 * `src/**\/__tests__/` and `src/**\/*.test.ts`.
 */
export default defineConfig({
  test: {
    name: 'server',
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/__tests__/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist/**'],
    pool: 'threads',
  },
});

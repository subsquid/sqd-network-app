import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'mock-stack',
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/__tests__/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist/**'],
    pool: 'threads',
  },
});

import { sentryRollupPlugin } from '@sentry/rollup-plugin';
import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/main.ts',
  platform: 'node',
  output: {
    dir: 'build',
    format: 'esm',
    sourcemap: true,
    codeSplitting: true,
    minify: true,
  },
  plugins: [
    sentryRollupPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'subsquid-labs-gmbh',
      project: 'network-app-server',
    }),
  ],
});

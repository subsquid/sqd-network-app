import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { config as dotenvConfig } from 'dotenv';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

dotenvConfig({ path: '../../.env' });

const encode = JSON.stringify;

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env.APP_VERSION': encode(process.env.APP_VERSION || 'local'),

    'process.env.TESTNET_WORKERS_CHAT_URL': encode(
      process.env.TESTNET_WORKERS_CHAT_URL || 'https://t.me/+vzY6TbX38kxkOTFi',
    ),
    'process.env.MAINNET_WORKERS_CHAT_URL': encode(
      process.env.MAINNET_WORKERS_CHAT_URL || 'https://t.me/SubsquidMainnetOperators',
    ),
    'process.env.WALLET_CONNECT_PROJECT_ID': encode(process.env.WALLET_CONNECT_PROJECT_ID || ''),
    'process.env.ENABLE_DEMO_FEATURES': encode(process.env.ENABLE_DEMO_FEATURES || 'false'),
    'process.env.NETWORK': encode(process.env.NETWORK || 'mainnet'),
    'process.env.SENTRY_DSN': encode(process.env.SENTRY_DSN || ''),
    'process.env.HOST_URL': encode(process.env.HOST_URL || ''),
  },

  server: {
    watch: {
      followSymlinks: false,
    },
    proxy: {
      '/api/trpc': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/trpc/, ''),
      },
    },
  },

  optimizeDeps: {
    include: ['@mui/material'],
  },

  plugins: [
    tsconfigPaths(),
    react(),
    createHtmlPlugin({}),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'subsquid-labs-gmbh',
      project: 'network-app',
    }),
  ],

  build: {
    sourcemap: true,
    minify: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react',
              test: /node_modules[\\/]react(-dom)?[\\/]/,
              priority: 30,
            },
            {
              name: 'mui',
              test: /node_modules[\\/]@mui[\\/]/,
              priority: 20,
            },
            {
              name: 'web3',
              test: /node_modules[\\/](wagmi|viem|@rainbow-me|@reown|@walletconnect|@metamask)[\\/]/,
              priority: 15,
            },
            {
              name: 'vendor',
              test: /node_modules[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});

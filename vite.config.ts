import react from '@vitejs/plugin-react';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

import 'dotenv/config';

const encode = JSON.stringify;

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.APP_VERSION': encode(process.env.APP_VERSION || 'local'),

    'process.env.DISCORD_API_URL': encode(
      process.env.DISCORD_API_URL || 'https://discord.gg/hellosqd',
    ),
    'process.env.DOCS_API_URL': encode(process.env.DOCS_API_URL || 'https://docs.subsquid.io'),
    'process.env.TESTNET_WORKERS_CHAT_URL': encode(
      process.env.TESTNET_WORKERS_CHAT_URL || 'https://t.me/+vzY6TbX38kxkOTFi',
    ),
    'process.env.MAINNET_WORKERS_CHAT_URL': encode(
      process.env.MAINNET_WORKERS_CHAT_URL || 'https://t.me/SubsquidMainnetOperators',
    ),

    'process.env.TESTNET_SQUID_API_URL': encode(
      process.env.TESTNET_SQUID_API_URL || 'http://localhost:4350',
    ),
    'process.env.MAINNET_SQUID_API_URL': encode(
      process.env.MAINNET_SQUID_API_URL || 'http://localhost:4350',
    ),
    'process.env.WALLET_CONNECT_PROJECT_ID': encode(process.env.WALLET_CONNECT_PROJECT_ID || ''),
    'process.env.ENABLE_DEMO_FEATURES': encode(process.env.ENABLE_DEMO_FEATURES || 'false'),
    'process.env.BLOCK_CHAIN_NODE_ADDRESS': encode(process.env.BLOCK_CHAIN_NODE_ADDRESS),
    'process.env.MULTICALL_3_CONTRACT_ADDRESS': encode(
      process.env.MULTICALL_3_CONTRACT_ADDRESS || '',
    ),
    'process.env.NETWORK': encode(process.env.NETWORK || 'mainnet'),
    'process.env.SENTRY_DSN': encode(process.env.SENTRY_DSN || ''),
  },

  optimizeDeps: {
    include: [
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      '@mui/material/styles',
      '@mui/material/Unstable_Grid2',
    ],
  },
  plugins: [
    tsconfigPaths(),
    react(),
    createHtmlPlugin({}),
    process.env.NODE_ENV === 'production' ? splitVendorChunkPlugin() : undefined,
  ],
});

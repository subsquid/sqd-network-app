import * as Sentry from '@sentry/node';
import { createHTTPServer } from '@trpc/server/adapters/standalone';

import {
  getContractAddresses,
  getGatewaysSquidUrl,
  getPort,
  getRpcUrl,
  getSentryDsn,
  getTokenSquidUrl,
  getWorkersSquidUrl,
} from './env.js';
import { appRouter } from './router.js';
import { createContext } from './trpc.js';

const port = getPort();
const sentryDsn = getSentryDsn();

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development',
    release: process.env.APP_VERSION,
  });
}

const startupLogs = [
  `Server port: ${port}`,
  `Server environment: ${process.env.APP_ENV}`,
  `Server network: ${process.env.NETWORK}`,
  `Sentry enabled: ${Boolean(sentryDsn)}`,
  `Server workers squid url: ${getWorkersSquidUrl()}`,
  `Server gateways squid url: ${getGatewaysSquidUrl()}`,
  `Server token squid url: ${getTokenSquidUrl()}`,
  `Server rpc url: ${getRpcUrl()}`,
  `Server contract addresses: ${Object.entries(getContractAddresses())
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')}`,
];
for (const line of startupLogs) {
  // biome-ignore lint/suspicious/noConsole: startup diagnostics
  console.log(line);
}

const server = createHTTPServer({
  router: appRouter,
  createContext,
  onError: ({ error, path, type, req }) => {
    if (!sentryDsn) return;

    Sentry.captureException(error, {
      tags: {
        trpcPath: path ?? 'unknown',
        trpcType: type,
      },
      extra: {
        method: req.method,
        url: req.url,
      },
    });
  },
});

if (sentryDsn) {
  process.on('unhandledRejection', reason => {
    Sentry.captureException(
      reason instanceof Error ? reason : new Error(`Unhandled rejection: ${String(reason)}`),
    );
  });

  process.on('uncaughtException', error => {
    Sentry.captureException(error);
  });
}

// biome-ignore lint/suspicious/noConsole: start indicator
server.listen(port, () => console.log(`Server is running on port ${port}`));

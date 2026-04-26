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
    // Always log errors to stderr so they appear in logs even without Sentry.
    // biome-ignore lint/suspicious/noConsole: intentional error logging
    console.error(
      `[tRPC error] ${type} ${path ?? 'unknown'} — ${error.code}: ${error.message}`,
      error.cause ?? '',
    );

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

/**
 * Set a server-level request timeout above the GraphQL-service timeout (4.5 s)
 * so slow upstream responses are always closed server-side before the client's
 * 5 s abort fires, and stale keep-alive connections are cleaned up.
 */
server.requestTimeout = 10_000;

server.on('request', (req, res) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    // biome-ignore lint/suspicious/noConsole: request logging
    console.log(`[http] ${req.method} ${req.url} ${res.statusCode} ${ms}ms`);
  });
});

if (sentryDsn) {
  process.on('unhandledRejection', reason => {
    // biome-ignore lint/suspicious/noConsole: unhandled rejection logging
    console.error('[unhandledRejection]', reason);
    Sentry.captureException(
      reason instanceof Error ? reason : new Error(`Unhandled rejection: ${String(reason)}`),
    );
  });

  process.on('uncaughtException', error => {
    // biome-ignore lint/suspicious/noConsole: uncaught exception logging
    console.error('[uncaughtException]', error);
    Sentry.captureException(error);
  });
} else {
  process.on('unhandledRejection', reason => {
    // biome-ignore lint/suspicious/noConsole: unhandled rejection logging
    console.error('[unhandledRejection]', reason);
  });

  process.on('uncaughtException', error => {
    // biome-ignore lint/suspicious/noConsole: uncaught exception logging
    console.error('[uncaughtException]', error);
  });
}

// biome-ignore lint/suspicious/noConsole: start indicator
server.listen(port, () => console.log(`Server is running on port ${port}`));

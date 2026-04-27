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
import { logger } from './logger.js';
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

logger.info(
  {
    port,
    environment: process.env.APP_ENV,
    network: process.env.NETWORK,
    sentryEnabled: Boolean(sentryDsn),
    workersSquidUrl: getWorkersSquidUrl(),
    gatewaysSquidUrl: getGatewaysSquidUrl(),
    tokenSquidUrl: getTokenSquidUrl(),
    rpcUrl: getRpcUrl(),
    contractAddresses: getContractAddresses(),
  },
  'server starting',
);

const server = createHTTPServer({
  router: appRouter,
  createContext,
  onError: ({ error, path, type, req }) => {
    logger.error(
      {
        err: error,
        trpcPath: path ?? 'unknown',
        trpcType: type,
        method: req.method,
        url: req.url,
      },
      `tRPC error ${type} ${path ?? 'unknown'} — ${error.code}`,
    );
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
    logger.info({ method: req.method, url: req.url, status: res.statusCode, ms }, 'http request');
  });
});

process.on('unhandledRejection', reason => {
  logger.error(
    { err: reason instanceof Error ? reason : new Error(`Unhandled rejection: ${String(reason)}`) },
    'unhandledRejection',
  );
});

process.on('uncaughtException', error => {
  logger.fatal({ err: error }, 'uncaughtException');
  process.exit(1);
});

server.listen(port, () => logger.info({ port }, `server is running on port ${port}`));

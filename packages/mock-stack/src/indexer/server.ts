/**
 * HTTP server replicating the GraphQL contract of `mockGraphqlServer.ts`.
 *
 * Accepts POST `/graphql` (or any path) with JSON body
 * `{ operationName, query?, variables? }` and returns
 * `{ data: <resolver output> }`. Defers actual resolution to `dispatcher.ts`.
 *
 * No GraphQL parser, no SDL, no type validation — by design (see plan §3,
 * "No graphql-yoga, no SDL, no OpenCRUD filters"). The server is a thin
 * HTTP shell over the dispatcher.
 */
import http from 'node:http';

import { dispatch } from './dispatcher';

export interface MockGraphqlServer {
  url: string;
  port: number;
  stop(): Promise<void>;
}

export interface StartGraphqlOpts {
  /**
   * Port to listen on. Default `0` — pick an OS-allocated ephemeral port so
   * concurrent test runs can't collide on 4321. Pass an explicit port only
   * for `pnpm dev` mock mode.
   */
  port?: number;
  /** Bind address (default 127.0.0.1). */
  host?: string;
}

export function startGraphqlServer(opts: StartGraphqlOpts = {}): Promise<MockGraphqlServer> {
  const port = opts.port ?? 0;
  const host = opts.host ?? '127.0.0.1';

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      // CORS preflight — the legacy server allowed everything; preserve that.
      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'content-type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        });
        res.end();
        return;
      }
      if (req.method !== 'POST') {
        res.writeHead(405);
        res.end();
        return;
      }

      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });
      req.on('end', () => {
        let operationName: string | undefined;
        let variables: Record<string, unknown> = {};
        try {
          const parsed = JSON.parse(body) as {
            operationName?: string;
            query?: string;
            variables?: Record<string, unknown>;
          };
          operationName = parsed.operationName;
          variables = parsed.variables ?? {};
          // Some clients (e.g. urql in non-persisted mode) only send `query`.
          // Reuse the legacy server's regex extraction so we still resolve.
          if (!operationName && parsed.query) {
            const m = parsed.query.match(/(?:query|mutation)\s+(\w+)/);
            operationName = m?.[1];
          }
        } catch {
          respond(res, null, 400);
          return;
        }

        (async () => {
          try {
            const data = operationName ? await dispatch(operationName, variables) : {};
            respond(res, data);
          } catch (err) {
            // biome-ignore lint/suspicious/noConsole: surface resolver errors during dev
            console.error(`[mock-stack] resolver error for "${operationName}":`, err);
            respond(res, null, 500);
          }
        })();
      });
    });

    server.on('error', err => {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'EADDRINUSE' && port > 0) {
        reject(
          new Error(
            `GraphQL port ${port} is already in use. A previous \`pnpm mock\` may ` +
              'still be running — kill it (Ctrl+C, or `lsof -i:' +
              `${port}\`) and try again.`,
          ),
        );
        return;
      }
      reject(err);
    });
    server.listen(port, host, () => {
      const addr = server.address();
      const boundPort = addr && typeof addr !== 'string' ? addr.port : port;
      resolve({
        url: `http://${host}:${boundPort}/graphql`,
        port: boundPort,
        async stop() {
          await new Promise<void>((res, rej) => {
            server.close(err => (err ? rej(err) : res()));
          });
        },
      });
    });
  });
}

function respond(res: http.ServerResponse, data: unknown, status = 200) {
  const body = JSON.stringify({ data });
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type',
  });
  res.end(body);
}

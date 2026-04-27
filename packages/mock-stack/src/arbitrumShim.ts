/**
 * Tiny JSON-RPC HTTP proxy that fronts our mock anvil and patches block
 * responses so they look like Arbitrum nitro nodes — specifically, every
 * `eth_getBlockByNumber` / `eth_getBlockByHash` result gains an
 * `l1BlockNumber` field equal to the block's own `number`.
 *
 * Why: real Arbitrum One nodes inject `l1BlockNumber` onto block objects;
 * `(block as any).l1BlockNumber` is read by upstream code (e.g. the
 * production rewards-calculator) to figure out which L1 block a given L2
 * block corresponds to. Anvil knows nothing about L1 and omits the field
 * entirely, so any caller that touches it crashes / NaNs. Since on
 * Arbitrum `block.number` already equals the L1 block number anyway, the
 * simplest faithful mock is to splice `l1BlockNumber := block.number`
 * into every block response.
 *
 * The proxy is transparent for all other JSON-RPC methods — request
 * bodies (single calls or batches) are forwarded verbatim; only block
 * results are mutated on the way back. Listens on a fresh ephemeral port
 * picked by the OS; lifecycle is tied to the anvil handle that owns it.
 */
import http from 'node:http';
import net from 'node:net';

export interface ArbitrumShimHandle {
  url: string;
  port: number;
  stop(): Promise<void>;
}

interface JsonRpcResponse {
  jsonrpc?: string;
  id?: number | string | null;
  result?: unknown;
  error?: unknown;
}

export interface StartArbitrumShimOpts {
  upstreamUrl: string;
  /**
   * Port to listen on. Default `0` — ephemeral, picked by the OS. Pass an
   * explicit port (e.g. 8545) to expose the shim at the address client
   * code expects to find anvil on.
   */
  port?: number;
}

/**
 * Spawn a JSON-RPC proxy in front of `upstreamUrl`. The returned URL
 * should be passed wherever the caller would otherwise hand out the raw
 * anvil URL.
 */
export async function startArbitrumShim(
  optsOrUrl: StartArbitrumShimOpts | string,
): Promise<ArbitrumShimHandle> {
  const opts: StartArbitrumShimOpts =
    typeof optsOrUrl === 'string' ? { upstreamUrl: optsOrUrl } : optsOrUrl;
  const upstreamUrl = opts.upstreamUrl;
  const desiredPort = opts.port ?? 0;
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.end('Method Not Allowed');
      return;
    }
    let body = '';
    req.setEncoding('utf-8');
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      void forward(upstreamUrl, body)
        .then(({ status, payload }) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(payload);
        })
        .catch(err => {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              jsonrpc: '2.0',
              id: null,
              error: { code: -32603, message: `Arbitrum shim proxy error: ${String(err)}` },
            }),
          );
        });
    });
    req.on('error', () => {
      // request aborted — nothing else to do
    });
  });

  const port = await new Promise<number>((resolve, reject) => {
    server.listen(desiredPort, '127.0.0.1');
    server.once('listening', () => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') {
        reject(new Error('Arbitrum shim listen produced no port'));
        return;
      }
      resolve(addr.port);
    });
    server.once('error', reject);
  });

  return {
    url: `http://127.0.0.1:${port}`,
    port,
    async stop() {
      await new Promise<void>(resolve => server.close(() => resolve()));
    },
  };
}

async function forward(
  upstreamUrl: string,
  body: string,
): Promise<{ status: number; payload: string }> {
  const upstreamRes = await fetch(upstreamUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  const text = await upstreamRes.text();

  // Best-effort JSON parse — non-JSON responses (rare) are forwarded
  // verbatim so the caller sees the same error anvil would have produced.
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { status: upstreamRes.status, payload: text };
  }

  // Determine which subset of calls to mutate by re-parsing the request
  // body: we only patch responses for `eth_getBlockBy*` calls.
  let request: unknown;
  try {
    request = JSON.parse(body);
  } catch {
    return { status: upstreamRes.status, payload: text };
  }

  if (Array.isArray(request) && Array.isArray(parsed)) {
    // Batched call — pair request[i] with parsed[i].
    const responseById = new Map<number | string, JsonRpcResponse>();
    for (const r of parsed as JsonRpcResponse[]) {
      if (r && r.id !== undefined && r.id !== null) responseById.set(r.id, r);
    }
    for (const req of request as Array<{ id?: number | string; method?: string }>) {
      if (req.id === undefined || req.id === null) continue;
      const res = responseById.get(req.id);
      if (!res) continue;
      patchIfBlockResult(req.method, res);
    }
    return { status: upstreamRes.status, payload: JSON.stringify(parsed) };
  }

  if (
    request &&
    !Array.isArray(request) &&
    typeof request === 'object' &&
    parsed &&
    !Array.isArray(parsed) &&
    typeof parsed === 'object'
  ) {
    const req = request as { method?: string };
    patchIfBlockResult(req.method, parsed as JsonRpcResponse);
    return { status: upstreamRes.status, payload: JSON.stringify(parsed) };
  }

  return { status: upstreamRes.status, payload: text };
}

const BLOCK_METHODS = new Set(['eth_getBlockByNumber', 'eth_getBlockByHash']);

function patchIfBlockResult(method: string | undefined, response: JsonRpcResponse): void {
  if (!method || !BLOCK_METHODS.has(method)) return;
  const result = response.result;
  if (!result || typeof result !== 'object') return;
  const block = result as { number?: string; l1BlockNumber?: string };
  if (block.l1BlockNumber !== undefined) return;
  if (typeof block.number === 'string') {
    // Arbitrum returns hex-encoded L1 block numbers; reuse the L2 number
    // verbatim. On real Arbitrum these would differ, but `block.number`
    // already equals the L1 block number inside Solidity (Arbitrum's
    // well-known quirk), so the value space is consistent end-to-end.
    block.l1BlockNumber = block.number;
  }
}

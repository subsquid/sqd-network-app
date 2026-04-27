/**
 * Unit test for the Arbitrum RPC shim. Spins up a fake "upstream" HTTP
 * server that mimics anvil's JSON-RPC surface but deliberately omits
 * `l1BlockNumber` from block responses, then asserts the shim splices
 * it in (single + batched calls + by-hash) without disturbing other
 * methods.
 */
import http from 'node:http';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { type ArbitrumShimHandle, startArbitrumShim } from '../arbitrumShim';

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: number | string | null;
  method: string;
  params: unknown[];
}

function startFakeUpstream(
  handler: (req: JsonRpcRequest) => unknown,
): Promise<{ url: string; stop: () => Promise<void>; calls: JsonRpcRequest[] }> {
  const calls: JsonRpcRequest[] = [];
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let body = '';
      req.setEncoding('utf-8');
      req.on('data', c => {
        body += c;
      });
      req.on('end', () => {
        const parsed = JSON.parse(body);
        const respond = (request: JsonRpcRequest) => {
          calls.push(request);
          return {
            jsonrpc: '2.0' as const,
            id: request.id,
            result: handler(request),
          };
        };
        const out = Array.isArray(parsed) ? parsed.map(respond) : respond(parsed);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(out));
      });
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') {
        reject(new Error('listen produced no port'));
        return;
      }
      resolve({
        url: `http://127.0.0.1:${addr.port}`,
        stop: () => new Promise<void>(r => server.close(() => r())),
        calls,
      });
    });
  });
}

interface AnvilBlock {
  number: string;
  hash: string;
  timestamp: string;
}

function makeBlock(num: number): AnvilBlock {
  return {
    number: `0x${num.toString(16)}`,
    hash: `0x${num.toString(16).padStart(64, '0')}`,
    timestamp: '0x65000000',
  };
}

describe('arbitrumShim', () => {
  let upstream: Awaited<ReturnType<typeof startFakeUpstream>>;
  let shim: ArbitrumShimHandle;

  beforeEach(async () => {
    upstream = await startFakeUpstream(req => {
      switch (req.method) {
        case 'eth_blockNumber':
          return '0x7b';
        case 'eth_getBlockByNumber':
        case 'eth_getBlockByHash':
          return makeBlock(0x7b);
        case 'eth_chainId':
          return '0xa4b1';
        default:
          return null;
      }
    });
    shim = await startArbitrumShim({ upstreamUrl: upstream.url });
  });

  afterEach(async () => {
    await shim.stop();
    await upstream.stop();
  });

  async function rpc(body: unknown): Promise<unknown> {
    const res = await fetch(shim.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  it('injects l1BlockNumber on eth_getBlockByNumber single call', async () => {
    const out = (await rpc({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
    })) as { result: AnvilBlock & { l1BlockNumber?: string } };
    expect(out.result.number).toBe('0x7b');
    expect(out.result.l1BlockNumber).toBe('0x7b');
  });

  it('injects l1BlockNumber on eth_getBlockByHash', async () => {
    const out = (await rpc({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBlockByHash',
      params: ['0x' + '0'.repeat(63) + '7', false],
    })) as { result: AnvilBlock & { l1BlockNumber?: string } };
    expect(out.result.l1BlockNumber).toBe(out.result.number);
  });

  it('does not modify l1BlockNumber if upstream already supplied one', async () => {
    await shim.stop();
    upstream = await startFakeUpstream(req => {
      if (req.method === 'eth_getBlockByNumber') {
        return { ...makeBlock(5), l1BlockNumber: '0xdeadbeef' };
      }
      return null;
    });
    shim = await startArbitrumShim({ upstreamUrl: upstream.url });
    const out = (await rpc({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
    })) as { result: AnvilBlock & { l1BlockNumber?: string } };
    expect(out.result.l1BlockNumber).toBe('0xdeadbeef');
  });

  it('forwards non-block methods unchanged', async () => {
    const out = (await rpc({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_chainId',
      params: [],
    })) as { result: string };
    expect(out.result).toBe('0xa4b1');
  });

  it('handles batched requests, patching only block calls', async () => {
    const batched = (await rpc([
      { jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] },
      { jsonrpc: '2.0', id: 2, method: 'eth_getBlockByNumber', params: ['latest', false] },
      { jsonrpc: '2.0', id: 3, method: 'eth_chainId', params: [] },
    ])) as Array<{ id: number; result: unknown }>;
    expect(batched).toHaveLength(3);
    const blockNumber = batched.find(r => r.id === 1);
    const getBlock = batched.find(r => r.id === 2) as
      | { result: AnvilBlock & { l1BlockNumber?: string } }
      | undefined;
    const chainId = batched.find(r => r.id === 3);
    expect(blockNumber?.result).toBe('0x7b');
    expect(getBlock?.result.l1BlockNumber).toBe('0x7b');
    expect(chainId?.result).toBe('0xa4b1');
  });
});

/**
 * Anvil lifecycle helpers used by both the deploy harness and the
 * `startMockStack()` entrypoint.
 *
 * Wraps `node:child_process` with two opinions:
 *   - The anvil binary is resolved from `$FOUNDRY_PATH` if set, then `$HOME/.foundry/bin`,
 *     finally falling back to the system PATH.
 *   - Boot is awaited via `eth_blockNumber` polling — `anvil` doesn't write a
 *     ready marker, and TCP-connect-and-hope is racy with the JSON-RPC handler.
 */
import { type ChildProcess, spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

import { createPublicClient, http } from 'viem';

export interface SpawnAnvilOpts {
  /**
   * TCP port. Default `0` — pick an ephemeral free port automatically so
   * concurrent test runs and rerun loops can't collide on 8545. Pass an
   * explicit port (e.g. `8545`) only for `pnpm dev` mock mode.
   */
  port?: number;
  /** Chain id (default 42161 / arbitrum mainnet). */
  chainId?: number;
  /**
   * Number of pre-funded dev accounts. Default 10. We only use `[0]` for
   * deploys — the persona accounts live elsewhere (set explicitly via
   * `anvil_setBalance`).
   */
  accounts?: number;
  /** Stream anvil stdout to the parent process. Useful for debugging. */
  verbose?: boolean;
  /**
   * Interval mining: mine a new block every N seconds. Default is instant
   * mining (a block per transaction). Pass `12` to mimic Arbitrum block cadence.
   */
  blockTime?: number;
}

export interface AnvilHandle {
  url: string;
  port: number;
  process: ChildProcess;
  stop(): Promise<void>;
}

/** Resolve the `anvil` binary path. */
function resolveAnvilBinary(): string {
  if (process.env.FOUNDRY_PATH) {
    return path.join(process.env.FOUNDRY_PATH, 'anvil');
  }
  const homeBin = path.join(process.env.HOME ?? '/root', '.foundry', 'bin', 'anvil');
  if (fs.existsSync(homeBin)) return homeBin;
  return 'anvil'; // fall back to PATH
}

/**
 * Reserve an OS-allocated TCP port on `127.0.0.1` and return it.
 *
 * Anvil itself doesn't print the port it bound to when given `--port 0`, so
 * we pre-allocate a free port via `net.Server` and pass that explicit number
 * to anvil. The kernel guarantees the same port stays free for a brief
 * window after close — long enough for anvil to grab it.
 */
async function pickFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') {
        reject(new Error('failed to allocate ephemeral port'));
        return;
      }
      const port = addr.port;
      server.close(() => resolve(port));
    });
  });
}

/**
 * Probe the given port and reject with a clear message if something is
 * already listening. Otherwise resolves with the port unchanged.
 */
async function ensurePortFree(port: number): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const probe = net.createServer();
    probe.unref();
    probe.once('error', err => {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'EADDRINUSE') {
        reject(
          new Error(
            `Port ${port} is already in use. A previous \`pnpm mock\` may still be ` +
              'running — kill it (Ctrl+C in that terminal, or `lsof -i:' +
              `${port}\` to find the PID) and try again.`,
          ),
        );
      } else {
        reject(err);
      }
    });
    probe.listen(port, '127.0.0.1', () => {
      probe.close(() => resolve());
    });
  });
}

/** Spawn a fresh anvil process, waiting until it answers `eth_blockNumber`. */
export async function spawnAnvil(opts: SpawnAnvilOpts = {}): Promise<AnvilHandle> {
  const port = opts.port && opts.port > 0 ? opts.port : await pickFreePort();
  // Pre-flight: bail out with an actionable error if 8545 (or whatever the
  // caller asked for) is already taken — otherwise anvil's spawn fails
  // silently and waitForAnvil reports a generic "did not become ready" timeout.
  if (opts.port && opts.port > 0) {
    await ensurePortFree(port);
  }
  const chainId = opts.chainId ?? 42161;
  const accounts = opts.accounts ?? 10;
  const url = `http://127.0.0.1:${port}`;

  const args = [
    '--port',
    String(port),
    '--chain-id',
    String(chainId),
    '--accounts',
    String(accounts),
    '--silent',
    // The network contracts (DistributedRewardsDistribution, GatewayRegistry,
    // …) are above EIP-170's 24KB runtime limit. Anvil enforces it by default;
    // bump it so the deploy harness can install them. Mainnet uses Arbitrum
    // which has a much larger limit anyway.
    '--code-size-limit',
    '50000',
    ...(opts.blockTime !== undefined ? ['--block-time', String(opts.blockTime)] : []),
  ];
  const binary = resolveAnvilBinary();
  const child = spawn(binary, args, {
    stdio: opts.verbose ? 'inherit' : 'ignore',
    env: process.env,
  });

  child.on('error', err => {
    // biome-ignore lint/suspicious/noConsole: surface child-process spawn errors
    console.error(`[mock-stack] anvil spawn error: ${err.message}`);
  });

  await waitForAnvil(url, 10_000);

  return {
    url,
    port,
    process: child,
    async stop() {
      if (child.exitCode !== null) return;
      child.kill('SIGTERM');
      await new Promise<void>(resolve => {
        const timer = setTimeout(() => {
          if (child.exitCode === null) child.kill('SIGKILL');
          resolve();
        }, 2_000);
        child.once('exit', () => {
          clearTimeout(timer);
          resolve();
        });
      });
    },
  };
}

async function waitForAnvil(url: string, timeoutMs: number): Promise<void> {
  const client = createPublicClient({ transport: http(url) });
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown;
  while (Date.now() < deadline) {
    try {
      await client.getBlockNumber();
      return;
    } catch (err) {
      lastError = err;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  throw new Error(
    `Anvil at ${url} did not become ready within ${timeoutMs}ms. Last error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}

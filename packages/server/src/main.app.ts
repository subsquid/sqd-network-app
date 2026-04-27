/**
 * Entrypoint for `pnpm mock:app` — server half.
 *
 * Assumes a long-lived chain is running (started via `pnpm mock:chain`):
 *   - anvil at http://localhost:8545
 *   - mini-indexer GraphQL at http://localhost:4321/graphql
 *   - .deployments.json populated at packages/mock-stack/.deployments.json
 *
 * This entrypoint does NOT own the chain. It only:
 *   - Reads the deployments map from disk to discover contract addresses.
 *   - Calls setRuntimeOverride() so the regular tRPC routers route at the
 *     running chain instead of mainnet.
 *   - Hands off to main.ts, which can hot-reload freely under tsx --watch
 *     without tearing down anvil.
 *
 * Up-front check: if .deployments.json is missing, prints a clear hint
 * to start `pnpm mock:chain` first and exits 1.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ContractAddresses } from '@subsquid/common';

import { setRuntimeOverride } from './env.js';
import { logger } from './logger.js';

const CHAIN_RPC_URL = 'http://localhost:8545';
const CHAIN_GRAPHQL_URL = 'http://localhost:4321/graphql';

/**
 * Real-indexer mode (MOCK_REAL_INDEXER=1) routes the three squid queries
 * at the dockerised squid-subsquid-network indexers brought up by
 * `pnpm mock:devnet`. Ports match tools/devnet/docker-compose.yaml.
 */
const REAL_INDEXER_URLS = {
  workers: 'http://localhost:4351/graphql',
  gateways: 'http://localhost:4352/graphql',
  token: 'http://localhost:4353/graphql',
} as const;

const useRealIndexer = process.env.MOCK_REAL_INDEXER === '1';

function locateDeployments(): string {
  // packages/server/src/main.app.ts → ../../mock-stack/.deployments.json
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '../../mock-stack/.deployments.json');
}

async function waitForDeployments(): Promise<Partial<ContractAddresses>> {
  const deploymentsPath = locateDeployments();
  let printedHint = false;
  while (true) {
    if (fs.existsSync(deploymentsPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(deploymentsPath, 'utf-8')) as Record<string, string>;
        return raw as Partial<ContractAddresses>;
      } catch {
        // file is being written; retry
      }
    }
    if (!printedHint) {
      logger.info(
        { deploymentsPath },
        '[mock:app] waiting for the chain to come up… ' +
          '(start the chain with `pnpm mock:chain` in another terminal if it is not already running)',
      );
      printedHint = true;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function waitForEndpoint(url: string, label: string): Promise<void> {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: 'POST', body: '{}' });
      // Any HTTP response means the server is alive (even a 405).
      if (res.status >= 100) return;
    } catch {
      // not yet
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  logger.error(
    { url, label },
    `[mock:app] ${label} at ${url} did not come up within 60s. Is \`pnpm mock:chain\` still running and healthy?`,
  );
  process.exit(1);
}

const deployments = await waitForDeployments();
await waitForEndpoint(CHAIN_RPC_URL, 'anvil');

if (useRealIndexer) {
  // The dockerised squid indexers come up after `pnpm mock:devnet` and
  // need a few seconds to apply migrations + sync. Block here so the
  // first tRPC requests don't get connection errors.
  await Promise.all([
    waitForEndpoint(REAL_INDEXER_URLS.workers, 'workers-indexer'),
    waitForEndpoint(REAL_INDEXER_URLS.gateways, 'gateways-indexer'),
    waitForEndpoint(REAL_INDEXER_URLS.token, 'token-indexer'),
  ]);

  setRuntimeOverride({
    network: 'mainnet',
    workersSquidUrl: REAL_INDEXER_URLS.workers,
    gatewaysSquidUrl: REAL_INDEXER_URLS.gateways,
    tokenSquidUrl: REAL_INDEXER_URLS.token,
    rpcUrl: CHAIN_RPC_URL,
    contractAddressOverride: deployments,
  });

  logger.info(
    {
      anvil: CHAIN_RPC_URL,
      indexers: REAL_INDEXER_URLS,
      contractCount: Object.keys(deployments).length,
    },
    '[mock:app] chain + real-indexer endpoints ready',
  );
} else {
  await waitForEndpoint(CHAIN_GRAPHQL_URL, 'graphql');

  setRuntimeOverride({
    network: 'mainnet',
    squidGraphqlUrl: CHAIN_GRAPHQL_URL,
    rpcUrl: CHAIN_RPC_URL,
    contractAddressOverride: deployments,
  });

  logger.info(
    {
      anvil: CHAIN_RPC_URL,
      graphql: CHAIN_GRAPHQL_URL,
      contractCount: Object.keys(deployments).length,
    },
    '[mock:app] chain endpoints ready (mini-indexer mode)',
  );
}

// Hand off to the regular startup. Hot-reload under tsx --watch is safe
// here because nothing in this module owns chain state.
await import('./main.js');

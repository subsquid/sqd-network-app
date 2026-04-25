export type NetworkName = 'mainnet' | 'tethys';

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export function getNetwork(): NetworkName {
  const network = process.env.NETWORK ?? 'mainnet';
  if (network === 'tethys' || network === 'mainnet') return network;
  return 'mainnet';
}

/**
 * Master switch: set MOCK_WALLET=true to activate the entire mock environment
 * (mock GraphQL fixtures, mock RPC server, mock wagmi connector on the client).
 * Never set in production.
 */
export function isMockMode(): boolean {
  return process.env.MOCK_WALLET === 'true';
}

/**
 * Whether to use the in-process mock GraphQL fixture server instead of the
 * real Squid APIs.  Activated automatically when MOCK_WALLET=true, or can be
 * set explicitly via MOCK_GRAPHQL=true.
 */
export function isMockGraphql(): boolean {
  return isMockMode() || process.env.MOCK_GRAPHQL === 'true';
}

/** Port the mock GraphQL server will listen on (default 4321). */
export function getMockGraphqlPort(): number {
  return Number(process.env.MOCK_GRAPHQL_PORT ?? 4321);
}

function getMockGraphqlUrl(): string {
  return `http://localhost:${getMockGraphqlPort()}/graphql`;
}

export function getWorkersSquidUrl(): string {
  if (isMockGraphql()) return getMockGraphqlUrl();
  return getNetwork() === 'tethys'
    ? getEnv('TESTNET_WORKERS_SQUID_API_URL', 'http://localhost:4350')
    : getEnv('MAINNET_WORKERS_SQUID_API_URL', 'http://localhost:4350');
}

export function getGatewaysSquidUrl(): string {
  if (isMockGraphql()) return getMockGraphqlUrl();
  return getNetwork() === 'tethys'
    ? getEnv('TESTNET_GATEWAYS_SQUID_API_URL', 'http://localhost:4350')
    : getEnv('MAINNET_GATEWAYS_SQUID_API_URL', 'http://localhost:4350');
}

export function getTokenSquidUrl(): string {
  if (isMockGraphql()) return getMockGraphqlUrl();
  return getNetwork() === 'tethys'
    ? getEnv('TESTNET_TOKEN_SQUID_API_URL', 'http://localhost:4350')
    : getEnv('MAINNET_TOKEN_SQUID_API_URL', 'http://localhost:4350');
}

export function getRpcUrl(): string | undefined {
  const rpcUrl = process.env.ARBITRUM_ONE_RPC_URL?.trim();
  return rpcUrl || undefined;
}

export function getPort(): number {
  return Number(getEnv('SERVER_PORT', '3001'));
}

export function getSentryDsn(): string | undefined {
  const dsn = process.env.SENTRY_DSN?.trim();
  return dsn ? dsn : undefined;
}

import fs from 'node:fs';
import path from 'node:path';

import {
  type ContractAddresses,
  getContractAddresses as getCommonContractAddresses,
} from '@subsquid/common';

export type { ContractAddresses };

/**
 * Locate the mock-stack `.deployments.json` produced by
 * `pnpm --filter @subsquid/mock-stack stack:prepare`. We look in the
 * standard relative location plus any explicit override via
 * `MOCK_STACK_DEPLOYMENTS` so test harnesses can point at a custom file.
 */
function loadMockDeployments(): Partial<ContractAddresses> | null {
  if (!isMockMode()) return null;
  const explicit = process.env.MOCK_STACK_DEPLOYMENTS;
  const candidates = [
    explicit,
    path.resolve(process.cwd(), '../mock-stack/.deployments.json'),
    path.resolve(process.cwd(), '../../packages/mock-stack/.deployments.json'),
    path.resolve(process.cwd(), 'packages/mock-stack/.deployments.json'),
  ].filter((p): p is string => Boolean(p));

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      try {
        const raw = JSON.parse(fs.readFileSync(candidate, 'utf-8')) as Record<string, string>;
        return raw as Partial<ContractAddresses>;
      } catch {
        // ignore — fall through to next candidate
      }
    }
  }
  return null;
}

export function getContractAddresses(): ContractAddresses {
  const override = loadMockDeployments() ?? undefined;
  return getCommonContractAddresses({ network: getNetwork(), override });
}

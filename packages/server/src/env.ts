import fs from 'node:fs';
import path from 'node:path';

import {
  type ContractAddresses,
  getContractAddresses as getCommonContractAddresses,
} from '@subsquid/common';

export type NetworkName = 'mainnet' | 'tethys';

export type { ContractAddresses };

/**
 * Runtime override slot for tests.
 *
 * Production (`pnpm dev`, `pnpm start`) reads everything from `process.env`.
 * Tests call `setRuntimeOverride({ ... })` once before importing `appRouter`
 * and the override values win — no `process.env.*` mutation, no
 * pseudo-environment vars (`MOCK_GRAPHQL_PORT`, `MOCK_STACK_DEPLOYMENTS`, …)
 * cluttering the codebase for a value that's always the same in tests.
 *
 * The shape mirrors only the getters that vary between envs. Anything not
 * overridden falls through to the standard `process.env` resolution.
 */
export interface RuntimeOverride {
  network?: NetworkName;
  /** Replace the URL used by every Squid GraphQL caller (workers/gateways/token). */
  squidGraphqlUrl?: string;
  /** Override the JSON-RPC URL used by the blockchain service. */
  rpcUrl?: string;
  /** Merge into the contract address book (typically from .deployments.json). */
  contractAddressOverride?: Partial<ContractAddresses>;
  /** When true, treat the runtime as mock mode regardless of MOCK_WALLET. */
  mockMode?: boolean;
}

let runtimeOverride: RuntimeOverride = {};

/** Tests call this once during globalSetup; production never does. */
export function setRuntimeOverride(override: RuntimeOverride): void {
  runtimeOverride = override;
}

/** Get the active override (read-only) — primarily for diagnostics. */
export function getRuntimeOverride(): Readonly<RuntimeOverride> {
  return runtimeOverride;
}

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export function getNetwork(): NetworkName {
  if (runtimeOverride.network) return runtimeOverride.network;
  const network = process.env.NETWORK ?? 'mainnet';
  if (network === 'tethys' || network === 'mainnet') return network;
  return 'mainnet';
}

/**
 * Master switch: set MOCK_WALLET=true to activate the mock environment for
 * `pnpm dev`. Tests use `setRuntimeOverride({ mockMode: true })` instead.
 */
export function isMockMode(): boolean {
  return runtimeOverride.mockMode === true || process.env.MOCK_WALLET === 'true';
}

/**
 * Whether the legacy in-process mock GraphQL server should be started by
 * `pnpm dev`. Activated when `MOCK_WALLET=true` (or explicitly via
 * `MOCK_GRAPHQL=true`). Tests do not use this — they override the GraphQL
 * URL directly via `setRuntimeOverride({ squidGraphqlUrl })`.
 */
export function isMockGraphql(): boolean {
  return isMockMode() || process.env.MOCK_GRAPHQL === 'true';
}

/** Port the legacy in-process mock GraphQL server listens on (default 4321). */
export function getMockGraphqlPort(): number {
  return Number(process.env.MOCK_GRAPHQL_PORT ?? 4321);
}

export function getWorkersSquidUrl(): string {
  if (runtimeOverride.squidGraphqlUrl) return runtimeOverride.squidGraphqlUrl;
  return getNetwork() === 'tethys'
    ? getEnv('TESTNET_WORKERS_SQUID_API_URL', 'http://localhost:4350')
    : getEnv('MAINNET_WORKERS_SQUID_API_URL', 'http://localhost:4350');
}

export function getGatewaysSquidUrl(): string {
  if (runtimeOverride.squidGraphqlUrl) return runtimeOverride.squidGraphqlUrl;
  return getNetwork() === 'tethys'
    ? getEnv('TESTNET_GATEWAYS_SQUID_API_URL', 'http://localhost:4350')
    : getEnv('MAINNET_GATEWAYS_SQUID_API_URL', 'http://localhost:4350');
}

export function getTokenSquidUrl(): string {
  if (runtimeOverride.squidGraphqlUrl) return runtimeOverride.squidGraphqlUrl;
  return getNetwork() === 'tethys'
    ? getEnv('TESTNET_TOKEN_SQUID_API_URL', 'http://localhost:4350')
    : getEnv('MAINNET_TOKEN_SQUID_API_URL', 'http://localhost:4350');
}

export function getRpcUrl(): string | undefined {
  if (runtimeOverride.rpcUrl) return runtimeOverride.rpcUrl;
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

/**
 * Locate the mock-stack `.deployments.json` produced by
 * `pnpm --filter @subsquid/mock-stack stack:prepare`. Used by `pnpm dev`
 * mock mode so the dev server's contract address book picks up
 * mock-stack-deployed addresses without further configuration. Tests should
 * use `setRuntimeOverride({ contractAddressOverride })` instead.
 */
function loadMockDeploymentsFromDisk(): Partial<ContractAddresses> | null {
  if (!isMockMode()) return null;
  const candidates = [
    path.resolve(process.cwd(), '../mock-stack/.deployments.json'),
    path.resolve(process.cwd(), '../../packages/mock-stack/.deployments.json'),
    path.resolve(process.cwd(), 'packages/mock-stack/.deployments.json'),
  ];
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
  const override =
    runtimeOverride.contractAddressOverride ?? loadMockDeploymentsFromDisk() ?? undefined;
  return getCommonContractAddresses({ network: getNetwork(), override });
}

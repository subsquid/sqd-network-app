import {
  type ContractAddresses,
  getContractAddresses as getCommonContractAddresses,
} from '@subsquid/common';

export type NetworkName = 'mainnet' | 'tethys';

export type { ContractAddresses };

/**
 * Runtime override slot for tests + the mock-mode entrypoint.
 *
 * Production reads everything from `process.env`. The mock-mode startup
 * (`main.mock.ts`) and Vitest's globalSetup populate this once before
 * importing `appRouter` — every getter checks the override first, then
 * falls through to `process.env`. This removes the need for boolean
 * `MOCK_*` flags scattered through the env contract.
 */
export interface RuntimeOverride {
  network?: NetworkName;
  /** Replace the URL used by every Squid GraphQL caller (workers/gateways/token). */
  squidGraphqlUrl?: string;
  /** Override the JSON-RPC URL used by the blockchain service. */
  rpcUrl?: string;
  /** Merge into the contract address book (typically from .deployments.json). */
  contractAddressOverride?: Partial<ContractAddresses>;
}

let runtimeOverride: RuntimeOverride = {};

/** Mock entrypoint and tests call this once before importing appRouter. */
export function setRuntimeOverride(override: RuntimeOverride): void {
  runtimeOverride = override;
}

/** Read the active override (diagnostics + introspection only). */
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
  return network === 'tethys' ? 'tethys' : 'mainnet';
}

function getSquidUrl(envKey: string): string {
  if (runtimeOverride.squidGraphqlUrl) return runtimeOverride.squidGraphqlUrl;
  const network = getNetwork().toUpperCase();
  return getEnv(`${network}_${envKey}`, 'http://localhost:4350');
}

export function getWorkersSquidUrl(): string {
  return getSquidUrl('WORKERS_SQUID_API_URL');
}

export function getGatewaysSquidUrl(): string {
  return getSquidUrl('GATEWAYS_SQUID_API_URL');
}

export function getTokenSquidUrl(): string {
  return getSquidUrl('TOKEN_SQUID_API_URL');
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

export function getContractAddresses(): ContractAddresses {
  return getCommonContractAddresses({
    network: getNetwork(),
    override: runtimeOverride.contractAddressOverride,
  });
}

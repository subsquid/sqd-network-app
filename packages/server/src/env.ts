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

export function getNetworkSquidUrl(): string {
  return getNetwork() === 'tethys'
    ? getEnv('TESTNET_SQUID_API_URL', 'http://localhost:4350')
    : getEnv('MAINNET_SQUID_API_URL', 'http://localhost:4350');
}

export function getPoolSquidUrl(): string {
  return getNetwork() === 'tethys'
    ? getEnv('TESTNET_POOL_SQUID_API_URL', 'http://localhost:4350')
    : getEnv('MAINNET_POOL_SQUID_API_URL', 'http://localhost:4350');
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

import { CONTRACT_ADDRESSES, type ContractAddresses } from '@subsquid/common';

export type { ContractAddresses };

export function getContractAddresses(): ContractAddresses {
  return CONTRACT_ADDRESSES[getNetwork()];
}

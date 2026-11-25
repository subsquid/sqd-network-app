import type { NetworkName } from './addresses';

/**
 * Portal pools operated by SQD. Every other pool is shown as third-party, so a newly
 * created pool is never presented as SQD's until it is added here. The pool operator
 * is not used for this because it can be transferred.
 */
export const SQD_OPERATED_POOLS: Record<NetworkName, readonly `0x${string}`[]> = {
  mainnet: [
    '0x438c2a47e82cD445524Ce5651AE7E6c1Dd386D09', // SQD Revenue Pool
    '0x89cA93e09ec7355A1d6bd410Fe0bB4C9B24542DB', // Lambda x SQD
  ],
  tethys: [],
};

export function isSqdOperatedPool(network: NetworkName, poolAddress: string): boolean {
  const address = poolAddress.toLowerCase();
  return SQD_OPERATED_POOLS[network].some(pool => pool.toLowerCase() === address);
}

export interface PoolMetadata {
  name?: string;
  description?: string;
  website?: string;
}

/** Pool metadata is set by the pool operator, so any JSON value can arrive here. */
export function parsePoolMetadata(value?: string): PoolMetadata {
  let parsed: unknown;
  try {
    parsed = value ? JSON.parse(value) : undefined;
  } catch {
    return {};
  }
  if (typeof parsed !== 'object' || parsed === null) return {};

  const record = parsed as Record<string, unknown>;
  const pick = (key: keyof PoolMetadata) =>
    typeof record[key] === 'string' ? (record[key] as string) : undefined;
  return { name: pick('name'), description: pick('description'), website: pick('website') };
}

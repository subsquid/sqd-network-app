/**
 * Project PortalPoolFactory.PoolCreated events into the slim registry.
 *
 * The full set of pool fields (operator, capacity, distribution rate,
 * etc.) is read on demand via `Pool.getPoolInfo()` inside the resolver —
 * we only need to remember the pool address + the block it was created
 * at so the resolver can sort newest-first.
 */
import { type Abi, type Log, decodeEventLog } from 'viem';

import { type IndexerRegistry, rememberPortalPool } from '../registry';

export function applyPortalFactoryLog(registry: IndexerRegistry, abi: Abi, log: Log): void {
  let decoded: { eventName: string; args: unknown };
  try {
    decoded = decodeEventLog({ abi, data: log.data, topics: log.topics }) as {
      eventName: string;
      args: unknown;
    };
  } catch {
    return;
  }
  if (decoded.eventName !== 'PoolCreated') return;
  const args = decoded.args as { portal: `0x${string}` };
  rememberPortalPool(registry, args.portal, log.blockNumber ?? 0n);
}

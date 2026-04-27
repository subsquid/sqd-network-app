/**
 * Project VestingFactory.VestingCreated events into the slim registry.
 *
 * Per-vesting fields (start, duration, expectedTotalAmount, current
 * locked balance) are read on demand inside the resolver. We only need
 * to know which vesting contracts exist for which beneficiary so the
 * `vestingsByAccount` and `accountsByOwner` resolvers can enumerate.
 */
import { type Abi, type Log, decodeEventLog } from 'viem';

import { type IndexerRegistry, rememberVesting } from '../registry';

export function applyVestingFactoryLog(registry: IndexerRegistry, abi: Abi, log: Log): void {
  let decoded: { eventName: string; args: unknown };
  try {
    decoded = decodeEventLog({ abi, data: log.data, topics: log.topics }) as {
      eventName: string;
      args: unknown;
    };
  } catch {
    return;
  }
  if (decoded.eventName !== 'VestingCreated') return;
  const args = decoded.args as {
    vesting: `0x${string}`;
    beneficiary: `0x${string}`;
  };
  rememberVesting(registry, args.vesting, args.beneficiary);
}

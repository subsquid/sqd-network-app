/**
 * Project VestingFactory.VestingCreated events into the entity store.
 *
 * VestingCreated(
 *   SubsquidVesting indexed vesting,
 *   address indexed beneficiary,
 *   uint64 startTimestamp,
 *   uint64 durationSeconds,
 *   uint256 expectedTotalAmount
 * )
 */
import { type Abi, type Log, decodeEventLog } from 'viem';

import { type EntityStore, addToSetMap } from '../entities';

export function applyVestingFactoryLog(store: EntityStore, abi: Abi, log: Log): void {
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
    startTimestamp: bigint;
    durationSeconds: bigint;
    expectedTotalAmount: bigint;
  };
  const id = args.vesting.toLowerCase();
  const beneficiary = args.beneficiary.toLowerCase();
  store.vestings.set(id, {
    id,
    beneficiaryId: beneficiary,
    startTimestamp: args.startTimestamp,
    durationSeconds: args.durationSeconds,
    expectedTotalAmount: args.expectedTotalAmount,
  });
  addToSetMap(store.vestingsByBeneficiary, beneficiary, id);
}

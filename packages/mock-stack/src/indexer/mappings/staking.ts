/**
 * Project Staking events into the delegation entity store.
 *
 * Events handled:
 *   Deposited(uint256 indexed worker, address indexed staker, uint256 amount)
 *   Withdrawn(uint256 indexed worker, address indexed staker, uint256 amount)
 *
 * Rewarded / Claimed are observed but their mapping is left for the rewards
 * resolver path (synthetic for now).
 */
import { type Abi, type Log, decodeEventLog } from 'viem';

import { type EntityStore, addToSetMap, delegationKey } from '../entities';

export function applyStakingLog(store: EntityStore, abi: Abi, log: Log): void {
  let decoded: { eventName: string; args: unknown };
  try {
    decoded = decodeEventLog({ abi, data: log.data, topics: log.topics }) as {
      eventName: string;
      args: unknown;
    };
  } catch {
    return;
  }

  const blockNumber = log.blockNumber ?? 0n;

  switch (decoded.eventName) {
    case 'Deposited': {
      const args = decoded.args as unknown as {
        worker: bigint;
        staker: `0x${string}`;
        amount: bigint;
      };
      const owner = args.staker.toLowerCase();
      const key = delegationKey(args.worker, owner);
      const existing = store.delegations.get(key);
      if (existing) {
        existing.deposit += args.amount;
        existing.updatedAtBlock = blockNumber;
      } else {
        store.delegations.set(key, {
          workerId: args.worker,
          ownerId: owner,
          deposit: args.amount,
          updatedAtBlock: blockNumber,
        });
        addToSetMap(store.delegationsByOwner, owner, key);
        addToSetMap(store.delegationsByWorker, args.worker, key);
      }
      return;
    }

    case 'Withdrawn': {
      const args = decoded.args as unknown as {
        worker: bigint;
        staker: `0x${string}`;
        amount: bigint;
      };
      const owner = args.staker.toLowerCase();
      const key = delegationKey(args.worker, owner);
      const existing = store.delegations.get(key);
      if (!existing) return;
      existing.deposit -= args.amount;
      if (existing.deposit < 0n) existing.deposit = 0n;
      existing.updatedAtBlock = blockNumber;
      return;
    }

    default:
      return;
  }
}

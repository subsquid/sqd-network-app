/**
 * Project WorkerRegistration events into the entity store.
 *
 * Events handled:
 *   WorkerRegistered(uint256 indexed workerId, bytes peerId, address indexed registrar, uint256 registeredAt, string metadata)
 *   WorkerDeregistered(uint256 indexed workerId, address indexed account, uint256 deregistedAt)
 *   MetadataUpdated(uint256 indexed workerId, string metadata)
 *
 * Pure: each function mutates the passed-in `EntityStore`. Mapping logic
 * stays free of viem helper imports beyond `decodeEventLog` so it's easy
 * to unit-test in isolation.
 */
import { type Abi, type Log, decodeEventLog } from 'viem';

import {
  type EntityStore,
  type WorkerEntity,
  addToSetMap,
} from '../entities';

export function applyWorkerRegistrationLog(
  store: EntityStore,
  abi: Abi,
  log: Log,
): void {
  let decoded: { eventName: string; args: unknown };
  try {
    decoded = decodeEventLog({ abi, data: log.data, topics: log.topics }) as {
      eventName: string;
      args: unknown;
    };
  } catch {
    return; // Unknown event for this contract — ignore.
  }

  const blockNumber = log.blockNumber ?? 0n;

  switch (decoded.eventName) {
    case 'WorkerRegistered': {
      const args = decoded.args as unknown as {
        workerId: bigint;
        peerId: `0x${string}`;
        registrar: `0x${string}`;
        registeredAt: bigint;
        metadata: string;
      };
      const owner = args.registrar.toLowerCase();
      const entity: WorkerEntity = {
        id: args.workerId,
        peerId: args.peerId,
        ownerId: owner,
        registeredAtBlock: blockNumber,
        registeredAtTimestamp: args.registeredAt,
        deregisteredAtBlock: null,
        metadata: args.metadata,
      };
      store.workers.set(args.workerId, entity);
      // peerId hex is the canonical lookup key (a `0x…` string is unambiguous).
      store.workersByPeerId.set(args.peerId.toLowerCase(), args.workerId);
      addToSetMap(store.workersByOwner, owner, args.workerId);
      return;
    }

    case 'WorkerDeregistered': {
      const args = decoded.args as unknown as {
        workerId: bigint;
        account: `0x${string}`;
        deregistedAt: bigint;
      };
      const existing = store.workers.get(args.workerId);
      if (!existing) return;
      store.workers.set(args.workerId, {
        ...existing,
        deregisteredAtBlock: blockNumber,
      });
      return;
    }

    case 'MetadataUpdated': {
      const args = decoded.args as unknown as { workerId: bigint; metadata: string };
      const existing = store.workers.get(args.workerId);
      if (!existing) return;
      store.workers.set(args.workerId, { ...existing, metadata: args.metadata });
      return;
    }

    default:
      return;
  }
}

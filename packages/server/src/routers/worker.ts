import { BigNumber } from 'bignumber.js';
import { z } from 'zod';

import {
  AllWorkersDocument,
  type AllWorkersQuery,
  MyDelegationsDocument,
  type MyDelegationsQuery,
  MyWorkersCountDocument,
  type MyWorkersCountQuery,
  MyWorkersDocument,
  type MyWorkersQuery,
  WorkerByPeerIdDocument,
  type WorkerByPeerIdQuery,
  WorkerDelegationInfoDocument,
  type WorkerDelegationInfoQuery,
} from '../generated/workers-squid/graphql.js';
import {
  buildOwnerMap,
  reconstructOwner,
  resolveAccountIds,
  resolveAccounts,
} from '../services/accounts.js';
import { queryWorkersSquid } from '../services/graphql.js';
import { publicProcedure, router } from '../trpc.js';
import { bigintStringSchema, evmAddressSchema } from '../validation.js';

function calculateDelegationCapacity(totalDelegation: string): number {
  return BigNumber(totalDelegation).div(20_000).shiftedBy(-18).times(100).toNumber();
}

export const workerRouter = router({
  list: publicProcedure.query(async () => {
    const data = await queryWorkersSquid<AllWorkersQuery>(AllWorkersDocument);
    return data.workers.map(w => ({
      ...w,
      owner: reconstructOwner(w.ownerId, new Map()),
      delegationCapacity: calculateDelegationCapacity(w.totalDelegation),
    }));
  }),

  get: publicProcedure
    .input(z.object({ peerId: z.string(), address: evmAddressSchema.optional() }))
    .query(async ({ input }) => {
      const accounts = input.address ? await resolveAccounts(input.address) : [];
      const ownerMap = buildOwnerMap(accounts);
      const ownerIds = accounts.map(a => a.id);

      const data = await queryWorkersSquid<WorkerByPeerIdQuery>(WorkerByPeerIdDocument, {
        peerId: input.peerId,
        ownerIds: ownerIds.length ? ownerIds : undefined,
      });
      return data.workers.map(w => ({
        ...w,
        owner: ownerIds.length
          ? reconstructOwner(w.ownerId, ownerMap)
          : { id: w.ownerId, type: 'USER' as const, owner: null },
        delegations: w.delegations.map(d => ({
          ...d,
          owner: reconstructOwner(d.ownerId, ownerMap),
        })),
        delegationCapacity: calculateDelegationCapacity(w.totalDelegation),
        totalReward: BigNumber(w.claimedReward).plus(w.claimableReward).toFixed(),
      }));
    }),

  listMine: publicProcedure
    .input(z.object({ address: evmAddressSchema }))
    .query(async ({ input }) => {
      const accounts = await resolveAccounts(input.address);
      if (!accounts.length) return [];

      const ownerMap = buildOwnerMap(accounts);
      const ownerIds = accounts.map(a => a.id);
      const data = await queryWorkersSquid<MyWorkersQuery>(MyWorkersDocument, { ownerIds });
      return data.workers.map(w => ({
        ...w,
        owner: reconstructOwner(w.ownerId, ownerMap),
        totalReward: BigNumber(w.claimedReward).plus(w.claimableReward).toFixed(),
      }));
    }),

  countMine: publicProcedure
    .input(z.object({ address: evmAddressSchema }))
    .query(async ({ input }) => {
      const ownerIds = await resolveAccountIds(input.address);
      if (!ownerIds.length) return 0;

      const data = await queryWorkersSquid<MyWorkersCountQuery>(MyWorkersCountDocument, {
        ownerIds,
      });
      return data.workersConnection.totalCount;
    }),

  delegations: publicProcedure
    .input(
      z.object({
        address: evmAddressSchema,
        peerId: z.string().trim().min(1).optional(),
      }),
    )
    .query(async ({ input }) => {
      const accounts = await resolveAccounts(input.address);
      if (!accounts.length) return [];

      const ownerMap = buildOwnerMap(accounts);
      const ownerIds = accounts.map(a => a.id);
      const data = await queryWorkersSquid<MyDelegationsQuery>(MyDelegationsDocument, {
        ownerIds,
        peerId: input.peerId,
      });
      return data.workers.map(w => ({
        ...w,
        owner: reconstructOwner(w.ownerId, ownerMap),
        delegationCapacity: calculateDelegationCapacity(w.totalDelegation),
        delegations: w.delegations.map(d => ({
          ...d,
          owner: reconstructOwner(d.ownerId, ownerMap),
        })),
        myDelegation: w.delegations.reduce(
          (sum, d) => BigNumber(sum).plus(d.deposit).toFixed(),
          '0',
        ),
        myTotalDelegationReward: w.delegations.reduce(
          (sum, d) => BigNumber(sum).plus(d.claimableReward).plus(d.claimedReward).toFixed(),
          '0',
        ),
      }));
    }),

  delegationInfo: publicProcedure
    .input(z.object({ workerId: bigintStringSchema }))
    .query(async ({ input }) => {
      const data = await queryWorkersSquid<WorkerDelegationInfoQuery>(
        WorkerDelegationInfoDocument,
        input,
      );
      return { worker: data.workerById, info: data.settings[0] };
    }),
});

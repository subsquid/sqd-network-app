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
} from '../generated/network-squid/graphql.js';
import { queryNetworkSquid } from '../services/graphql.js';
import { publicProcedure, router } from '../trpc.js';
import { bigintStringSchema, evmAddressSchema } from '../validation.js';

function calculateDelegationCapacity(totalDelegation: string): number {
  return BigNumber(totalDelegation).div(20_000_000_000_000_000_000n).times(100).toNumber();
}

export const workerRouter = router({
  list: publicProcedure.query(async () => {
    const data = await queryNetworkSquid<AllWorkersQuery>(AllWorkersDocument);
    return data.workers.map(w => ({
      ...w,
      delegationCapacity: calculateDelegationCapacity(w.totalDelegation),
    }));
  }),

  get: publicProcedure
    .input(z.object({ peerId: z.string(), address: evmAddressSchema.optional() }))
    .query(async ({ input }) => {
      const data = await queryNetworkSquid<WorkerByPeerIdQuery>(WorkerByPeerIdDocument, input);
      return data.workers.map(w => ({
        ...w,
        delegationCapacity: calculateDelegationCapacity(w.totalDelegation),
        totalReward: BigNumber(w.claimedReward).plus(w.claimableReward).toFixed(),
      }));
    }),

  listMine: publicProcedure
    .input(z.object({ address: evmAddressSchema }))
    .query(async ({ input }) => {
      const data = await queryNetworkSquid<MyWorkersQuery>(MyWorkersDocument, input);
      return data.workers.map(w => ({
        ...w,
        totalReward: BigNumber(w.claimedReward).plus(w.claimableReward).toFixed(),
      }));
    }),

  countMine: publicProcedure
    .input(z.object({ address: evmAddressSchema }))
    .query(async ({ input }) => {
      const data = await queryNetworkSquid<MyWorkersCountQuery>(MyWorkersCountDocument, input);
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
      const data = await queryNetworkSquid<MyDelegationsQuery>(MyDelegationsDocument, input);
      return data.workers.map(w => ({
        ...w,
        delegationCapacity: calculateDelegationCapacity(w.totalDelegation),
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
      const data = await queryNetworkSquid<WorkerDelegationInfoQuery>(
        WorkerDelegationInfoDocument,
        input,
      );
      return { worker: data.workerById, info: data.settings[0] };
    }),
});

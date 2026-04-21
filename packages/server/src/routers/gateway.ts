import { z } from 'zod';

import {
  GatewayByPeerIdDocument,
  type GatewayByPeerIdQuery,
  MyGatewayStakesDocument,
  type MyGatewayStakesQuery,
  MyGatewaysDocument,
  type MyGatewaysQuery,
} from '../generated/gateways-squid/graphql.js';
import {
  WorkersSummaryDocument,
  type WorkersSummaryQuery,
} from '../generated/workers-squid/graphql.js';
import { resolveAccountIds } from '../services/accounts.js';
import { queryGatewaysSquid, queryWorkersSquid } from '../services/graphql.js';
import { publicProcedure, router } from '../trpc.js';
import { evmAddressSchema } from '../validation.js';

export const gatewayRouter = router({
  listMine: publicProcedure
    .input(z.object({ address: evmAddressSchema }))
    .query(async ({ input }) => {
      const data = await queryGatewaysSquid<MyGatewaysQuery>(MyGatewaysDocument, input);
      return data.gateways;
    }),

  get: publicProcedure.input(z.object({ peerId: z.string() })).query(async ({ input }) => {
    const data = await queryGatewaysSquid<GatewayByPeerIdQuery>(GatewayByPeerIdDocument, input);
    return data.gatewayById;
  }),

  stakes: publicProcedure
    .input(z.object({ address: evmAddressSchema }))
    .query(async ({ input }) => {
      const ownerIds = await resolveAccountIds(input.address);
      if (!ownerIds.length) return { stakes: [], networkStats: null };

      const [stakesData, summaryData] = await Promise.all([
        queryGatewaysSquid<MyGatewayStakesQuery>(MyGatewayStakesDocument, { ownerIds }),
        queryWorkersSquid<WorkersSummaryQuery>(WorkersSummaryDocument),
      ]);

      return {
        stakes: stakesData.gatewayStakes,
        networkStats: {
          blockTimeL1: summaryData.workersSummary.blockTimeL1,
          lastBlockL1: summaryData.workersSummary.lastBlockL1,
          lastBlockTimestampL1: summaryData.workersSummary.lastBlockTimestampL1,
        },
      };
    }),
});

import { z } from 'zod';

import {
  GatewayByPeerIdDocument,
  type GatewayByPeerIdQuery,
  MyGatewayStakesDocument,
  type MyGatewayStakesQuery,
  MyGatewaysDocument,
  type MyGatewaysQuery,
} from '../generated/network-squid/graphql.js';
import { queryNetworkSquid } from '../services/graphql.js';
import { publicProcedure, router } from '../trpc.js';
import { evmAddressSchema } from '../validation.js';

export const gatewayRouter = router({
  listMine: publicProcedure
    .input(z.object({ address: evmAddressSchema }))
    .query(async ({ input }) => {
      const data = await queryNetworkSquid<MyGatewaysQuery>(MyGatewaysDocument, input);
      return data.gateways;
    }),

  get: publicProcedure.input(z.object({ peerId: z.string() })).query(async ({ input }) => {
    const data = await queryNetworkSquid<GatewayByPeerIdQuery>(GatewayByPeerIdDocument, input);
    return data.gatewayById;
  }),

  stakes: publicProcedure
    .input(z.object({ address: evmAddressSchema }))
    .query(async ({ input }) => {
      const data = await queryNetworkSquid<MyGatewayStakesQuery>(MyGatewayStakesDocument, input);
      return {
        stakes: data.gatewayStakes,
        networkStats: data.networkStats,
      };
    }),
});

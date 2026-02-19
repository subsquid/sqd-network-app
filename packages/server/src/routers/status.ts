import {
  SquidNetworkHeightDocument,
  type SquidNetworkHeightQuery,
} from '../generated/network-squid/graphql.js';
import { queryNetworkSquid } from '../services/graphql.js';
import { publicProcedure, router } from '../trpc.js';

export const statusRouter = router({
  get: publicProcedure.query(async () => {
    const data = await queryNetworkSquid<SquidNetworkHeightQuery>(SquidNetworkHeightDocument);
    return data.squidStatus;
  }),
});

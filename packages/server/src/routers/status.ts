import {
  SquidNetworkHeightDocument,
  type SquidNetworkHeightQuery,
} from '../generated/workers-squid/graphql.js';
import { queryWorkersSquid } from '../services/graphql.js';
import { publicProcedure, router } from '../trpc.js';

export const statusRouter = router({
  get: publicProcedure.query(async () => {
    const data = await queryWorkersSquid<SquidNetworkHeightQuery>(SquidNetworkHeightDocument);
    return data.squidStatus;
  }),
});

import { router } from './trpc.js';
import { accountRouter } from './routers/account.js';
import { contractRouter } from './routers/contract.js';
import { gatewayRouter } from './routers/gateway.js';
import { networkRouter } from './routers/network.js';
import { poolRouter } from './routers/pool.js';
import { priceRouter } from './routers/price.js';
import { timeseriesRouter } from './routers/timeseries.js';
import { workerRouter } from './routers/worker.js';

export const appRouter = router({
  network: networkRouter,
  worker: workerRouter,
  gateway: gatewayRouter,
  account: accountRouter,
  pool: poolRouter,
  price: priceRouter,
  contract: contractRouter,
  timeseries: timeseriesRouter,
});

export type AppRouter = typeof appRouter;

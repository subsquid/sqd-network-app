import { createHTTPServer } from '@trpc/server/adapters/standalone';

import {
  getNetworkSquidUrl,
  getPoolSquidUrl,
  getContractAddresses,
  getRpcUrl,
  getPort,
} from './env.js';
import { appRouter } from './router.js';
import { createContext } from './trpc.js';

const port = getPort();

console.log(`Server port: ${port}`);
console.log(`Server environment: ${process.env.APP_ENV}`);
console.log(`Server network: ${process.env.NETWORK}`);
console.log(`Server squid url: ${getNetworkSquidUrl()}`);
console.log(`Server pool squid url: ${getPoolSquidUrl()}`);
console.log(`Server rpc url: ${getRpcUrl()}`);
console.log(
  `Server contract addresses: ${Object.entries(getContractAddresses())
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')}`,
);

const server = createHTTPServer({
  router: appRouter,
  createContext,
});

// biome-ignore lint/suspicious/noConsole: start indicator
server.listen(port, () => console.log(`Server is running on port ${port}`));

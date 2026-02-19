import { createHTTPServer } from '@trpc/server/adapters/standalone';

import { getPort } from './env.js';
import { appRouter } from './router.js';
import { createContext } from './trpc.js';

const port = getPort();

const server = createHTTPServer({
  router: appRouter,
  createContext,
});

// biome-ignore lint/suspicious/noConsole: start indicator
server.listen(port, () => console.log(`Server is running on port ${port}`));

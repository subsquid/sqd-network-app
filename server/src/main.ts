import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: resolve(import.meta.dirname, '../../.env') });

import { createHTTPServer } from '@trpc/server/adapters/standalone';

import { getPort } from './env.js';
import { appRouter } from './router.js';
import { createContext } from './trpc.js';

const port = getPort();

const server = createHTTPServer({
  router: appRouter,
  createContext,
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

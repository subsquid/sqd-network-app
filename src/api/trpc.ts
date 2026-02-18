import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';

import type { AppRouter } from '../../server/src/router.js';

import { queryClient } from './client';

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

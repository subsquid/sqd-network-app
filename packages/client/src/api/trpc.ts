import type { AppRouter } from '@subsquid/server';
import { createTRPCClient, httpLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';

import { queryClient } from './client';

const TRPC_REQUEST_TIMEOUT_MS = 5_000;

async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  let timedOut = false;

  if (init?.signal) {
    if (init.signal.aborted) {
      controller.abort();
    } else {
      init.signal.addEventListener('abort', onAbort, { once: true });
    }
  }

  try {
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, TRPC_REQUEST_TIMEOUT_MS);

    try {
      return await fetch(input, {
        ...init,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    if (timedOut && !(init?.signal?.aborted ?? false)) {
      throw new Error(`Request timed out after ${TRPC_REQUEST_TIMEOUT_MS / 1000}s`);
    }

    throw error;
  } finally {
    init?.signal?.removeEventListener('abort', onAbort);
  }
}

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: '/api/trpc',
      fetch: fetchWithTimeout,
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

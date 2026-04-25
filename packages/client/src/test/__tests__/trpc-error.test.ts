/**
 * Phase 9 reference: MSW v2 forces a tRPC error response and we observe
 * the typed error in a `query()` call.
 *
 * The spec deliberately does NOT depend on any of the app's UI surface —
 * exercising the harness in isolation is the cheapest way to keep the
 * error-injection contract honest. UI specs that need an error fallback
 * should follow this pattern: `mswServer.use(trpcError(...))` for the
 * scope of the assertion, then `mswServer.resetHandlers()` (handled by
 * Phase 1's afterEach cleanup helpers when this graduates to integration).
 */
import type { AppRouter } from '@subsquid/server';
import { TRPCClientError, createTRPCClient, httpLink } from '@trpc/client';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { mswServer, resetMswHandlers, startMsw, stopMsw } from '../msw/server';
import { trpcError } from '../msw/trpc-error-handlers';

const FAKE_BASE = 'http://msw.invalid/api';

beforeAll(() => startMsw());
afterEach(() => resetMswHandlers());
afterAll(() => stopMsw());

describe('msw + tRPC error injection', () => {
  it('surfaces a forced INTERNAL_SERVER_ERROR through the tRPC client', async () => {
    mswServer.use(
      trpcError('status.get', {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Forced for test',
      }),
    );

    const client = createTRPCClient<AppRouter>({
      links: [httpLink({ url: FAKE_BASE })],
    });

    let thrown: unknown;
    try {
      await client.status.get.query();
    } catch (err) {
      thrown = err;
    }
    expect(thrown).toBeInstanceOf(TRPCClientError);
    if (thrown instanceof TRPCClientError) {
      expect(thrown.message).toContain('Forced for test');
      expect(thrown.data?.code).toBe('INTERNAL_SERVER_ERROR');
    }
  });
});

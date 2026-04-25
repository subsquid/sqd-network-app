/**
 * Layer-2 integration smoke test.
 *
 * Spins up a tRPC client against the in-process server booted by
 * `src/test/anvil/global-setup.ts` and asserts that:
 *   - the `status.get` query returns a height (proves tRPC → server →
 *     mockGraphqlServer/mockGraphqlServer fallback round-trips work).
 *
 * No React, no jsdom-specific setup needed — but we live in the
 * `integration` Vitest project so we share the global anvil + indexer
 * + tRPC bootstrap with future component-level integration specs.
 */
import type { AppRouter } from '@subsquid/server';
import { createTRPCClient, httpLink } from '@trpc/client';
import { describe, expect, inject, it } from 'vitest';

import '../anvil/types';

function makeClient() {
  return createTRPCClient<AppRouter>({
    links: [httpLink({ url: inject('trpcUrl') })],
  });
}

describe('integration: tRPC + mock-stack round-trip', () => {
  it('status.get resolves the squid network height', async () => {
    const client = makeClient();
    const status = await client.status.get.query();
    expect(status).toMatchObject({ height: expect.any(Number) });
    expect(status.height).toBeGreaterThan(0);
  });
});

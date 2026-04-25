/**
 * Layer-1 spec for the no-reload account switch (Phase 10).
 *
 * Calls the mock connector's `onAccountsChanged` directly with a re-ordered
 * address list and asserts that `useAccount().address` reactively reflects
 * the new index-0 entry — no React tree remount, no `window.location.reload()`.
 *
 * The Phase 10 commit replaces the reload-based MockConnectDialog with the
 * same pattern; this test guards the pattern itself so a future refactor
 * doesn't silently regress it.
 */

import type { ReactNode } from 'react';
import { act } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { Address } from 'viem';
import { describe, expect, it } from 'vitest';
import { WagmiProvider, useAccount } from 'wagmi';

import { TEST_ACCOUNTS, connectMockConnector, createUnitWagmiConfig } from '../wagmi/testConfig';

function wrapper(config: ReturnType<typeof createUnitWagmiConfig>) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    );
  };
}

describe('mock connector no-reload account switch', () => {
  it('emits accountsChanged and useAccount() updates without remount', async () => {
    const config = createUnitWagmiConfig({
      rpcMap: { eth_chainId: () => '0xa4b1' },
    });
    await connectMockConnector(config);

    const { result } = renderHook(() => useAccount(), { wrapper: wrapper(config) });
    await waitFor(() => expect(result.current.isConnected).toBe(true));
    expect(result.current.address).toBe(TEST_ACCOUNTS[0]);

    // Pick the third persona — re-order so it sits at index 0.
    const target = TEST_ACCOUNTS[2];
    const reordered: Address[] = [target, ...TEST_ACCOUNTS.filter(a => a !== target)];

    const connector = config.connectors[0] as unknown as {
      onAccountsChanged?: (a: readonly `0x${string}`[]) => void;
    };
    expect(connector.onAccountsChanged).toBeDefined();

    await act(async () => {
      connector.onAccountsChanged?.(reordered);
    });

    await waitFor(() => {
      expect(result.current.address).toBe(target);
    });
  });
});

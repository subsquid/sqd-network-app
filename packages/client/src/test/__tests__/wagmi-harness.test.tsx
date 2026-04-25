/**
 * Layer-1 reference tests for the wagmi/viem test harness.
 *
 * These exercise the test infrastructure introduced in Phase 3:
 *   - `createUnitWagmiConfig()` boots a wagmi config with the mock connector
 *     pre-configured against the four fixture personas.
 *   - `connectMockConnector(config)` flips the wagmi store to a connected
 *     state up-front so hooks observe `isConnected: true` on first render.
 *   - `makeCannedTransport()` answers JSON-RPC method calls with deterministic
 *     fixtures so hook tests assert against known outputs.
 *
 * They are NOT exhaustive coverage of any real hook — those will follow as
 * each layer-1 worthy hook gets a dedicated spec. The goal here is to prove
 * the harness works end-to-end.
 */

import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { encodeAbiParameters, keccak256, toHex } from 'viem';
import { describe, expect, it } from 'vitest';
import { WagmiProvider, useAccount, useReadContract } from 'wagmi';

import { TEST_ACCOUNTS, connectMockConnector, createUnitWagmiConfig } from '../wagmi/testConfig';

// erc20 `decimals()` selector — first 4 bytes of keccak256("decimals()").
// Computed at boot so the test self-documents how it derives selectors and
// stays robust to keccak ABI tweaks.
const DECIMALS_SELECTOR = keccak256(toHex('decimals()')).slice(0, 10);

const TOKEN: `0x${string}` = '0x0000000000000000000000000000000000000abc';

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

describe('wagmi test harness', () => {
  it('useAccount reports the first fixture address as connected', async () => {
    const config = createUnitWagmiConfig({
      rpcMap: { eth_chainId: () => '0xa4b1' },
    });
    await connectMockConnector(config);

    const { result } = renderHook(() => useAccount(), { wrapper: wrapper(config) });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
    expect(result.current.address).toBe(TEST_ACCOUNTS[0]);
    expect(result.current.addresses).toEqual(TEST_ACCOUNTS);
  });

  it('useReadContract resolves with a value canned by the test transport', async () => {
    // 18 ABI-encoded as uint8.
    const decimalsResponse = encodeAbiParameters([{ type: 'uint8' }], [18]);

    const config = createUnitWagmiConfig({
      rpcMap: {
        // viem dispatches eth_call with [{ to, data }, blockTag] — the canned
        // map only inspects `data` so we don't have to special-case blockTag.
        eth_call: ([call]) => {
          const { data } = call as { data: `0x${string}` };
          if (data === DECIMALS_SELECTOR) return decimalsResponse;
          throw new Error(`Unexpected eth_call data ${data}`);
        },
        eth_chainId: () => '0xa4b1',
        eth_blockNumber: () => '0x1',
      },
    });
    await connectMockConnector(config);

    const { result } = renderHook(
      () =>
        useReadContract({
          address: TOKEN,
          abi: [
            {
              type: 'function',
              name: 'decimals',
              stateMutability: 'view',
              inputs: [],
              outputs: [{ type: 'uint8' }],
            },
          ] as const,
          functionName: 'decimals',
        }),
      { wrapper: wrapper(config) },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toBe(18);
  });
});

import type { Address, Transport } from 'viem';
import { type Config, createConfig, http } from 'wagmi';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';

import { type CannedRpcMap, makeCannedTransport } from './customTransport';

/**
 * Hardhat well-known dev addresses — mirror `MOCK_FIXTURE_ACCOUNTS` from
 * src/config.ts so unit tests use the exact accounts that the rest of the
 * mock environment uses.
 */
export const TEST_ACCOUNTS = [
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
] as const satisfies readonly Address[];

export interface UnitWagmiConfigOpts {
  /** Account list passed to the wagmi mock connector. Defaults to `TEST_ACCOUNTS`. */
  accounts?: readonly [Address, ...Address[]];
  /** Whether the connector should boot already connected. */
  defaultConnected?: boolean;
  /** Map of canned RPC handlers, applied via a viem `custom` transport. */
  rpcMap?: CannedRpcMap;
  /** Override transport (mutually exclusive with `rpcMap`). */
  transport?: Transport;
  /** Chain to target — defaults to arbitrum mainnet. */
  chain?: typeof arbitrum | typeof arbitrumSepolia;
}

/**
 * Build a wagmi `Config` for Layer-1 unit / hook tests.
 *
 * Defaults:
 * - 4 mock accounts (the same fixture personas we use in dev).
 * - Connector starts connected (most hook tests assume `useAccount().isConnected === true`).
 * - Transport: throws on every RPC method unless `rpcMap` overrides specific ones.
 *   This is deliberately strict — silent fallthroughs hide bugs.
 */
export function createUnitWagmiConfig(opts: UnitWagmiConfigOpts = {}): Config {
  const accounts = (opts.accounts ?? TEST_ACCOUNTS) as [Address, ...Address[]];
  const chain = opts.chain ?? arbitrum;
  const transport =
    opts.transport ?? (opts.rpcMap ? makeCannedTransport(opts.rpcMap) : http('http://invalid'));

  // wagmi widens the transports map to all chains the lib knows about; supply
  // the same transport for both so TS doesn't complain about a missing key.
  return createConfig({
    chains: [arbitrum, arbitrumSepolia],
    connectors: [
      mock({
        accounts,
        features: {
          defaultConnected: opts.defaultConnected ?? true,
          reconnect: opts.defaultConnected ?? true,
        },
      }),
    ],
    transports: {
      [arbitrum.id]: chain.id === arbitrum.id ? transport : http('http://invalid'),
      [arbitrumSepolia.id]: chain.id === arbitrumSepolia.id ? transport : http('http://invalid'),
    },
  });
}

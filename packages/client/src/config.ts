import { type Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  baseAccount,
  coinbaseWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { upperFirst } from 'lodash-es';
import type { Address } from 'viem';
import { type Config, createConfig, fallback, http, mock } from 'wagmi';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';

import { NetworkName, getSubsquidNetwork } from './hooks/network/useSubsquidNetwork';

const network = getSubsquidNetwork();

/**
 * True when the full mock environment is active (MOCK_WALLET=true at build time).
 * Drives the `mode` argument to `createAppWagmiConfig()` plus a handful of
 * mock-only UI affordances (e.g. the disconnect menu item label).
 */
export const isMockMode = process.env.MOCK_WALLET === 'true';

/**
 * Fixture accounts available when MOCK_WALLET=true.
 * Must stay in sync with packages/server/src/services/mockRpcServer.ts MOCK_ACCOUNTS.
 * These are the well-known Hardhat test addresses.
 */
export const MOCK_FIXTURE_ACCOUNTS: readonly {
  address: Address;
  label: string;
  description: string;
}[] = [
  {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    label: 'Alice (empty)',
    description: 'Fresh account — no SQD, no delegations, no workers',
  },
  {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    label: 'Bob (delegator)',
    description: 'Has 50 000 SQD delegated to a worker',
  },
  {
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    label: 'Carol (worker operator)',
    description: 'Owns 2 registered workers, 100 000 SQD bonded',
  },
  {
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    label: 'Dave (vesting)',
    description: 'Has 1 000 000 SQD in a vesting contract',
  },
] as const;

/** Mock RPC URL — the in-process JSON-RPC server started by the dev server. */
export const MOCK_RPC_URL = process.env.MOCK_RPC_URL || 'http://localhost:8545';

const SESSION_KEY = 'mock:account:index';

/** Returns the account index stored in sessionStorage, defaulting to -1 (no selection yet). */
export function getMockAccountIndex(): number {
  try {
    const v = sessionStorage.getItem(SESSION_KEY);
    return v !== null ? Number(v) : -1;
  } catch {
    return -1;
  }
}

/** Persists the selected account index to sessionStorage. */
export function setMockAccountIndex(index: number): void {
  try {
    sessionStorage.setItem(SESSION_KEY, String(index));
  } catch {
    // ignore
  }
}

/** Clears the stored account selection (used on disconnect). */
export function clearMockAccountIndex(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Wagmi config factory
// ---------------------------------------------------------------------------

export type AppMode = 'live' | 'mock';

export interface AppWagmiConfigOpts {
  /** Selects between the RainbowKit-backed live config and the wagmi-mock config. */
  mode: AppMode;
  /** Selected Subsquid network (mainnet → arbitrum, tethys → arbitrumSepolia). */
  network: NetworkName;
  /** WalletConnect v2 project id, used only when `mode === 'live'`. */
  walletConnectProjectId?: string;
  /** RPC URL for the mock JSON-RPC server (default: `MOCK_RPC_URL`). */
  mockRpcUrl?: string;
  /**
   * Optional Multicall3 contract address override (mock-stack deploys to
   * a non-canonical address). Only honoured in mock mode.
   */
  multicall3Override?: Address;
  /**
   * Account list passed to the wagmi mock connector. Defaults to the four
   * `MOCK_FIXTURE_ACCOUNTS` addresses, with the persisted-selection re-ordered
   * to index 0 when present.
   */
  mockAccounts?: readonly Address[];
}

/** Apply a Multicall3 address override to a chain object. */
function withMulticall3Override<T extends Chain>(chain: T, address?: Address): T {
  if (!address) return chain;
  return {
    ...chain,
    contracts: {
      ...(chain.contracts ?? {}),
      multicall3: { address, blockCreated: 0 },
    },
  };
}

/** Resolve the chain (with optional Multicall3 override) for the active network. */
function resolveChain(selected: NetworkName, multicall3Override?: Address): Chain {
  const base = selected === NetworkName.Mainnet ? arbitrum : arbitrumSepolia;
  return withMulticall3Override(base, multicall3Override);
}

function buildMockConfig(opts: AppWagmiConfigOpts): Config {
  const rpcUrl = opts.mockRpcUrl ?? MOCK_RPC_URL;

  // If the user has previously selected a persona, hoist that address to
  // index 0 so wagmi reports it as the connected address.
  const selectedIndex = getMockAccountIndex();
  const fixtureAddrs = MOCK_FIXTURE_ACCOUNTS.map(a => a.address);
  const baseAccounts = (opts.mockAccounts ?? fixtureAddrs) as Address[];
  const hasSelection = selectedIndex >= 0 && selectedIndex < baseAccounts.length;
  const accounts = hasSelection
    ? ([baseAccounts[selectedIndex]] as [Address, ...Address[]])
    : (baseAccounts as [Address, ...Address[]]);

  const chain = resolveChain(opts.network, opts.multicall3Override);

  return createConfig({
    chains: [chain],
    connectors: [
      mock({
        accounts,
        features: {
          defaultConnected: hasSelection,
          reconnect: hasSelection,
        },
      }),
    ],
    transports: {
      [chain.id]: http(rpcUrl),
    },
  });
}

function buildLiveConfig(opts: AppWagmiConfigOpts): Config {
  const chain = resolveChain(opts.network);
  return getDefaultConfig({
    appName: `Subsquid Network ${upperFirst(opts.network)}`,
    projectId: opts.walletConnectProjectId ?? '',
    transports: {
      [chain.id]: fallback([http()]),
    },
    chains: [chain],
    wallets: [
      {
        groupName: 'Popular',
        wallets: [
          metaMaskWallet,
          rabbyWallet,
          safeWallet,
          rainbowWallet,
          baseAccount,
          trustWallet,
          coinbaseWallet,
          walletConnectWallet,
        ],
      },
    ],
  });
}

/**
 * Build the wagmi `Config` used by the app, based on whether the mock
 * environment is active. Keep this function pure — its result is meant to be
 * memoised once per app boot in `App.tsx`, with all environment lookups
 * collected at the call site (NOT here).
 *
 * Test code can call this with arbitrary options to obtain a config that
 * matches the production tree exactly, sidestepping module-level singletons.
 */
export function createAppWagmiConfig(opts: AppWagmiConfigOpts): Config {
  return opts.mode === 'mock' ? buildMockConfig(opts) : buildLiveConfig(opts);
}

// Back-compat: a few callers (and the integration test harness) still want
// the network the config was built for without re-deriving it.
export { network as currentNetwork };

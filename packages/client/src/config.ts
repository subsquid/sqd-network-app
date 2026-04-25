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
 * True when this bundle was built with `pnpm mock` (vite's `--mode mock`
 * flag injects `process.env.MOCK = 'true'`).
 *
 * Drives:
 *   - `createAppWagmiConfig`'s mode argument
 *   - the Connect Wallet button picking the mock dialog
 *   - the disconnect menu clearing the persisted persona index
 */
export const isMockMode = process.env.MOCK === 'true';

/** RPC URL used by the mock wagmi config — talks to the in-process mock RPC. */
const MOCK_RPC_URL = 'http://localhost:8545';

/**
 * Fixture accounts available in mock mode. Mirror
 * `packages/server/src/services/mockRpcServer.ts` MOCK_ACCOUNTS — these are
 * the well-known Hardhat / anvil dev addresses.
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

const SESSION_KEY = 'mock:account:index';

/** Returns the account index stored in sessionStorage, defaulting to -1. */
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

export interface AppWagmiConfigOpts {
  /** Selected Subsquid network (mainnet → arbitrum, tethys → arbitrumSepolia). */
  network: NetworkName;
  /** WalletConnect v2 project id, used only in live mode. */
  walletConnectProjectId?: string;
  /**
   * Optional Multicall3 contract address override (the mock-stack deploys
   * Multicall3 to a non-canonical address). Only honoured in mock mode.
   */
  multicall3Override?: Address;
}

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

function resolveChain(selected: NetworkName, multicall3Override?: Address): Chain {
  const base = selected === NetworkName.Mainnet ? arbitrum : arbitrumSepolia;
  return withMulticall3Override(base, multicall3Override);
}

function buildMockConfig(opts: AppWagmiConfigOpts): Config {
  const selectedIndex = getMockAccountIndex();
  const fixtureAddrs = MOCK_FIXTURE_ACCOUNTS.map(a => a.address);
  const hasSelection = selectedIndex >= 0 && selectedIndex < fixtureAddrs.length;
  const accounts = hasSelection
    ? ([fixtureAddrs[selectedIndex]] as [Address, ...Address[]])
    : (fixtureAddrs as [Address, ...Address[]]);

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
      [chain.id]: http(MOCK_RPC_URL),
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
 * Build the wagmi `Config` used by the app. Branches on the build-time
 * `isMockMode` flag, so callers don't need to pass it explicitly.
 *
 * Tests use `createUnitWagmiConfig()` from `src/test/wagmi/testConfig.ts`
 * instead — that helper sidesteps this factory entirely so unit specs
 * don't depend on build-time defines.
 */
export function createAppWagmiConfig(opts: AppWagmiConfigOpts): Config {
  return isMockMode ? buildMockConfig(opts) : buildLiveConfig(opts);
}

// Back-compat: a few call sites still want the active network without
// re-deriving it.
export { network as currentNetwork };

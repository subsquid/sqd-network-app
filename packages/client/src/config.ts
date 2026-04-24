import { getDefaultConfig } from '@rainbow-me/rainbowkit';
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
import { createConfig, fallback, http, mock } from 'wagmi';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';

import { NetworkName, getSubsquidNetwork } from './hooks/network/useSubsquidNetwork';

// export let CHAIN: Chain = arbitrumSepolia;
// if (process.env.NETWORK === 'hardhat') {
//   CHAIN = {
//     ...hardhat,
//     contracts: {
//       multicall3: {
//         address: process.env.MULTICALL_3_CONTRACT_ADDRESS,
//       } as any,
//     },
//   };
// }

const network = getSubsquidNetwork();

/**
 * True when the full mock environment is active (MOCK_WALLET=true at build time).
 * Controls whether mockConfig is used instead of rainbowConfig in App.tsx.
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
const MOCK_RPC_URL = process.env.MOCK_RPC_URL || 'http://localhost:8545';

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

/**
 * Builds a wagmi config for mock mode.
 * If an account index has been persisted to sessionStorage (set by MockConnectDialog
 * before the app remounts), the connector starts connected to that account.
 * Otherwise the connector starts disconnected so the user must pick an account.
 *
 * The transport points at the local mock RPC server so reads/writes are handled
 * in-memory.  No RainbowKitProvider needed.
 */
function buildMockConfig() {
  const selectedIndex = getMockAccountIndex();
  const hasSelection = selectedIndex >= 0 && selectedIndex < MOCK_FIXTURE_ACCOUNTS.length;
  const accounts = hasSelection
    ? ([MOCK_FIXTURE_ACCOUNTS[selectedIndex].address] as [Address, ...Address[]])
    : (MOCK_FIXTURE_ACCOUNTS.map(a => a.address) as [Address, ...Address[]]);

  return createConfig({
    chains: network === NetworkName.Mainnet ? [arbitrum] : [arbitrumSepolia],
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
      [arbitrum.id]: http(MOCK_RPC_URL),
      [arbitrumSepolia.id]: http(MOCK_RPC_URL),
    },
  });
}

export const mockConfig = isMockMode ? buildMockConfig() : null;

export const rainbowConfig = getDefaultConfig({
  appName: `Subsquid Network ${upperFirst(network)}`,
  projectId: process.env.WALLET_CONNECT_PROJECT_ID || '',
  transports: {
    [arbitrum.id]: fallback([http()]),
    [arbitrumSepolia.id]: fallback([http()]),
  },
  chains: network === NetworkName.Mainnet ? [arbitrum] : [arbitrumSepolia],
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

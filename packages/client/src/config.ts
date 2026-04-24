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
 * The build-time env var address — empty string in production builds.
 * Exported so MockAccountSwitcher can use it as the fallback default.
 */
export const mockWalletAddress = (process.env.MOCK_WALLET_ADDRESS || '') as Address | '';

/**
 * Resolves the actual address to use for the mock connector.
 * Priority: localStorage override (set by MockAccountSwitcher) → env var.
 * This lets testers switch accounts without restarting the dev server.
 */
function resolveMockAddress(): Address | '' {
  if (!mockWalletAddress) return '';
  try {
    return (localStorage.getItem('mock:wallet:address') as Address) || mockWalletAddress;
  } catch {
    return mockWalletAddress;
  }
}

const activeMockAddress = resolveMockAddress();

/**
 * Lightweight wagmi config used when MOCK_WALLET_ADDRESS is set.
 * Uses wagmi's built-in mock connector — no WalletConnect, no browser extension required.
 * The mock connector's `defaultConnected` flag means the app starts pre-connected
 * without any user interaction.
 */
export const mockConfig = activeMockAddress
  ? createConfig({
      chains: network === NetworkName.Mainnet ? [arbitrum] : [arbitrumSepolia],
      connectors: [
        mock({
          accounts: [activeMockAddress],
          features: { defaultConnected: true, reconnect: true },
        }),
      ],
      transports: {
        [arbitrum.id]: fallback([http()]),
        [arbitrumSepolia.id]: fallback([http()]),
      },
    })
  : null;

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

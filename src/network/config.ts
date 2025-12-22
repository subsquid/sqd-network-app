import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { upperFirst } from 'lodash-es';
import { arbitrumSepolia, arbitrum } from 'wagmi/chains';

import { getSubsquidNetwork, NetworkName } from './useSubsquidNetwork';
import { fallback, http } from 'wagmi';

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
      groupName: 'Recommended',
      wallets: [safeWallet, rainbowWallet, coinbaseWallet, metaMaskWallet, walletConnectWallet],
    },
  ],
});

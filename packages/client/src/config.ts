import { type Chain, type WalletDetailsParams, getDefaultConfig } from '@rainbow-me/rainbowkit';
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
import { type Config, createConnector, fallback, http } from 'wagmi';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';

import { NetworkName, getSubsquidNetwork } from './hooks/network/useSubsquidNetwork';

const network = getSubsquidNetwork();

/**
 * True when this bundle was built with `pnpm mock` (vite's `--mode mock`
 * flag injects `process.env.MOCK = 'true'`). Drives the conditional inclusion
 * of the "Mock Personas" wallet group inside the RainbowKit connect modal.
 */
export const isMockMode = process.env.MOCK === 'true';

/** RPC URL used by the mock wagmi config — talks to the in-process anvil. */
const MOCK_RPC_URL = 'http://localhost:8545';

/**
 * Fixture accounts available in mock mode. Each renders as a top-level
 * wallet entry inside the RainbowKit connect modal under a dedicated
 * "Mock Personas" group. Selecting one connects directly via the wagmi
 * mock connector.
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
    description: 'Multi-worker delegator (~100k SQD across 3 workers)',
  },
  {
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    label: 'Carol (worker operator)',
    description: 'Owns 4 registered workers + a portal pool',
  },
  {
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    label: 'Dave (vesting)',
    description: 'Has 1 000 000 SQD in a vesting contract',
  },
] as const;

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

/**
 * Build a RainbowKit-compatible "wallet" entry for a single mock persona.
 * Each persona renders as a dedicated wallet button inside the RainbowKit
 * connect modal; clicking it connects via the wagmi mock connector pinned
 * to that persona's address.
 *
 * Each wallet gets its own connector instance (`mock({ accounts: [addr] })`)
 * so RainbowKit can track them independently — there's no shared mock
 * connector that we'd have to re-target via `onAccountsChanged`.
 */
function mockPersonaWallet(persona: (typeof MOCK_FIXTURE_ACCOUNTS)[number], index: number) {
  const id = `mock-persona-${index}`;
  return () => ({
    id,
    name: persona.label,
    shortName: persona.label.split(' ')[0]!,
    iconUrl: PERSONA_ICON_DATA_URLS[index] ?? PERSONA_ICON_DATA_URLS[0]!,
    iconBackground: PERSONA_ICON_BACKGROUNDS[index] ?? '#888888',
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) => {
      const fn = mock({
        accounts: [persona.address] as [Address],
        features: { defaultConnected: false, reconnect: true },
      });
      return createConnector(config => ({
        ...fn(config),
        ...walletDetails,
      }));
    },
  });
}

/**
 * Tiny inline SVG icons (one per persona). data: URLs keep the bundle
 * self-contained so devs don't have to fetch anything in mock mode.
 */
const PERSONA_ICON_BACKGROUNDS = ['#FCA5A5', '#FCD34D', '#86EFAC', '#93C5FD'];
const PERSONA_ICON_DATA_URLS = MOCK_FIXTURE_ACCOUNTS.map((p, i) => {
  const initial = p.label.charAt(0);
  const bg = PERSONA_ICON_BACKGROUNDS[i] ?? '#888888';
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<rect width="32" height="32" rx="8" fill="${bg}"/>` +
    `<text x="50%" y="55%" font-family="-apple-system,BlinkMacSystemFont,sans-serif" ` +
    `font-size="16" font-weight="700" fill="#1F2937" text-anchor="middle" ` +
    `dominant-baseline="middle">${initial}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
});

/**
 * Build the wagmi `Config` used by the app. Always returns a RainbowKit-
 * compatible config; in mock mode the wallet list grows to include a "Mock
 * Personas" group at the top while real wallets stay underneath, and the
 * default chain transport points at the local anvil RPC instead of public
 * Arbitrum.
 *
 * Tests use `createUnitWagmiConfig()` from `src/test/wagmi/testConfig.ts`
 * instead — that helper sidesteps this factory entirely so unit specs
 * don't depend on build-time defines.
 */
export function createAppWagmiConfig(opts: AppWagmiConfigOpts): Config {
  const chain = resolveChain(opts.network, opts.multicall3Override);
  const transport = isMockMode ? http(MOCK_RPC_URL) : fallback([http()]);

  const wallets = isMockMode
    ? [
        {
          groupName: 'Mock Personas',
          wallets: MOCK_FIXTURE_ACCOUNTS.map((p, i) => mockPersonaWallet(p, i)),
        },
      ]
    : [
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
      ];

  return getDefaultConfig({
    appName: `Subsquid Network ${upperFirst(opts.network)}`,
    projectId: opts.walletConnectProjectId ?? '',
    transports: {
      [chain.id]: transport,
    },
    chains: [chain],
    wallets,
  });
}

// Back-compat: a few call sites still want the active network without
// re-deriving it.
export { network as currentNetwork };

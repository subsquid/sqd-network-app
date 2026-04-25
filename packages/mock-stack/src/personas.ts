import type { Address, Hex } from 'viem';

/**
 * Fixture personas — 4 "named" wallets exposed in the UI's account picker
 * (Alice/Bob/Carol/Dave) plus 6 "extras" used only for seeding so the chain
 * has more than one delegator per worker, more than one provider per
 * portal pool, etc.
 *
 * Private keys are the well-known Hardhat / anvil deterministic dev keys —
 * they MUST NEVER be used outside the mock stack.
 */
export interface Persona {
  label: PersonaLabel;
  address: Address;
  privateKey: Hex;
  /** Initial ETH balance, wei. */
  ethBalance: bigint;
  /** Initial SQD balance, wei (token decimals = 18). */
  sqdBalance: bigint;
  /** True for the 4 personas exposed in the UI account picker. */
  named: boolean;
}

export type PersonaLabel =
  | 'Alice'
  | 'Bob'
  | 'Carol'
  | 'Dave'
  | 'Eve'
  | 'Frank'
  | 'Grace'
  | 'Heidi'
  | 'Ivan'
  | 'Judy';

const ETH = (n: bigint) => n * 10n ** 18n;
const SQD = (n: bigint) => n * 10n ** 18n;

export const PERSONAS: readonly Persona[] = [
  // ── Named (UI-visible) personas ─────────────────────────────────────────
  {
    label: 'Alice',
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    ethBalance: ETH(10n),
    sqdBalance: SQD(0n),
    named: true,
  },
  {
    label: 'Bob',
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    ethBalance: ETH(10n),
    sqdBalance: SQD(500_000n),
    named: true,
  },
  {
    label: 'Carol',
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
    ethBalance: ETH(10n),
    sqdBalance: SQD(2_500_000n),
    named: true,
  },
  {
    label: 'Dave',
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
    ethBalance: ETH(10n),
    sqdBalance: SQD(50_000n),
    named: true,
  },
  // ── Extras: anonymous delegators / operators ────────────────────────────
  // Anvil dev keys 4–9 (standard m/44'/60'/0'/0/i derivation).
  {
    label: 'Eve',
    address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    privateKey: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
    ethBalance: ETH(10n),
    sqdBalance: SQD(800_000n),
    named: false,
  },
  {
    label: 'Frank',
    address: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    privateKey: '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba',
    ethBalance: ETH(10n),
    sqdBalance: SQD(150_000n),
    named: false,
  },
  {
    label: 'Grace',
    address: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    privateKey: '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e',
    ethBalance: ETH(10n),
    sqdBalance: SQD(1_200_000n),
    named: false,
  },
  {
    label: 'Heidi',
    address: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
    privateKey: '0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356',
    ethBalance: ETH(10n),
    sqdBalance: SQD(75_000n),
    named: false,
  },
  {
    label: 'Ivan',
    address: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    privateKey: '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
    ethBalance: ETH(10n),
    sqdBalance: SQD(300_000n),
    named: false,
  },
  {
    label: 'Judy',
    address: '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
    privateKey: '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6',
    ethBalance: ETH(10n),
    sqdBalance: SQD(450_000n),
    named: false,
  },
] as const;

/** Default deployer key — anvil's account #0. */
export const DEPLOYER_PRIVATE_KEY: Hex =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

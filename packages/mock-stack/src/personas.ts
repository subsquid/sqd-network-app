import type { Address, Hex } from 'viem';

/**
 * Fixture personas mirrored from `packages/client/src/config.ts`
 * (`MOCK_FIXTURE_ACCOUNTS`) and `packages/server/src/services/mockRpcServer.ts`
 * (`MOCK_ACCOUNTS`). Keep in sync.
 *
 * Private keys are the well-known Hardhat / anvil deterministic dev keys —
 * they MUST NEVER be used outside the mock stack.
 */
export interface Persona {
  label: 'Alice' | 'Bob' | 'Carol' | 'Dave';
  address: Address;
  privateKey: Hex;
  /** Initial ETH balance, wei. */
  ethBalance: bigint;
  /** Initial SQD balance, wei (token decimals = 18). */
  sqdBalance: bigint;
}

const ETH = (n: bigint) => n * 10n ** 18n;
const SQD = (n: bigint) => n * 10n ** 18n;

export const PERSONAS: readonly Persona[] = [
  {
    label: 'Alice',
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    ethBalance: ETH(10n),
    sqdBalance: SQD(0n),
  },
  {
    label: 'Bob',
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    ethBalance: ETH(10n),
    sqdBalance: SQD(200_000n),
  },
  {
    label: 'Carol',
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
    ethBalance: ETH(10n),
    sqdBalance: SQD(500_000n),
  },
  {
    label: 'Dave',
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
    ethBalance: ETH(10n),
    sqdBalance: SQD(50_000n),
  },
] as const;

/** Default deployer key — anvil's account #0. */
export const DEPLOYER_PRIVATE_KEY: Hex =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

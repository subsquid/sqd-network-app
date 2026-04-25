/**
 * TS deploy harness for the mock stack.
 *
 * Deploys the contracts the app reads in mock mode, seeds persona ETH/SQD
 * balances, and writes:
 *   - `.deployments.json`  → name → address map.
 *   - `.anvil-state.json`  → anvil state dump (consumed by `--load-state` so
 *                            subsequent boots skip the deploy step entirely).
 *
 * Scope is **incremental**: Phase 6 ships a minimal mock-only deploy (tokens
 * + Multicall3 + V3 router) so consumers can build against the harness while
 * the network/portal contract submodules' deploys land in follow-up commits.
 */
import fs from 'node:fs';

import {
  type Address,
  type Hex,
  type PublicClient,
  type WalletClient,
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { localArtifact } from './artifacts';
import { type AddressMap, writeDeployments } from './deployments';
import { DEPLOYER_PRIVATE_KEY, PERSONAS } from './personas';

/** Minimal viem chain — chain id is the only field we use. */
function chainFor(chainId: number) {
  return {
    id: chainId,
    name: chainId === 421614 ? 'arbitrum-sepolia-mock' : 'arbitrum-mock',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['http://localhost:8545'] } },
  } as const;
}

export interface DeployOpts {
  rpcUrl: string;
  chainId: number;
}

export interface DeployResult {
  deployments: AddressMap;
  /** Block number at which all setup completed — useful for indexer fromBlock. */
  bootBlock: bigint;
}

/** Run the full deploy sequence + persona seeding. */
export async function runDeploy(opts: DeployOpts): Promise<DeployResult> {
  const chain = chainFor(opts.chainId);
  const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);
  const wallet = createWalletClient({ account, chain, transport: http(opts.rpcUrl) });
  const publicClient = createPublicClient({ chain, transport: http(opts.rpcUrl) });

  const deployments: AddressMap = {};

  // 1. Mock tokens + Multicall3 + V3 router.
  deployments.MULTICALL = await deployContract(wallet, publicClient, 'Multicall3', []);
  deployments.SQD = await deployContract(wallet, publicClient, 'MockSQD', []);
  deployments.USDC = await deployContract(wallet, publicClient, 'MockUSDC', []);
  deployments.WETH = await deployContract(wallet, publicClient, 'MockWETH', []);
  deployments.V3_ROUTER = await deployContract(wallet, publicClient, 'MockV3Router', []);

  // 2. Seed personas: ETH balance + SQD balance.
  await seedPersonas(opts, deployments);

  const bootBlock = await publicClient.getBlockNumber();
  return { deployments, bootBlock };
}

/** Deploy a contract from the local mock-stack `out/` artifacts. */
async function deployContract(
  wallet: WalletClient,
  publicClient: PublicClient,
  contractName: string,
  args: readonly unknown[],
): Promise<Address> {
  const { abi, bytecode } = localArtifact(contractName);
  const hash = await wallet.deployContract({
    abi,
    bytecode,
    args: args as readonly unknown[],
    // viem requires both account+chain in the call signature when wallet was
    // built without their inference; passing through to keep types happy.
    account: wallet.account!,
    chain: wallet.chain,
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error(`Deploy of ${contractName} produced no contractAddress`);
  }
  // biome-ignore lint/suspicious/noConsole: deploy progress
  console.log(`[mock-stack] deployed ${contractName} at ${receipt.contractAddress}`);
  return receipt.contractAddress;
}

/**
 * Set ETH and SQD balances on each persona, plus a small ERC-20 allowance
 * setup tests can rely on. ETH uses the `anvil_setBalance` cheatcode for
 * speed; SQD is minted via the public `mint` function on the mock token.
 */
async function seedPersonas(opts: DeployOpts, deployments: AddressMap): Promise<void> {
  const chain = chainFor(opts.chainId);
  const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);
  const wallet = createWalletClient({ account, chain, transport: http(opts.rpcUrl) });
  const publicClient = createPublicClient({ chain, transport: http(opts.rpcUrl) });
  const sqd = localArtifact('MockSQD');

  for (const persona of PERSONAS) {
    // anvil_setBalance — JSON-RPC cheatcode on anvil.
    await publicClient.request({
      // viem's typed request schema doesn't include anvil cheatcodes; we have
      // to bypass the type check here.
      // biome-ignore lint/suspicious/noExplicitAny: cheatcode escape hatch
      method: 'anvil_setBalance' as any,
      // biome-ignore lint/suspicious/noExplicitAny: see above
      params: [persona.address, `0x${persona.ethBalance.toString(16)}`] as any,
    });
    if (persona.sqdBalance > 0n) {
      const hash = await wallet.writeContract({
        abi: sqd.abi,
        address: deployments.SQD,
        functionName: 'mint',
        args: [persona.address, persona.sqdBalance],
      });
      await publicClient.waitForTransactionReceipt({ hash });
    }
    // biome-ignore lint/suspicious/noConsole: seed progress
    console.log(
      `[mock-stack] seeded ${persona.label} (${persona.address}): ${
        Number(persona.ethBalance / 10n ** 15n) / 1000
      } ETH, ${Number(persona.sqdBalance / 10n ** 15n) / 1000} SQD`,
    );
  }
}

/**
 * Dump anvil state to a file so subsequent boots can replay it via
 * `loadAnvilState()`.
 *
 * The dump is the hex-encoded, gzipped serialisation returned by
 * `anvil_dumpState`. It is **not** compatible with anvil's `--load-state`
 * flag (which expects an unframed JSON dump); always pair this with
 * `loadAnvilState()` post-spawn.
 */
export async function dumpAnvilState(rpcUrl: string, outFile: string): Promise<void> {
  const publicClient = createPublicClient({ transport: http(rpcUrl) });
  const dump = (await publicClient.request({
    // biome-ignore lint/suspicious/noExplicitAny: anvil cheatcode
    method: 'anvil_dumpState' as any,
    params: [] as never,
  })) as Hex;
  fs.writeFileSync(outFile, dump);
}

/** Load a previously-dumped anvil state via `anvil_loadState`. */
export async function loadAnvilState(rpcUrl: string, file: string): Promise<void> {
  if (!fs.existsSync(file)) {
    throw new Error(`Anvil state file not found: ${file}`);
  }
  const dump = fs.readFileSync(file, 'utf-8').trim() as Hex;
  const publicClient = createPublicClient({ transport: http(rpcUrl) });
  await publicClient.request({
    // biome-ignore lint/suspicious/noExplicitAny: anvil cheatcode
    method: 'anvil_loadState' as any,
    params: [dump] as never,
  });
}

// re-export for downstream consumers
export type { AddressMap };
export { parseEther };

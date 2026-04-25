/**
 * Persona seeding via on-chain calls.
 *
 * After the network contracts are deployed, walk through each persona and
 * apply the operations that would have produced their target state in
 * production:
 *   - Mint SQD into the persona's wallet (MockSQD allows public mint).
 *   - Approve allowances + register workers / delegate / receive vesting,
 *     each from the persona's own wallet so on-chain events carry the
 *     correct registrar / staker / beneficiary fields. The indexer mappings
 *     under `src/indexer/mappings/` then project those events into entities
 *     consumed by the GraphQL resolvers.
 *
 * The `peerId` for each worker is a deterministic test bytes blob — encoded
 * client-side to a base58 multihash so the UI's peerId formatter accepts it.
 */
import {
  type Address,
  type PublicClient,
  type WalletClient,
  createPublicClient,
  createWalletClient,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { localArtifact, networkArtifact } from './artifacts';
import { chainFor, type DeployOpts } from './deploy';
import type { AddressMap } from './deployments';
import { DEPLOYER_PRIVATE_KEY, PERSONAS, type Persona } from './personas';

// Test peer-id payloads. Each is a 34-byte sha2-256 multihash:
//   0x12 (sha2-256) || 0x20 (length=32) || <32 bytes>
// These are ASCII-encoded test strings padded to 32 bytes, wrapped in the
// multihash framing so `bytesToBase58` produces a valid CIDv0-shaped string.
function testPeerId(seed: string): `0x${string}` {
  const bytes = new Uint8Array(34);
  bytes[0] = 0x12;
  bytes[1] = 0x20;
  const seedBytes = new TextEncoder().encode(seed.padEnd(32, '\0'));
  bytes.set(seedBytes.slice(0, 32), 2);
  return `0x${Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`;
}

export const TEST_PEER_IDS = {
  carolWorkerA: testPeerId('mock-stack:carol-worker-a'),
  carolWorkerB: testPeerId('mock-stack:carol-worker-b'),
} as const;

/** Top-level entrypoint — apply all persona seeding in order. */
export async function seedPersonas(opts: DeployOpts, deployments: AddressMap): Promise<void> {
  const chain = chainFor(opts.chainId);
  const deployerAccount = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);
  const deployerWallet = createWalletClient({
    account: deployerAccount,
    chain,
    transport: http(opts.rpcUrl),
  });
  const publicClient = createPublicClient({ chain, transport: http(opts.rpcUrl) });

  // 1. Set ETH + mint SQD via the deployer (MockSQD.mint is permissionless).
  const sqdAbi = localArtifact('MockSQD').abi;
  for (const persona of PERSONAS) {
    await publicClient.request({
      // biome-ignore lint/suspicious/noExplicitAny: anvil cheatcode
      method: 'anvil_setBalance' as any,
      // biome-ignore lint/suspicious/noExplicitAny: anvil cheatcode
      params: [persona.address, `0x${persona.ethBalance.toString(16)}`] as any,
    });
    if (persona.sqdBalance > 0n) {
      const hash = await deployerWallet.writeContract({
        abi: sqdAbi,
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

  // 2. Carol — register two workers.
  const carol = byLabel('Carol');
  const carolWallet = walletFor(carol, chain, opts.rpcUrl);
  const carolWorkerIds = await registerWorkersForCarol(
    carolWallet,
    publicClient,
    deployments,
    sqdAbi,
  );

  // Workers become "active" only after the next epoch boundary. Mine a few
  // blocks so Staking.deposit() against them passes its `Worker not active`
  // guard. epochLength is set to 2 in NetworkController for fast tests.
  await publicClient.request({
    // biome-ignore lint/suspicious/noExplicitAny: anvil cheatcode
    method: 'anvil_mine' as any,
    // biome-ignore lint/suspicious/noExplicitAny: anvil cheatcode
    params: ['0x10'] as any, // 16 blocks — well past one epoch
  });

  // 3. Bob — delegate 50_000 SQD to Carol's first worker.
  const bob = byLabel('Bob');
  const bobWallet = walletFor(bob, chain, opts.rpcUrl);
  await delegateForBob(bobWallet, publicClient, deployments, sqdAbi, carolWorkerIds[0]);

  // 4. Dave — vesting placeholder (skipped until VestingFactory's
  //    VESTING_CREATOR_ROLE flow lands; SQD balance alone is enough for
  //    sources/accountsByOwner to render meaningfully).
}

function byLabel(label: Persona['label']): Persona {
  const found = PERSONAS.find(p => p.label === label);
  if (!found) throw new Error(`Persona ${label} missing from PERSONAS`);
  return found;
}

function walletFor(persona: Persona, chain: ReturnType<typeof chainFor>, rpcUrl: string) {
  return createWalletClient({
    account: privateKeyToAccount(persona.privateKey),
    chain,
    transport: http(rpcUrl),
  });
}

async function registerWorkersForCarol(
  wallet: WalletClient,
  publicClient: PublicClient,
  deployments: AddressMap,
  sqdAbi: ReturnType<typeof localArtifact>['abi'],
): Promise<bigint[]> {
  const workerRegAbi = networkArtifact('WorkerRegistration').abi;
  const networkAbi = networkArtifact('NetworkController').abi;

  // bondAmount per worker (NetworkController.bondAmount() — 100_000 SQD).
  const bondAmount = (await publicClient.readContract({
    abi: networkAbi,
    address: deployments.NETWORK_CONTROLLER,
    functionName: 'bondAmount',
  })) as bigint;

  // Approve 2x bondAmount up front so both register() calls succeed.
  await sendFrom(wallet, publicClient, {
    abi: sqdAbi,
    address: deployments.SQD,
    functionName: 'approve',
    args: [deployments.WORKER_REGISTRATION, bondAmount * 2n],
  });

  // nextWorkerId() before any registration → first id we'll observe.
  const firstId = (await publicClient.readContract({
    abi: workerRegAbi,
    address: deployments.WORKER_REGISTRATION,
    functionName: 'nextWorkerId',
  })) as bigint;

  for (const peerId of [TEST_PEER_IDS.carolWorkerA, TEST_PEER_IDS.carolWorkerB]) {
    await sendFrom(wallet, publicClient, {
      abi: workerRegAbi,
      address: deployments.WORKER_REGISTRATION,
      functionName: 'register',
      args: [peerId, '{"name":"Mock Worker"}'],
    });
  }
  // biome-ignore lint/suspicious/noConsole: seed progress
  console.log(
    `[mock-stack] Carol registered workers ${firstId} + ${firstId + 1n}`,
  );
  return [firstId, firstId + 1n];
}

async function delegateForBob(
  wallet: WalletClient,
  publicClient: PublicClient,
  deployments: AddressMap,
  sqdAbi: ReturnType<typeof localArtifact>['abi'],
  workerId: bigint,
): Promise<void> {
  const stakingAbi = networkArtifact('Staking').abi;
  const amount = 50_000n * 10n ** 18n;

  await sendFrom(wallet, publicClient, {
    abi: sqdAbi,
    address: deployments.SQD,
    functionName: 'approve',
    args: [deployments.STAKING, amount],
  });
  await sendFrom(wallet, publicClient, {
    abi: stakingAbi,
    address: deployments.STAKING,
    functionName: 'deposit',
    args: [workerId, amount],
  });
  // biome-ignore lint/suspicious/noConsole: seed progress
  console.log(
    `[mock-stack] Bob delegated ${Number(amount / 10n ** 18n)} SQD to worker ${workerId}`,
  );
}

async function sendFrom(
  wallet: WalletClient,
  publicClient: PublicClient,
  args: {
    abi: ReturnType<typeof localArtifact>['abi'];
    address: Address;
    functionName: string;
    args: readonly unknown[];
  },
): Promise<void> {
  const hash = await wallet.writeContract({
    abi: args.abi,
    address: args.address,
    functionName: args.functionName,
    args: args.args,
    account: wallet.account!,
    chain: wallet.chain,
  });
  await publicClient.waitForTransactionReceipt({ hash });
}

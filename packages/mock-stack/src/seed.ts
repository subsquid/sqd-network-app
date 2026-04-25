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

import { localArtifact, networkArtifact, portalArtifact } from './artifacts';
import { type DeployOpts, chainFor } from './deploy';
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

  // 4. Dave — create a vesting account funded with 1_000_000 SQD.
  const dave = byLabel('Dave');
  await createVestingForDave(deployerWallet, publicClient, deployments, sqdAbi, dave.address);

  // 5. Carol — create a portal pool + Bob deposits into it (if portal
  //    contracts are deployed in this run).
  if (deployments.PORTAL_POOL_FACTORY) {
    const usdcAbi = localArtifact('MockUSDC').abi;
    const poolAddress = await createPortalPoolForCarol(
      carolWallet,
      deployerWallet,
      publicClient,
      deployments,
      usdcAbi,
    );
    if (poolAddress) {
      await depositIntoPortalPoolForBob(bobWallet, publicClient, deployments, sqdAbi, poolAddress);
    }
  }
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
  console.log(`[mock-stack] Carol registered workers ${firstId} + ${firstId + 1n}`);
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

/**
 * Create a vesting account for Dave via the VestingFactory's
 * VESTING_CREATOR_ROLE (granted to the deployer at construction). Funds the
 * resulting Vesting contract with 1_000_000 SQD so `release()` calls have
 * something to release.
 *
 * Linear vesting starting 30 days ago, 365-day duration, 10% immediate
 * release — visually matches what a real beneficiary would see.
 */
async function createVestingForDave(
  deployerWallet: WalletClient,
  publicClient: PublicClient,
  deployments: AddressMap,
  sqdAbi: ReturnType<typeof localArtifact>['abi'],
  daveAddress: Address,
): Promise<Address> {
  const factoryAbi = networkArtifact('VestingFactory').abi;
  const expectedTotalAmount = 1_000_000n * 10n ** 18n;
  const startTimestamp = BigInt(Math.floor(Date.now() / 1000) - 30 * 86_400);
  const durationSeconds = 365n * 86_400n;
  const immediateReleaseBIP = 1_000n; // 10%

  // Capture the next deployed Vesting contract address by parsing the receipt's
  // VestingCreated event log.
  const hash = await deployerWallet.writeContract({
    abi: factoryAbi,
    address: deployments.VESTING_FACTORY,
    functionName: 'createVesting',
    args: [daveAddress, startTimestamp, durationSeconds, immediateReleaseBIP, expectedTotalAmount],
    account: deployerWallet.account!,
    chain: deployerWallet.chain,
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  // The factory's VestingCreated event has the vesting address as the indexed
  // first topic (after the 0xkeccak signature). topics[1] is the address
  // padded to 32 bytes.
  const eventTopic = receipt.logs.find(
    l => l.address.toLowerCase() === deployments.VESTING_FACTORY.toLowerCase(),
  );
  if (!eventTopic) {
    throw new Error('Vesting creation: no VestingCreated event found in receipt');
  }
  const vestingAddress = `0x${eventTopic.topics[1]!.slice(-40)}` as Address;

  // Fund the vesting contract.
  const fundHash = await deployerWallet.writeContract({
    abi: sqdAbi,
    address: deployments.SQD,
    functionName: 'mint',
    args: [vestingAddress, expectedTotalAmount],
    account: deployerWallet.account!,
    chain: deployerWallet.chain,
  });
  await publicClient.waitForTransactionReceipt({ hash: fundHash });

  // biome-ignore lint/suspicious/noConsole: seed progress
  console.log(
    `[mock-stack] Dave's vesting at ${vestingAddress}: ${Number(expectedTotalAmount / 10n ** 18n)} SQD`,
  );
  return vestingAddress;
}

/**
 * Carol creates a portal pool. Pool consumes USDC as the reward token
 * (MockUSDC) — the deployer mints + approves USDC into Carol's wallet up
 * front so the factory's initialDeposit transferFrom succeeds. Returns
 * the deployed pool address (parsed from the PoolCreated receipt log).
 */
async function createPortalPoolForCarol(
  carolWallet: WalletClient,
  deployerWallet: WalletClient,
  publicClient: PublicClient,
  deployments: AddressMap,
  usdcAbi: ReturnType<typeof localArtifact>['abi'],
): Promise<Address | null> {
  const factoryAbi = portalArtifact('PortalPoolFactory').abi;

  const dailyRewardUsdc = 100n * 1_000_000n; // 100 USDC/day, 6 decimals.
  const distributionRatePerSecond = (dailyRewardUsdc * 1_000n + 86_399n) / 86_400n;
  const initialDeposit = (distributionRatePerSecond * 86_400n) / 1_000n;

  // Mint USDC to Carol + approve the factory.
  const mintHash = await deployerWallet.writeContract({
    abi: usdcAbi,
    address: deployments.USDC,
    functionName: 'mint',
    args: [carolWallet.account!.address, initialDeposit * 10n],
    account: deployerWallet.account!,
    chain: deployerWallet.chain,
  });
  await publicClient.waitForTransactionReceipt({ hash: mintHash });
  await sendFrom(carolWallet, publicClient, {
    abi: usdcAbi,
    address: deployments.USDC,
    functionName: 'approve',
    args: [deployments.PORTAL_POOL_FACTORY, initialDeposit * 10n],
  });

  // CreatePortalPoolParams { operator, capacity, tokenSuffix, rate, initialDeposit, metadata, rewardToken }
  const params = {
    operator: carolWallet.account!.address,
    capacity: 1_000_000n * 10n ** 18n,
    tokenSuffix: 'MOCK',
    distributionRatePerSecond,
    initialDeposit,
    metadata: 'Mock portal pool created during seed',
    rewardToken: deployments.USDC,
  };

  let receipt: Awaited<ReturnType<PublicClient['waitForTransactionReceipt']>>;
  try {
    const hash = await carolWallet.writeContract({
      abi: factoryAbi,
      address: deployments.PORTAL_POOL_FACTORY,
      functionName: 'createPortalPool',
      args: [params],
      account: carolWallet.account!,
      chain: carolWallet.chain,
    });
    receipt = await publicClient.waitForTransactionReceipt({ hash });
  } catch (err) {
    // biome-ignore lint/suspicious/noConsole: surface the failure but keep going
    console.warn(
      `[mock-stack] could not create portal pool: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return null;
  }

  // PoolCreated(address indexed portal, address indexed operator, address indexed rewardToken, …)
  // → topics[1] is the pool address (32-byte left-padded). signature is the
  // first 32-byte topic; we filter logs from the factory.
  const log = receipt.logs.find(
    l =>
      l.address.toLowerCase() === deployments.PORTAL_POOL_FACTORY.toLowerCase() &&
      l.topics.length >= 4,
  );
  if (!log || !log.topics[1]) {
    // biome-ignore lint/suspicious/noConsole: missing log diagnostic
    console.warn('[mock-stack] portal pool created but no PoolCreated event found in receipt');
    return null;
  }
  const poolAddress = `0x${log.topics[1].slice(-40)}` as Address;
  // biome-ignore lint/suspicious/noConsole: seed progress
  console.log(`[mock-stack] Carol created portal pool at ${poolAddress}`);
  return poolAddress;
}

/** Bob deposits 25_000 SQD into Carol's portal pool. */
async function depositIntoPortalPoolForBob(
  bobWallet: WalletClient,
  publicClient: PublicClient,
  deployments: AddressMap,
  sqdAbi: ReturnType<typeof localArtifact>['abi'],
  poolAddress: Address,
): Promise<void> {
  const poolAbi = portalArtifact('PortalPoolImplementation').abi;
  const amount = 25_000n * 10n ** 18n;
  await sendFrom(bobWallet, publicClient, {
    abi: sqdAbi,
    address: deployments.SQD,
    functionName: 'approve',
    args: [poolAddress, amount],
  });
  try {
    await sendFrom(bobWallet, publicClient, {
      abi: poolAbi,
      address: poolAddress,
      functionName: 'deposit',
      args: [amount],
    });
    // biome-ignore lint/suspicious/noConsole: seed progress
    console.log(`[mock-stack] Bob deposited ${Number(amount / 10n ** 18n)} SQD into portal pool`);
  } catch (err) {
    // biome-ignore lint/suspicious/noConsole: warn-and-continue
    console.warn(
      `[mock-stack] portal pool deposit failed: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }
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

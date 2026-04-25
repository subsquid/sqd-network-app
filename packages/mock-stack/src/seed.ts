/**
 * Persona seeding via on-chain calls.
 *
 * Goal: a fully populated demo state. The chain ends up with:
 *   - 12 active workers across 4 different operators (Carol, Eve, Grace, Ivan).
 *   - ~12 delegations spread across workers, multiple delegators per worker.
 *   - 3 portal pools with varied capacities + 4 deposits across providers.
 *   - 2 vesting accounts (Dave + Heidi) with different totals + schedules.
 *   - Time-spread blocks: anvil_setNextBlockTimestamp between batches so
 *     `createdAt` / `lastBlockTimestampL1` actually span days.
 *
 * Every operation runs from the relevant persona's wallet so on-chain
 * events carry the right registrar / staker / beneficiary / operator
 * addresses; resolvers read everything through to the chain so the
 * GraphQL surface always matches reality.
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
import { DEPLOYER_PRIVATE_KEY, PERSONAS, type Persona, type PersonaLabel } from './personas';

// Test peer-id payloads. Each is a 34-byte sha2-256 multihash:
//   0x12 (sha2-256) || 0x20 (length=32) || <32 bytes>
function testPeerId(seed: string): `0x${string}` {
  const bytes = new Uint8Array(34);
  bytes[0] = 0x12;
  bytes[1] = 0x20;
  const seedBytes = new TextEncoder().encode(seed.padEnd(32, '\0'));
  bytes.set(seedBytes.slice(0, 32), 2);
  return `0x${Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`;
}

/** A single "operator owns N workers" plan. */
interface WorkerSpec {
  operator: PersonaLabel;
  /** Stable peer-id seed string — produces deterministic peerId bytes. */
  peerSeed: string;
  /** UI metadata blob: `{ name, description, website, ... }` (JSON.stringified). */
  metadata: string;
  /** Days ago this worker should be created (used to time-spread `createdAt`). */
  ageDays: number;
}

const WORKER_SPECS: readonly WorkerSpec[] = [
  // Carol — flagship operator, 4 workers spread over the past month.
  {
    operator: 'Carol',
    peerSeed: 'carol-alpha',
    ageDays: 28,
    metadata: m('Carol Alpha', 'Flagship indexing node, US-east region.'),
  },
  {
    operator: 'Carol',
    peerSeed: 'carol-beta',
    ageDays: 22,
    metadata: m('Carol Beta', 'Backup node for Carol, EU-west.'),
  },
  {
    operator: 'Carol',
    peerSeed: 'carol-gamma',
    ageDays: 18,
    metadata: m('Carol Gamma', 'High-throughput node, Asia.'),
  },
  {
    operator: 'Carol',
    peerSeed: 'carol-delta',
    ageDays: 10,
    metadata: m('Carol Delta', 'Newest Carol node, premium hardware.'),
  },
  // Eve — 3 workers.
  {
    operator: 'Eve',
    peerSeed: 'eve-1',
    ageDays: 25,
    metadata: m("Eve's Node", 'Eve operator, primary node.'),
  },
  {
    operator: 'Eve',
    peerSeed: 'eve-2',
    ageDays: 14,
    metadata: m('Eve EU', 'Eve operator, Frankfurt region.'),
  },
  {
    operator: 'Eve',
    peerSeed: 'eve-3',
    ageDays: 6,
    metadata: m('Eve APAC', 'Eve operator, Singapore region.'),
  },
  // Grace — 3 workers.
  {
    operator: 'Grace',
    peerSeed: 'grace-1',
    ageDays: 21,
    metadata: m('Grace Prime', 'Long-running node, high uptime.'),
  },
  {
    operator: 'Grace',
    peerSeed: 'grace-2',
    ageDays: 12,
    metadata: m('Grace Reserve', 'Reserve capacity node.'),
  },
  {
    operator: 'Grace',
    peerSeed: 'grace-3',
    ageDays: 4,
    metadata: m('Grace New', 'Recent addition.'),
  },
  // Ivan — 2 workers.
  {
    operator: 'Ivan',
    peerSeed: 'ivan-1',
    ageDays: 16,
    metadata: m("Ivan's Node", 'Ivan operator, DC-1.'),
  },
  {
    operator: 'Ivan',
    peerSeed: 'ivan-2',
    ageDays: 3,
    metadata: m("Ivan's Node 2", 'Ivan operator, DC-2.'),
  },
];

interface DelegationSpec {
  staker: PersonaLabel;
  /** Index into WORKER_SPECS — workerId we're delegating to. */
  workerIndex: number;
  amountSqd: number; // SQD whole units
  /** Days ago this delegation was placed. */
  ageDays: number;
}

const DELEGATION_SPECS: readonly DelegationSpec[] = [
  // Bob diversifies across 3 workers.
  { staker: 'Bob', workerIndex: 0, amountSqd: 50_000, ageDays: 24 },
  { staker: 'Bob', workerIndex: 4, amountSqd: 30_000, ageDays: 20 },
  { staker: 'Bob', workerIndex: 7, amountSqd: 20_000, ageDays: 12 },
  // Frank — single chunky delegation.
  { staker: 'Frank', workerIndex: 0, amountSqd: 100_000, ageDays: 18 },
  // Grace stakes into Eve's worker.
  { staker: 'Grace', workerIndex: 4, amountSqd: 75_000, ageDays: 15 },
  // Heidi — small diversified.
  { staker: 'Heidi', workerIndex: 7, amountSqd: 25_000, ageDays: 11 },
  { staker: 'Heidi', workerIndex: 1, amountSqd: 15_000, ageDays: 8 },
  // Judy — heavy delegator, multiple workers.
  { staker: 'Judy', workerIndex: 2, amountSqd: 90_000, ageDays: 14 },
  { staker: 'Judy', workerIndex: 5, amountSqd: 60_000, ageDays: 9 },
  { staker: 'Judy', workerIndex: 10, amountSqd: 40_000, ageDays: 5 },
  // Dave — small delegation from his liquid balance (vesting is separate).
  { staker: 'Dave', workerIndex: 3, amountSqd: 10_000, ageDays: 7 },
  // Ivan — operator-as-delegator on someone else's worker.
  { staker: 'Ivan', workerIndex: 8, amountSqd: 50_000, ageDays: 4 },
];

interface PortalPoolSpec {
  operator: PersonaLabel;
  capacitySqd: number; // whole units
  dailyRewardUsdc: number; // 6-decimal whole units
  metadata: string;
  tokenSuffix: string;
  ageDays: number;
}

const POOL_SPECS: readonly PortalPoolSpec[] = [
  {
    operator: 'Carol',
    capacitySqd: 1_000_000,
    dailyRewardUsdc: 100,
    metadata: 'Carol primary portal pool',
    tokenSuffix: 'CAROL',
    ageDays: 20,
  },
  {
    operator: 'Eve',
    capacitySqd: 500_000,
    dailyRewardUsdc: 50,
    metadata: 'Eve regional portal pool',
    tokenSuffix: 'EVE',
    ageDays: 13,
  },
  {
    operator: 'Grace',
    capacitySqd: 750_000,
    dailyRewardUsdc: 80,
    metadata: 'Grace community pool',
    tokenSuffix: 'GRACE',
    ageDays: 6,
  },
];

interface PoolDepositSpec {
  staker: PersonaLabel;
  /** Index into POOL_SPECS. */
  poolIndex: number;
  amountSqd: number;
  ageDays: number;
}

const POOL_DEPOSIT_SPECS: readonly PoolDepositSpec[] = [
  { staker: 'Bob', poolIndex: 0, amountSqd: 25_000, ageDays: 16 },
  { staker: 'Frank', poolIndex: 0, amountSqd: 40_000, ageDays: 14 },
  { staker: 'Bob', poolIndex: 1, amountSqd: 15_000, ageDays: 9 },
  { staker: 'Heidi', poolIndex: 1, amountSqd: 30_000, ageDays: 7 },
  { staker: 'Judy', poolIndex: 2, amountSqd: 50_000, ageDays: 4 },
];

interface VestingSpec {
  beneficiary: PersonaLabel;
  totalSqd: number;
  ageDaysStart: number; // start = N days ago
  durationDays: number;
  immediateReleaseBips: number; // 1bip = 0.01%
}

const VESTING_SPECS: readonly VestingSpec[] = [
  {
    beneficiary: 'Dave',
    totalSqd: 1_000_000,
    ageDaysStart: 30,
    durationDays: 365,
    immediateReleaseBips: 1_000,
  },
  {
    beneficiary: 'Heidi',
    totalSqd: 250_000,
    ageDaysStart: 60,
    durationDays: 730,
    immediateReleaseBips: 500,
  },
];

function m(name: string, description: string): string {
  return JSON.stringify({ name, description });
}

function byLabel(label: PersonaLabel): Persona {
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

  // ── 1. Set ETH + mint SQD via the deployer (MockSQD.mint is permissionless).
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

  // ── 2. Register all workers across operators.
  const workerIds = await registerWorkers(opts, deployments, sqdAbi);

  // Workers become "active" only after the next epoch boundary. Mine extra
  // blocks past one epoch so Staking.deposit() against any of them passes.
  await mineBlocks(publicClient, 16);

  // ── 3. Place delegations (batched per staker for slightly better throughput).
  await placeDelegations(opts, deployments, sqdAbi, workerIds);

  // ── 4. Vesting accounts.
  for (const spec of VESTING_SPECS) {
    await createVesting(deployerWallet, publicClient, deployments, sqdAbi, spec);
  }

  // ── 5. Portal pools + per-pool deposits.
  if (deployments.PORTAL_POOL_FACTORY) {
    const usdcAbi = localArtifact('MockUSDC').abi;
    const poolAddresses = await createPortalPools(opts, deployments, usdcAbi, deployerWallet);
    for (const dep of POOL_DEPOSIT_SPECS) {
      const pool = poolAddresses[dep.poolIndex];
      if (!pool) continue;
      await depositIntoPool(opts, deployments, sqdAbi, dep, pool);
    }
  }
}

async function registerWorkers(
  opts: DeployOpts,
  deployments: AddressMap,
  sqdAbi: ReturnType<typeof localArtifact>['abi'],
): Promise<bigint[]> {
  const chain = chainFor(opts.chainId);
  const publicClient = createPublicClient({ chain, transport: http(opts.rpcUrl) });
  const workerRegAbi = networkArtifact('WorkerRegistration').abi;
  const networkAbi = networkArtifact('NetworkController').abi;

  const bondAmount = (await publicClient.readContract({
    abi: networkAbi,
    address: deployments.NETWORK_CONTROLLER,
    functionName: 'bondAmount',
  })) as bigint;

  // Group worker specs by operator so we approve once per operator.
  const byOperator = new Map<PersonaLabel, WorkerSpec[]>();
  for (const spec of WORKER_SPECS) {
    const list = byOperator.get(spec.operator) ?? [];
    list.push(spec);
    byOperator.set(spec.operator, list);
  }

  const ids: bigint[] = [];
  for (const [label, specs] of byOperator) {
    const persona = byLabel(label);
    const wallet = walletFor(persona, chain, opts.rpcUrl);
    await sendFrom(wallet, publicClient, {
      abi: sqdAbi,
      address: deployments.SQD,
      functionName: 'approve',
      args: [deployments.WORKER_REGISTRATION, bondAmount * BigInt(specs.length)],
    });
    for (const spec of specs) {
      const nextId = (await publicClient.readContract({
        abi: workerRegAbi,
        address: deployments.WORKER_REGISTRATION,
        functionName: 'nextWorkerId',
      })) as bigint;
      await sendFrom(wallet, publicClient, {
        abi: workerRegAbi,
        address: deployments.WORKER_REGISTRATION,
        functionName: 'register',
        args: [testPeerId(spec.peerSeed), spec.metadata],
      });
      ids.push(nextId);
    }
  }

  // Map back to spec order so DELEGATION_SPECS.workerIndex stays valid.
  const idsBySpec: bigint[] = new Array(WORKER_SPECS.length);
  let cursor = 0;
  for (const [, specs] of byOperator) {
    for (const spec of specs) {
      const idx = WORKER_SPECS.indexOf(spec);
      idsBySpec[idx] = ids[cursor++];
    }
  }
  // biome-ignore lint/suspicious/noConsole: seed progress
  console.log(`[mock-stack] registered ${ids.length} workers across ${byOperator.size} operators`);
  return idsBySpec;
}

async function placeDelegations(
  opts: DeployOpts,
  deployments: AddressMap,
  sqdAbi: ReturnType<typeof localArtifact>['abi'],
  workerIds: bigint[],
): Promise<void> {
  const chain = chainFor(opts.chainId);
  const publicClient = createPublicClient({ chain, transport: http(opts.rpcUrl) });
  const stakingAbi = networkArtifact('Staking').abi;

  // Per-staker bookkeeping: total approved + how much we've already deposited.
  const byStaker = new Map<PersonaLabel, DelegationSpec[]>();
  for (const spec of DELEGATION_SPECS) {
    const list = byStaker.get(spec.staker) ?? [];
    list.push(spec);
    byStaker.set(spec.staker, list);
  }

  for (const [label, specs] of byStaker) {
    const persona = byLabel(label);
    const wallet = walletFor(persona, chain, opts.rpcUrl);
    const total = specs.reduce((acc, s) => acc + BigInt(s.amountSqd) * 10n ** 18n, 0n);
    await sendFrom(wallet, publicClient, {
      abi: sqdAbi,
      address: deployments.SQD,
      functionName: 'approve',
      args: [deployments.STAKING, total],
    });
    for (const spec of specs) {
      const workerId = workerIds[spec.workerIndex];
      if (workerId === undefined) continue;
      const amount = BigInt(spec.amountSqd) * 10n ** 18n;
      await sendFrom(wallet, publicClient, {
        abi: stakingAbi,
        address: deployments.STAKING,
        functionName: 'deposit',
        args: [workerId, amount],
      });
    }
    // biome-ignore lint/suspicious/noConsole: seed progress
    console.log(
      `[mock-stack] ${label} delegated ${Number(total / 10n ** 18n).toLocaleString()} SQD across ${
        specs.length
      } workers`,
    );
  }
}

async function createVesting(
  deployerWallet: WalletClient,
  publicClient: PublicClient,
  deployments: AddressMap,
  sqdAbi: ReturnType<typeof localArtifact>['abi'],
  spec: VestingSpec,
): Promise<void> {
  const factoryAbi = networkArtifact('VestingFactory').abi;
  const beneficiary = byLabel(spec.beneficiary).address;
  const expectedTotalAmount = BigInt(spec.totalSqd) * 10n ** 18n;
  const startTimestamp = BigInt(Math.floor(Date.now() / 1000) - spec.ageDaysStart * 86_400);
  const durationSeconds = BigInt(spec.durationDays) * 86_400n;
  const immediateReleaseBIP = BigInt(spec.immediateReleaseBips);

  const hash = await deployerWallet.writeContract({
    abi: factoryAbi,
    address: deployments.VESTING_FACTORY,
    functionName: 'createVesting',
    args: [beneficiary, startTimestamp, durationSeconds, immediateReleaseBIP, expectedTotalAmount],
    account: deployerWallet.account!,
    chain: deployerWallet.chain,
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  const eventLog = receipt.logs.find(
    l => l.address.toLowerCase() === deployments.VESTING_FACTORY.toLowerCase(),
  );
  if (!eventLog) {
    // biome-ignore lint/suspicious/noConsole: surface diagnostic
    console.warn(`[mock-stack] VestingCreated event not found for ${spec.beneficiary}`);
    return;
  }
  const vestingAddress = `0x${eventLog.topics[1]!.slice(-40)}` as Address;
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
    `[mock-stack] ${spec.beneficiary}'s vesting at ${vestingAddress}: ${Number(
      expectedTotalAmount / 10n ** 18n,
    ).toLocaleString()} SQD`,
  );
}

async function createPortalPools(
  opts: DeployOpts,
  deployments: AddressMap,
  usdcAbi: ReturnType<typeof localArtifact>['abi'],
  deployerWallet: WalletClient,
): Promise<Address[]> {
  const chain = chainFor(opts.chainId);
  const publicClient = createPublicClient({ chain, transport: http(opts.rpcUrl) });
  const factoryAbi = portalArtifact('PortalPoolFactory').abi;

  const out: Address[] = [];
  for (const spec of POOL_SPECS) {
    const operator = byLabel(spec.operator);
    const operatorWallet = walletFor(operator, chain, opts.rpcUrl);

    const dailyReward = BigInt(spec.dailyRewardUsdc) * 1_000_000n;
    const distributionRatePerSecond = (dailyReward * 1_000n + 86_399n) / 86_400n;
    const initialDeposit = (distributionRatePerSecond * 86_400n) / 1_000n;

    // Deployer mints USDC into the operator's wallet, operator approves the factory.
    const mintHash = await deployerWallet.writeContract({
      abi: usdcAbi,
      address: deployments.USDC,
      functionName: 'mint',
      args: [operator.address, initialDeposit * 10n],
      account: deployerWallet.account!,
      chain: deployerWallet.chain,
    });
    await publicClient.waitForTransactionReceipt({ hash: mintHash });
    await sendFrom(operatorWallet, publicClient, {
      abi: usdcAbi,
      address: deployments.USDC,
      functionName: 'approve',
      args: [deployments.PORTAL_POOL_FACTORY, initialDeposit * 10n],
    });

    const params = {
      operator: operator.address,
      capacity: BigInt(spec.capacitySqd) * 10n ** 18n,
      tokenSuffix: spec.tokenSuffix,
      distributionRatePerSecond,
      initialDeposit,
      metadata: spec.metadata,
      rewardToken: deployments.USDC,
    };

    let receipt: Awaited<ReturnType<PublicClient['waitForTransactionReceipt']>>;
    try {
      const hash = await operatorWallet.writeContract({
        abi: factoryAbi,
        address: deployments.PORTAL_POOL_FACTORY,
        functionName: 'createPortalPool',
        args: [params],
        account: operatorWallet.account!,
        chain: operatorWallet.chain,
      });
      receipt = await publicClient.waitForTransactionReceipt({ hash });
    } catch (err) {
      // biome-ignore lint/suspicious/noConsole: warn-and-continue
      console.warn(
        `[mock-stack] portal pool create failed for ${spec.operator}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      continue;
    }
    const log = receipt.logs.find(
      l =>
        l.address.toLowerCase() === deployments.PORTAL_POOL_FACTORY.toLowerCase() &&
        l.topics.length >= 4,
    );
    if (!log || !log.topics[1]) continue;
    const poolAddress = `0x${log.topics[1].slice(-40)}` as Address;
    out.push(poolAddress);
    // biome-ignore lint/suspicious/noConsole: seed progress
    console.log(
      `[mock-stack] ${spec.operator} created portal pool at ${poolAddress} (capacity=${spec.capacitySqd.toLocaleString()} SQD)`,
    );
  }
  return out;
}

async function depositIntoPool(
  opts: DeployOpts,
  deployments: AddressMap,
  sqdAbi: ReturnType<typeof localArtifact>['abi'],
  spec: PoolDepositSpec,
  poolAddress: Address,
): Promise<void> {
  const chain = chainFor(opts.chainId);
  const publicClient = createPublicClient({ chain, transport: http(opts.rpcUrl) });
  const persona = byLabel(spec.staker);
  const wallet = walletFor(persona, chain, opts.rpcUrl);
  const poolAbi = portalArtifact('PortalPoolImplementation').abi;
  const amount = BigInt(spec.amountSqd) * 10n ** 18n;

  await sendFrom(wallet, publicClient, {
    abi: sqdAbi,
    address: deployments.SQD,
    functionName: 'approve',
    args: [poolAddress, amount],
  });
  try {
    await sendFrom(wallet, publicClient, {
      abi: poolAbi,
      address: poolAddress,
      functionName: 'deposit',
      args: [amount],
    });
    // biome-ignore lint/suspicious/noConsole: seed progress
    console.log(
      `[mock-stack] ${spec.staker} deposited ${spec.amountSqd.toLocaleString()} SQD into pool ${poolAddress}`,
    );
  } catch (err) {
    // biome-ignore lint/suspicious/noConsole: warn-and-continue
    console.warn(
      `[mock-stack] portal pool deposit failed (${spec.staker} → ${poolAddress}): ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }
}

async function mineBlocks(publicClient: PublicClient, count: number): Promise<void> {
  await publicClient.request({
    // biome-ignore lint/suspicious/noExplicitAny: anvil cheatcode
    method: 'anvil_mine' as any,
    // biome-ignore lint/suspicious/noExplicitAny: anvil cheatcode
    params: [`0x${count.toString(16)}`] as any,
  });
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

/**
 * Layer-2 integration test for the seeded fixed-amount reward distribution.
 *
 * The mock stack runs one `DistributedRewardsDistribution.commit(...)` call
 * during seeding (`packages/mock-stack/src/seed.ts -> commitFixedRewards`)
 * which gives every worker owner a non-zero claimable balance.  This spec
 * proves the round-trip from the chain through the tRPC server up to the
 * client-facing `account.assetsSummary` shape, and that
 * `RewardTreasury.claimFor` actually transfers SQD to the receiver.
 *
 * Carol is the largest seeded worker operator (4 workers) so she's the
 * easiest persona to assert on with a coarse lower bound. The seed plan
 * allocates 1,000 SQD per worker to its owner and 500 SQD per worker
 * pro-rata to its stakers; Carol owns workers but does not stake into any
 * of them (per `DELEGATION_SPECS` in the seed), so her claimable equals
 * exactly 4,000 SQD = 4 × 1,000.
 */
import type { AppRouter } from '@subsquid/server';
import { createTRPCClient, httpLink } from '@trpc/client';
import {
  type Address,
  createPublicClient,
  createWalletClient,
  erc20Abi,
  getAddress,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrum } from 'viem/chains';
import { describe, expect, inject, it } from 'vitest';

import '../anvil/types';

// Anvil dev-key #2 == Carol (matches `PERSONAS` in mock-stack/src/personas.ts).
const CAROL_PK = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';
const CAROL_ADDR: Address = getAddress('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC');

// Bob is the largest staker (100,000 SQD across 3 workers); a non-zero
// staker reward is guaranteed for him.
const BOB_ADDR: Address = getAddress('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');

const SQD = 10n ** 18n;
const CAROL_OWNED_WORKERS = 4;
const WORKER_REWARD_SQD = 1_000n;
const EXPECTED_CAROL_CLAIMABLE = BigInt(CAROL_OWNED_WORKERS) * WORKER_REWARD_SQD * SQD;

const rewardTreasuryAbi = [
  {
    type: 'function',
    name: 'claimFor',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'rewardDistribution', type: 'address' },
      { name: 'receiver', type: 'address' },
    ],
    outputs: [],
  },
] as const;

const rewardDistributionAbi = [
  {
    type: 'function',
    name: 'claimable',
    stateMutability: 'view',
    inputs: [{ name: 'who', type: 'address' }],
    outputs: [{ name: 'reward', type: 'uint256' }],
  },
] as const;

function makeTrpcClient() {
  return createTRPCClient<AppRouter>({
    links: [httpLink({ url: inject('trpcUrl') })],
  });
}

describe('integration: seeded reward distribution surfaces in assetsSummary + claimFor', () => {
  it("reports Carol's expected claimable through the assetsSummary tRPC route", async () => {
    const trpc = makeTrpcClient();
    const summary = await trpc.account.assetsSummary.query({ address: CAROL_ADDR });

    expect(BigInt(summary.balances.claimable)).toBe(EXPECTED_CAROL_CLAIMABLE);
    const userSource = summary.claimableSources.find(
      s => s.id.toLowerCase() === CAROL_ADDR.toLowerCase(),
    );
    expect(userSource, 'expected a USER claimable source for Carol').toBeDefined();
    expect(BigInt(userSource!.balance)).toBe(EXPECTED_CAROL_CLAIMABLE);
  });

  it('reports a non-zero staker claimable for Bob', async () => {
    const trpc = makeTrpcClient();
    const summary = await trpc.account.assetsSummary.query({ address: BOB_ADDR });
    // Bob has 3 delegations; at least one of those workers (e.g. carol-alpha)
    // has a single staker so he gets the full 500 SQD share. We just assert
    // claimable is positive — the exact split depends on co-stakers' totals.
    expect(BigInt(summary.balances.claimable)).toBeGreaterThan(0n);
  });

  it("claimFor transfers SQD to the receiver and zeroes Carol's claimable", async () => {
    const rpcUrl = inject('rpcUrl');
    const deployments = inject('deployments');
    const sqdAddress = deployments.SQD as Address;
    const treasuryAddress = deployments.REWARD_TREASURY as Address;
    const distributorAddress = deployments.REWARD_DISTRIBUTION as Address;

    const account = privateKeyToAccount(CAROL_PK);
    const wallet = createWalletClient({ account, chain: arbitrum, transport: http(rpcUrl) });
    const publicClient = createPublicClient({ chain: arbitrum, transport: http(rpcUrl) });

    const balanceBefore = await publicClient.readContract({
      address: sqdAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [CAROL_ADDR],
    });
    const claimableBefore = await publicClient.readContract({
      address: distributorAddress,
      abi: rewardDistributionAbi,
      functionName: 'claimable',
      args: [CAROL_ADDR],
    });
    expect(claimableBefore).toBe(EXPECTED_CAROL_CLAIMABLE);

    const hash = await wallet.writeContract({
      address: treasuryAddress,
      abi: rewardTreasuryAbi,
      functionName: 'claimFor',
      args: [distributorAddress, CAROL_ADDR],
    });
    await publicClient.waitForTransactionReceipt({ hash });

    const balanceAfter = await publicClient.readContract({
      address: sqdAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [CAROL_ADDR],
    });
    const claimableAfter = await publicClient.readContract({
      address: distributorAddress,
      abi: rewardDistributionAbi,
      functionName: 'claimable',
      args: [CAROL_ADDR],
    });

    expect(balanceAfter - balanceBefore).toBe(EXPECTED_CAROL_CLAIMABLE);
    expect(claimableAfter).toBe(0n);
  });
});

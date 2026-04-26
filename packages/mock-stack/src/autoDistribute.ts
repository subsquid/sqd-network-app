/**
 * Periodically commits reward distributions for every currently active
 * worker, mirroring how the production reward bot keeps
 * `DistributedRewardsDistribution` rolling forward.
 *
 * Each tick:
 *   1. fetches the current active worker set from `WorkerRegistration`;
 *   2. issues as many full `REWARD_BLOCKS_PER_COMMIT`-sized commits as
 *      the chain head allows, each one paying every active worker
 *      `WORKER_REWARD_PER_CYCLE_SQD` to the owner and
 *      `STAKER_REWARD_PER_CYCLE_SQD` pro-rata to its stakers (workers
 *      without delegators silently drop the staker portion via
 *      `Staking._distribute`'s zero-totalStaked early-return).
 *
 * The shared `commitRewardChunks` primitive enforces the same range
 * invariants used during preseeding: 10-block windows, strictly
 * contiguous, never overlapping (the contract requires
 * `fromBlock == lastBlockRewarded + 1`). The result is a single,
 * uniform reward cadence before and after preseeding — preseeding just
 * happens to emit the very first chunk, this loop keeps emitting the
 * subsequent ones.
 *
 * Side-effect that matters for `Staking.deposit()`: each commit
 * eventually flows into `Staking.distribute()` which advances
 * `lastEpochRewarded`, keeping the chain within the
 * `stakingDeadlock` window so delegation never reverts with
 * "Rewards out of date".
 */
import { type Abi, type Address, createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { networkArtifact } from './artifacts';
import { STAKER_REWARD_PER_CYCLE_SQD, WORKER_REWARD_PER_CYCLE_SQD } from './config';
import { chainFor } from './deploy';
import type { AddressMap } from './deployments';
import { DEPLOYER_PRIVATE_KEY } from './personas';
import { commitRewardChunks } from './rewards';

export interface AutoDistributorOpts {
  rpcUrl: string;
  chainId: number;
  deployments: AddressMap;
  /** Returns the indexer's last seen block — used to determine the commit range. */
  getLastBlock(): number;
  /** How often to check for new blocks to commit. Default 6 000 ms. */
  pollIntervalMs?: number;
}

export interface AutoDistributor {
  stop(): void;
}

export function startAutoDistributor(opts: AutoDistributorOpts): AutoDistributor {
  if (!opts.deployments.REWARD_DISTRIBUTION) {
    return { stop: () => {} };
  }

  const rewardDistribution = opts.deployments.REWARD_DISTRIBUTION as Address;
  const workerRegistration = opts.deployments.WORKER_REGISTRATION as Address | undefined;
  const chain = chainFor(opts.chainId);
  const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);
  const walletClient = createWalletClient({ account, chain, transport: http(opts.rpcUrl) });
  const publicClient = createPublicClient({ chain, transport: http(opts.rpcUrl) });
  const pollMs = opts.pollIntervalMs ?? 6_000;

  let workerRegAbi: Abi | undefined;
  const getWorkerRegAbi = (): Abi =>
    (workerRegAbi ??= networkArtifact('WorkerRegistration').abi);

  let stopped = false;

  async function readActiveWorkers(): Promise<readonly bigint[]> {
    if (!workerRegistration) return [];
    try {
      return (await publicClient.readContract({
        abi: getWorkerRegAbi(),
        address: workerRegistration,
        functionName: 'getActiveWorkerIds',
      })) as readonly bigint[];
    } catch {
      return [];
    }
  }

  async function tick(): Promise<void> {
    if (stopped) return;
    try {
      const head = BigInt(opts.getLastBlock());
      const workers = await readActiveWorkers();
      const workerRewards = workers.map(() => WORKER_REWARD_PER_CYCLE_SQD * 10n ** 18n);
      const stakerRewards = workers.map(() => STAKER_REWARD_PER_CYCLE_SQD * 10n ** 18n);

      const result = await commitRewardChunks({
        rpcUrl: opts.rpcUrl,
        chainId: opts.chainId,
        rewardDistribution,
        wallet: walletClient,
        upperBound: head - 1n,
        recipients: workers,
        workerRewards,
        stakerRewards,
      });

      if (result.chunksCommitted > 0) {
        // biome-ignore lint/suspicious/noConsole: progress indicator
        console.log(
          `[mock-stack] auto-distribute: ${result.chunksCommitted} reward window(s) for ${workers.length} workers, lastBlockRewarded=${result.lastBlockRewarded}`,
        );
      }
    } catch (err) {
      // best-effort — a missed cycle is harmless as long as the next one succeeds
      // biome-ignore lint/suspicious/noConsole: surface transient distribute errors
      console.warn(
        `[mock-stack] auto-distribute failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    if (!stopped) setTimeout(() => void tick(), pollMs);
  }

  void tick();

  return {
    stop: () => {
      stopped = true;
    },
  };
}

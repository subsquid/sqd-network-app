/**
 * Shared reward-commit primitive used by both the seed step and the
 * post-seed auto-distributor. Mirrors how the production reward bots
 * drive `DistributedRewardsDistribution`:
 *
 *   - every commit covers exactly `REWARD_BLOCKS_PER_COMMIT` L1 blocks;
 *   - successive commits are strictly contiguous and never overlap
 *     (`fromBlock == lastBlockRewarded + 1`, enforced by the contract);
 *   - any trailing tail of mined blocks shorter than the chunk size is
 *     left uncovered until the chain produces more blocks.
 *
 * Whether a commit carries actual rewards or empty arrays is decided by
 * the caller via `recipients` / `workerRewards` / `stakerRewards`. The
 * loop itself is identical — that's the "consistent behaviour before and
 * after preseeding" property: same cadence, same range invariants, same
 * code path; only the reward payload differs.
 */
import {
  type Address,
  type PublicClient,
  type WalletClient,
  createPublicClient,
  http,
} from 'viem';

import { networkArtifact } from './artifacts';
import { REWARD_BLOCKS_PER_COMMIT } from './config';
import { chainFor } from './deploy';

export interface CommitChunksOpts {
  rpcUrl: string;
  chainId: number;
  rewardDistribution: Address;
  /** Wallet of a whitelisted committer — typically the deployer EOA. */
  wallet: WalletClient;
  /**
   * Upper bound on the highest block that may appear in a commit
   * (`toBlock < block.number`, so usually `head - 1`). When omitted the
   * helper queries `publicClient.getBlockNumber()` itself.
   */
  upperBound?: bigint;
  /** Per-chunk reward payload — kept identical for every emitted chunk. */
  recipients: readonly bigint[];
  workerRewards: readonly bigint[];
  stakerRewards: readonly bigint[];
  /**
   * Cap on how many chunks to emit in this call. Defaults to unlimited;
   * the seed step uses `1` to issue exactly one rewarded window before
   * handing over to the auto-distributor's empty-payload loop.
   */
  maxChunks?: number;
}

export interface CommitChunksResult {
  /** Number of `REWARD_BLOCKS_PER_COMMIT`-sized chunks actually committed. */
  chunksCommitted: number;
  /** New `lastBlockRewarded` value after the call (unchanged when 0 chunks committed). */
  lastBlockRewarded: bigint;
}

/**
 * Drains as many full `REWARD_BLOCKS_PER_COMMIT` windows as fit between
 * the contract's current `lastBlockRewarded` and `upperBound`, emitting
 * one `commit()` per window.
 */
export async function commitRewardChunks(
  opts: CommitChunksOpts,
): Promise<CommitChunksResult> {
  const chain = chainFor(opts.chainId);
  const publicClient: PublicClient = createPublicClient({
    chain,
    transport: http(opts.rpcUrl),
  });
  const abi = networkArtifact(
    'DistributedRewardDistribution',
    'DistributedRewardsDistribution',
  ).abi;

  let lastRewarded = (await publicClient.readContract({
    abi,
    address: opts.rewardDistribution,
    functionName: 'lastBlockRewarded',
  })) as bigint;

  const upperBound =
    opts.upperBound ?? (await publicClient.getBlockNumber()) - 1n;
  const chunk = REWARD_BLOCKS_PER_COMMIT;
  const max = opts.maxChunks ?? Number.MAX_SAFE_INTEGER;

  let chunksCommitted = 0;
  while (chunksCommitted < max && lastRewarded + chunk <= upperBound) {
    const fromBlock = lastRewarded + 1n;
    const toBlock = lastRewarded + chunk;
    const hash = await opts.wallet.writeContract({
      abi,
      address: opts.rewardDistribution,
      functionName: 'commit',
      args: [
        fromBlock,
        toBlock,
        opts.recipients,
        opts.workerRewards,
        opts.stakerRewards,
      ],
      account: opts.wallet.account!,
      chain: opts.wallet.chain,
    });
    await publicClient.waitForTransactionReceipt({ hash });
    lastRewarded = toBlock;
    chunksCommitted++;
  }

  return { chunksCommitted, lastBlockRewarded: lastRewarded };
}

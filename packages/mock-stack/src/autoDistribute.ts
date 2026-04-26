/**
 * Keeps Staking.lastEpochRewarded current so delegation never reverts with
 * "Rewards out of date".
 *
 * Staking.deposit() requires:
 *   lastEpochRewarded + stakingDeadlock >= epochNumber  || lastEpochRewarded == 0
 *
 * In the mock the deployer is the sole whitelisted committer. After the seed
 * step the chain keeps mining (every 12 s) but nobody calls commit() again,
 * so delegation breaks after `stakingDeadlock` epochs (~48 s with the default
 * settings).
 *
 * This module periodically calls commit(lastBlockRewarded+1, head-1, [], [], [])
 * which routes through DistributedRewardsDistribution → Staking.distribute([],[])
 * → lastEpochRewarded = epochNumber(). Empty reward arrays are intentional:
 * we only need the epoch-advance side-effect, not actual reward accounting.
 */
import { type Address, createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { networkArtifact } from './artifacts';
import { chainFor } from './deploy';
import type { AddressMap } from './deployments';
import { DEPLOYER_PRIVATE_KEY } from './personas';

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

  const abi = networkArtifact('DistributedRewardDistribution', 'DistributedRewardsDistribution').abi;
  const address = opts.deployments.REWARD_DISTRIBUTION as Address;
  const chain = chainFor(opts.chainId);
  const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);
  const publicClient = createPublicClient({ chain, transport: http(opts.rpcUrl) });
  const walletClient = createWalletClient({ account, chain, transport: http(opts.rpcUrl) });
  const pollMs = opts.pollIntervalMs ?? 6_000;

  let stopped = false;
  let lastCommittedBlock: bigint | undefined;

  async function tick(): Promise<void> {
    if (stopped) return;
    try {
      if (lastCommittedBlock === undefined) {
        lastCommittedBlock = (await publicClient.readContract({
          abi,
          address,
          functionName: 'lastBlockRewarded',
        })) as bigint;
      }

      const head = BigInt(opts.getLastBlock());
      const toBlock = head - 1n;

      if (toBlock > lastCommittedBlock) {
        const fromBlock = lastCommittedBlock + 1n;
        const hash = await walletClient.writeContract({
          abi,
          address,
          functionName: 'commit',
          args: [fromBlock, toBlock, [], [], []],
          account,
          chain,
        });
        await publicClient.waitForTransactionReceipt({ hash });
        lastCommittedBlock = toBlock;
        // biome-ignore lint/suspicious/noConsole: progress indicator
        console.log(`[mock-stack] rewards distributed up to block ${toBlock}`);
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

  return { stop: () => { stopped = true; } };
}

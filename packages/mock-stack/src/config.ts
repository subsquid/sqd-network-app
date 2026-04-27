/**
 * Central configuration for the mock-stack.
 *
 * Edit values here; they propagate to the chain, indexer, scripts, and deploy
 * harness automatically.
 *
 *   RUNTIME  — takes effect on the next `pnpm mock:chain` restart.
 *   DEPLOY ★ — also requires `pnpm stack:rebuild` to re-deploy contracts.
 */

/** Arbitrum chain ID served by the mock. Must match what the app expects. */
export const CHAIN_ID = 42161;

/** Public JSON-RPC port exposed by the Arbitrum shim (used by the app). */
export const RPC_PORT = 8545;

/** HTTP port for the mini-indexer GraphQL server (used by the tRPC server). */
export const GRAPHQL_PORT = 4321;

/**
 * Seconds between mined blocks (`anvil --block-time`).
 *
 * 12 mimics Arbitrum mainnet cadence.
 * Decrease (e.g. 1) for faster local iteration at the cost of less realistic
 * timing; increase to slow down epoch progression.
 */
export const BLOCK_TIME_SEC = 12;

// ── Deploy-time ★ (require `pnpm stack:rebuild`) ─────────────────────────────

/**
 * ★ Blocks per epoch (`NetworkController` constructor arg `workerEpochLength`).
 *
 * With BLOCK_TIME_SEC=12 each epoch lasts EPOCH_LENGTH_BLOCKS×12 seconds.
 * Minimum useful value is 2.
 */
export const EPOCH_LENGTH_BLOCKS = 2;

/**
 * ★ SQD paid to each worker owner per reward cycle during seeding.
 * Whole tokens — the seed script multiplies by 10^18.
 */
export const WORKER_REWARD_PER_CYCLE_SQD = 1_000n;

/**
 * ★ SQD paid to each worker's stakers per reward cycle during seeding.
 * Whole tokens — the seed script multiplies by 10^18.
 */
export const STAKER_REWARD_PER_CYCLE_SQD = 500n;

/**
 * Number of L1 blocks covered by a single reward commit. Mirrors the reward
 * bot's behaviour: every commitment to `DistributedRewardsDistribution`
 * advances `lastBlockRewarded` by exactly this many blocks, and consecutive
 * commits never overlap. Seeding emits one rewarded chunk per 10-block
 * window; the auto-distributor afterwards keeps the chain rolling with
 * empty (no-reward) commits in the same 10-block cadence.
 */
export const REWARD_BLOCKS_PER_COMMIT = 10n;

export const DAY_MS = 24 * 60 * 60 * 1000;

// Ethereum's slot time. The indexer's own L1 block time estimate runs about 10% high, which
// would put a six-month unlock date three weeks late.
export const L1_BLOCK_TIME_MS = 12_000;

export type L1Clock = {
  lastBlockL1: number;
  lastBlockTimestampL1: string | number | Date;
};

/** Approximate wall-clock time of an L1 block, counted from the last L1 block the indexer saw. */
export function l1BlockToTimestamp(block: number, clock: L1Clock): number {
  return (
    new Date(clock.lastBlockTimestampL1).getTime() + (block - clock.lastBlockL1) * L1_BLOCK_TIME_MS
  );
}

/**
 * The unlock block `Staking.deposit` would write right now: the start of the next worker epoch
 * plus the lock period. The contract writes it on every deposit, whatever the amount, and it
 * covers the delegator's whole stake on that worker.
 */
export function nextDelegationLockEnd({
  lastBlockL1,
  workerEpochLength,
  lockPeriod,
}: {
  lastBlockL1: number;
  workerEpochLength: number;
  lockPeriod: number;
}) {
  const nextEpochStart =
    Math.floor(lastBlockL1 / workerEpochLength) * workerEpochLength + workerEpochLength;

  return nextEpochStart + lockPeriod;
}

export type DelegationLockState = {
  deposit: string;
  locked?: boolean | null;
  lockEnd?: number | null;
};

/**
 * The L1 block at which the first of these delegations can be undelegated, or 0 when at least one
 * of them already can. Delegations with nothing deposited are ignored.
 */
export function earliestUnlockBlock(delegations: DelegationLockState[] | undefined): number {
  let earliest: number | undefined;

  for (const d of delegations || []) {
    if (BigInt(d.deposit || '0') === 0n) continue;
    if (!d.locked || !d.lockEnd) return 0;
    if (earliest === undefined || d.lockEnd < earliest) earliest = d.lockEnd;
  }

  return earliest ?? 0;
}

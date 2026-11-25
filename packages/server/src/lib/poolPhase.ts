export type PoolPhase = 'collecting' | 'active' | 'debt' | 'idle' | 'failed' | 'closed' | 'unknown';

/**
 * Mirrors the contract's PoolHasDebt condition: a pool is in debt only after it
 * was funded (`credit` > 0) and the remaining balance (`getCredit`) ran out.
 * A pool that was never funded (e.g. created with distribution rate 0) is not in debt.
 */
export function isInDebt(totalCredit: bigint, remainingCredit: bigint): boolean {
  return totalCredit > 0n && remainingCredit === 0n;
}

export function getPhase(state?: number, inDebt?: boolean): PoolPhase {
  switch (state) {
    case 0:
      return 'collecting';
    case 1:
      return inDebt ? 'debt' : 'active';
    case 2:
      return 'idle';
    case 3:
      return 'failed';
    case 4:
      return 'closed';
  }
  return 'unknown';
}

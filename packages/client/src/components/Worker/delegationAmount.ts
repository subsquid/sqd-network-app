import { toSqd } from '@lib/network/utils';

const SQD_DECIMALS = 18;

// Plain decimal notation only: no sign, no exponent, no hex, no thousands or comma separators.
const DECIMAL = /^(\d+\.?\d*|\.\d+)$/;

export type DelegationAmount =
  | { kind: 'empty' }
  | { kind: 'invalid' }
  | { kind: 'zero' }
  | { kind: 'positive'; wei: bigint };

/**
 * Reads the amount exactly as the user typed it.
 *
 * `Staking.deposit(worker, 0)` is a real action: it restarts the lock on the caller's whole
 * delegation. So an amount must only ever become zero when the user typed a zero. Anything that
 * is not a plain number, or that is too small to express in wei, is invalid rather than 0.
 */
export function parseDelegationAmount(raw: unknown): DelegationAmount {
  const value = String(raw ?? '').trim();
  if (value === '') return { kind: 'empty' };
  if (!DECIMAL.test(value)) return { kind: 'invalid' };

  const fraction = value.split('.')[1] || '';
  if (fraction.replace(/0+$/, '').length > SQD_DECIMALS) return { kind: 'invalid' };

  const wei = BigInt(toSqd(value));

  return wei === 0n ? { kind: 'zero' } : { kind: 'positive', wei };
}

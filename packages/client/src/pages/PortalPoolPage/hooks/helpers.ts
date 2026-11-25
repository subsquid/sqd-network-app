import type { PoolPhase } from './types';

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
  }
  return 'unknown';
}

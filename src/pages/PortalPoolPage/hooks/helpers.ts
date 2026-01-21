import type { PoolPhase } from './types';

export function getPhase(state?: number, isOutOfMoney?: boolean): PoolPhase {
  switch (state) {
    case 0:
      return 'collecting';
    case 1:
      return isOutOfMoney ? 'debt' : 'active';
    case 2:
      return 'idle';
    case 3:
      return 'failed';
  }
  return 'unknown';
}

export function parseMetadata(value?: string): {
  name?: string;
  description?: string;
  website?: string;
} {
  try {
    return value ? JSON.parse(value) : {};
  } catch (error) {
    return {};
  }
}

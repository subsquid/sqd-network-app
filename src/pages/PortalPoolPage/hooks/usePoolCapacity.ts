import { useMemo } from 'react';

import { calculateCapacity, type CapacityInfo } from '../utils/poolUtils';

import { usePoolData } from './usePoolData';
import { usePoolUserData } from './usePoolUserData';

/**
 * Hook to calculate pool capacity information
 * Encapsulates the logic of calculating capacity with memoization
 */
export function usePoolCapacity(poolId?: string): CapacityInfo | null {
  const { data: pool } = usePoolData(poolId);
  const { data: userData } = usePoolUserData(poolId);

  return useMemo(() => {
    if (!pool) return null;
    return calculateCapacity(pool, userData?.userBalance);
  }, [pool, userData?.userBalance]);
}

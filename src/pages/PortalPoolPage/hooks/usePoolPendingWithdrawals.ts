import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { trpc } from '@api/trpc';
import { useAccount } from 'wagmi';

import type { PendingWithdrawal } from './types';

export function usePoolPendingWithdrawals(poolId?: string) {
  const { address } = useAccount();

  const { data: raw, isLoading } = useQuery(trpc.pool.pendingWithdrawals.queryOptions(
    { poolId: poolId!, address: address! },
    {
      enabled: !!poolId && !!address,
    },
  ));

  const data = useMemo<PendingWithdrawal[]>(() => {
    if (!raw) return [];

    return raw.map(w => ({
      id: w.id,
      amount: w.amount,
      estimatedCompletionAt: new Date(w.estimatedCompletionAt),
    }));
  }, [raw]);

  return {
    data,
    isLoading,
  };
}

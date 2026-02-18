import { useQuery } from '@tanstack/react-query';

import { trpc } from '@api/trpc';

interface TopUp {
  txHash: string;
  timestamp: string;
  amount: string;
}

interface UseTopUpsProps {
  poolId: string;
  limit?: number;
  offset?: number;
}

export function useTopUps({ poolId, limit = 15, offset = 0 }: UseTopUpsProps) {
  const { data, isLoading, error } = useQuery(trpc.pool.topUps.queryOptions(
    {
      poolId: poolId.toLowerCase(),
      limit,
      offset,
    },
    {
      enabled: !!poolId,
      refetchInterval: 30000,
    },
  ));

  return {
    topUps: (data?.topUps as TopUp[]) || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
  };
}

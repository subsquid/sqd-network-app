import { useTopUpsQuery } from '@api/pool-squid/graphql';

interface UseTopUpsProps {
  poolId: string;
  limit?: number;
  offset?: number;
}

export function useTopUps({ poolId, limit = 15, offset = 0 }: UseTopUpsProps) {
  const { data, isLoading, error } = useTopUpsQuery(
    {
      poolId: poolId.toLowerCase(),
      limit,
      offset,
    },
    {
      enabled: !!poolId,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  );

  return {
    topUps: data?.topUps || [],
    totalCount: data?.topUpsConnection?.totalCount || 0,
    isLoading,
    error,
  };
}

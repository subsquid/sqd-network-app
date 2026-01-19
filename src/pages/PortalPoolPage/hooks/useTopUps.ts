import { useTopUpsQuery } from '@api/pool-squid/graphql';

interface UseTopUpsProps {
  poolId: string;
  limit?: number;
}

export function useTopUps({ poolId, limit = 50 }: UseTopUpsProps) {
  const { data, isLoading, error } = useTopUpsQuery(
    {
      poolId: poolId.toLowerCase(),
      limit,
    },
    {
      enabled: !!poolId,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  );

  return {
    topUps: data?.topUps || [],
    isLoading,
    error,
  };
}

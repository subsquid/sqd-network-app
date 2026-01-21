import { useLiquidityEventsQuery } from '@api/pool-squid/graphql';

interface UseLiquidityEventsProps {
  poolId: string;
  limit?: number;
}

export function useLiquidityEvents({ poolId, limit = 15 }: UseLiquidityEventsProps) {
  const { data, isLoading, error } = useLiquidityEventsQuery(
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
    events: data?.liquidityEvents || [],
    isLoading,
    error,
  };
}

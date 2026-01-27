import { useLiquidityEventsQuery } from '@api/pool-squid/graphql';

interface UseLiquidityEventsProps {
  poolId: string;
  limit?: number;
  offset?: number;
}

export function useLiquidityEvents({ poolId, limit = 15, offset = 0 }: UseLiquidityEventsProps) {
  const { data, isLoading, error } = useLiquidityEventsQuery(
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
    events: data?.liquidityEvents || [],
    totalCount: data?.liquidityEventsConnection?.totalCount || 0,
    isLoading,
    error,
  };
}

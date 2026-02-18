import { LiquidityEventType } from '@api/types';
import { useQuery } from '@tanstack/react-query';

import { trpc } from '@api/trpc';

interface LiquidityEvent {
  eventType: LiquidityEventType;
  txHash: string;
  timestamp: string;
  providerId?: string;
  amount: string;
}

interface UseLiquidityEventsProps {
  poolId: string;
  limit?: number;
  offset?: number;
}

export function useLiquidityEvents({ poolId, limit = 15, offset = 0 }: UseLiquidityEventsProps) {
  const { data, isLoading, error } = useQuery(trpc.pool.liquidityEvents.queryOptions(
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
    events: (data?.liquidityEvents as LiquidityEvent[]) || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
  };
}

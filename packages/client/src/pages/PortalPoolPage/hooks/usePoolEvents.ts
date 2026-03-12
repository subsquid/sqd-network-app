import { useQuery } from '@tanstack/react-query';

import { trpc } from '@api/trpc';
import type { EventType } from '@api/types';

export interface PoolEvent {
  id: string;
  eventType: EventType;
  txHash: string;
  timestamp: string;
  providerId?: string | null;
  amount: string;
  blockNumber: number;
}

interface UsePoolEventsProps {
  poolId: string;
  providerId?: string;
  eventTypes?: EventType[];
  limit?: number;
  offset?: number;
}

export function usePoolEvents({
  poolId,
  providerId,
  eventTypes,
  limit = 15,
  offset = 0,
}: UsePoolEventsProps) {
  const { data, isLoading, error } = useQuery(
    trpc.pool.events.queryOptions(
      {
        poolId: poolId.toLowerCase(),
        providerId: providerId?.toLowerCase(),
        eventTypes: eventTypes?.length ? eventTypes : undefined,
        limit,
        offset,
      },
      {
        enabled: !!poolId,
        refetchInterval: 30000,
      },
    ),
  );

  return {
    events: (data?.events as PoolEvent[]) || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
  };
}

import { useClaimsQuery } from '@api/pool-squid/graphql';

interface UseClaimsProps {
  poolId: string;
  providerId?: string;
  limit?: number;
  offset?: number;
}

export function useClaims({ poolId, providerId, limit = 15, offset = 0 }: UseClaimsProps) {
  const { data, isLoading, error } = useClaimsQuery(
    {
      poolId: poolId.toLowerCase(),
      providerId: providerId?.toLowerCase() || '',
      limit,
      offset,
    },
    {
      enabled: !!poolId,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  );

  return {
    claims: data?.claims || [],
    totalCount: data?.claimsConnection?.totalCount || 0,
    isLoading,
    error,
  };
}

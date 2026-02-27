export interface ClaimRecord {
  providerId?: string;
  amount: string;
  timestamp: string;
  txHash: string;
}

interface UseClaimsProps {
  poolId: string;
  providerId?: string;
  limit?: number;
  offset?: number;
}

export function useClaims({ poolId, providerId, limit = 15, offset = 0 }: UseClaimsProps) {
  return {
    claims: [] as ClaimRecord[],
    totalCount: 0,
    isLoading: false,
    error: undefined,
  };
}

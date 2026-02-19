import { useQuery } from '@tanstack/react-query';

import { trpc } from '@api/trpc';

export function useRewardTokens() {
  const { data, isLoading } = useQuery(trpc.pool.rewardTokens.queryOptions());

  return {
    data,
    isLoading,
  };
}

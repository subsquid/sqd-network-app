import { useQuery } from '@tanstack/react-query';

import { trpc } from '@api/trpc';
import { toSqd } from '@lib/network';

export function useNetworkSettings() {
  const { data, isPending, isLoading } = useQuery(trpc.network.settings.queryOptions());

  const bondAmount = data?.bondAmount ?? toSqd(100_000);
  const minimalWorkerVersion = data?.minimalWorkerVersion ?? '>=0.0.0';
  const recommendedWorkerVersion = data?.recommendedWorkerVersion ?? '>=0.0.0';

  return {
    bondAmount,
    minimalWorkerVersion,
    recommendedWorkerVersion,
    isPending,
    isLoading,
  };
}

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { trpc } from '@api/trpc';

export function useStakeInfo(selectedSourceAddress: `0x${string}`) {
  const { data, isLoading } = useQuery(
    trpc.contract.stakeInfo.queryOptions(
      { sourceAddress: selectedSourceAddress },
      { enabled: !!selectedSourceAddress },
    ),
  );

  const stake = useMemo(() => {
    if (!data?.stake) return undefined;
    return {
      amount: BigInt(data.stake.amount),
      duration: BigInt(data.stake.duration),
      lockStart: BigInt(data.stake.lockStart),
      lockEnd: BigInt(data.stake.lockEnd),
      autoExtension: data.stake.autoExtension,
      oldCUs: BigInt(data.stake.oldCUs),
    };
  }, [data?.stake]);

  return {
    stake,
    cuAmount: data ? BigInt(data.cuAmount) : undefined,
    currentEpoch: data?.currentEpoch,
    workerEpochLength: data ? BigInt(data.workerEpochLength) : undefined,
    isLoading,
    isPending: data?.isPending ?? false,
    isActive: data?.isActive ?? false,
    isExpired: data?.isExpired ?? false,
    appliedAt: data?.appliedAt,
    unlockedAt: data?.unlockedAt,
    cuPerEpoch: data ? BigInt(data.cuPerEpoch) : 0n,
  };
}

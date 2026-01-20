import { useMemo } from 'react';

import {
  useReadGatewayRegistryComputationUnitsAmount,
  useReadGatewayRegistryGetStake,
  useReadNetworkControllerWorkerEpochLength,
  useReadRouterNetworkController,
} from '@api/contracts';
import { useCurrentEpoch } from '@api/subsquid-network-squid';
import { getBlockTime } from '@lib/network';
import { useContracts } from '@hooks/network/useContracts';

export function useStakeInfo(selectedSourceAddress: `0x${string}`) {
  const { GATEWAY_REGISTRATION, ROUTER } = useContracts();

  const { data: stake, isLoading: isStakeLoading } = useReadGatewayRegistryGetStake({
    address: GATEWAY_REGISTRATION,
    args: [selectedSourceAddress],
  });

  const { data: cuAmount, isLoading: isCuAmountLoading } =
    useReadGatewayRegistryComputationUnitsAmount({
      address: GATEWAY_REGISTRATION,
      args: [stake?.amount || 0n, stake?.duration || 0n],
    });

  const { data: currentEpoch } = useCurrentEpoch();

  const { data: workerEpochLength, isLoading: isWorkerEpochLengthLoading } =
    useReadNetworkControllerWorkerEpochLength({
      address: useReadRouterNetworkController({ address: ROUTER }).data,
    });

  const isLoading = isStakeLoading || isCuAmountLoading || isWorkerEpochLengthLoading;

  const isPending = useMemo(() => {
    return (
      !!currentEpoch?.lastBlockL1 && !!stake?.amount && stake.lockStart > currentEpoch.lastBlockL1
    );
  }, [currentEpoch?.lastBlockL1, stake?.amount, stake?.lockStart]);

  const isActive = useMemo(() => {
    return (
      !!currentEpoch?.lastBlockL1 &&
      !!stake?.amount &&
      stake.lockStart <= currentEpoch?.lastBlockL1 &&
      stake.lockEnd >= currentEpoch?.lastBlockL1
    );
  }, [currentEpoch?.lastBlockL1, stake?.amount, stake?.lockStart, stake?.lockEnd]);

  const isExpired = useMemo(() => {
    return (
      !!currentEpoch?.lastBlockL1 && !!stake?.amount && stake.lockEnd < currentEpoch.lastBlockL1
    );
  }, [currentEpoch?.lastBlockL1, stake?.amount, stake?.lockEnd]);

  const appliedAt = useMemo(() => {
    if (!stake || !currentEpoch?.lastBlockL1) return;

    return new Date(
      new Date(currentEpoch.lastBlockTimestampL1).getTime() +
        getBlockTime(Number(stake.lockStart) - currentEpoch.lastBlockL1 + 1),
    ).toISOString();
  }, [currentEpoch, stake]);

  const unlockedAt = useMemo(() => {
    if (!stake || !currentEpoch?.lastBlockL1 || stake.autoExtension) return;

    return new Date(
      new Date(currentEpoch.lastBlockTimestampL1).getTime() +
        getBlockTime(Number(stake.lockEnd) - currentEpoch.lastBlockL1 + 1),
    ).toISOString();
  }, [currentEpoch, stake]);

  const cuPerEpoch = useMemo(() => {
    if (!stake?.lockEnd || !workerEpochLength || !currentEpoch?.lastBlockL1 || isExpired) return 0;

    const computationUnits =
      stake.lockStart > currentEpoch.lastBlockL1 ? stake.oldCUs : cuAmount || 0n;
    if (stake.duration < workerEpochLength) return computationUnits;

    return (computationUnits * workerEpochLength) / stake.duration;
  }, [cuAmount, isExpired, currentEpoch, stake, workerEpochLength]);

  return {
    stake,
    cuAmount,
    currentEpoch,
    workerEpochLength,
    isLoading,
    isPending,
    isActive,
    isExpired,
    appliedAt,
    unlockedAt,
    cuPerEpoch,
  };
}

import { useMemo } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';

import { portalPoolAbi } from '@api/contracts';
import { unwrapMulticallResult } from '@lib/network';
import { useAccount } from '@network/useAccount';

import type { PendingWithdrawal } from './types';

export function usePoolPendingWithdrawals(poolId?: string) {
  const { address } = useAccount();

  const portalPoolContract = {
    abi: portalPoolAbi,
    address: poolId as `0x${string}`,
  } as const;

  // First, get the ticket count
  const { data: ticketCount } = useReadContract({
    ...portalPoolContract,
    functionName: 'getTicketCount',
    args: [address as `0x${string}`],
    query: {
      enabled: !!poolId && !!address,
    },
  });

  // Generate ticket IDs array based on count
  const ticketIds = useMemo(() => {
    if (!ticketCount) return [];
    const count = Number(ticketCount);
    return Array.from({ length: count }, (_, i) => BigInt(i));
  }, [ticketCount]);

  // Query all ticket data (both ticket details and queue status)
  const { data: ticketsData, isLoading } = useReadContracts({
    contracts: ticketIds.flatMap(ticketId => [
      {
        ...portalPoolContract,
        functionName: 'getExitTicket',
        args: [address as `0x${string}`, ticketId],
      } as const,
      {
        ...portalPoolContract,
        functionName: 'getQueueStatusWithTimestamp',
        args: [address as `0x${string}`, ticketId],
      } as const,
    ]),
    query: {
      enabled: !!poolId && !!address && ticketIds.length > 0,
    },
  });

  const data = useMemo<PendingWithdrawal[]>(() => {
    if (!poolId || !address || !ticketsData || ticketIds.length === 0) return [];

    const withdrawals: PendingWithdrawal[] = [];

    for (let i = 0; i < ticketIds.length; i++) {
      // Each ticket has 2 contract calls: getExitTicket and getQueueStatusWithTimestamp
      const exitTicketResult = ticketsData[i * 2];
      const queueStatusResult = ticketsData[i * 2 + 1];

      const exitTicket = unwrapMulticallResult(exitTicketResult) as {
        endPosition: bigint;
        amount: bigint;
        withdrawn: boolean;
      };
      const queueStatus = unwrapMulticallResult(queueStatusResult) as [
        bigint,
        bigint,
        bigint,
        boolean,
        bigint,
      ];

      // Convert timestamps to milliseconds
      const unlockTimestampMs = Number(queueStatus[4]) * 1000;

      withdrawals.push({
        id: ticketIds[i].toString(),
        amount: exitTicket?.amount ?? 0n,
        estimatedCompletionAt: new Date(unlockTimestampMs),
      });
    }

    return withdrawals;
  }, [poolId, address, ticketsData, ticketIds]);

  return {
    data,
    isLoading,
  };
}

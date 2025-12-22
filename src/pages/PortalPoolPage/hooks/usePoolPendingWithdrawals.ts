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

  // Query all ticket data
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
      refetchInterval: 10000,
    },
  });

  const data = useMemo<PendingWithdrawal[]>(() => {
    if (!poolId || !address || !ticketsData || ticketIds.length === 0) return [];

    const withdrawals: PendingWithdrawal[] = [];

    for (let i = 0; i < ticketIds.length; i++) {
      const exitTicketResult = ticketsData[i * 2];
      const queueStatusResult = ticketsData[i * 2 + 1];

      const exitTicket = unwrapMulticallResult(exitTicketResult) as
        | { endPosition: bigint; amount: bigint; withdrawn: boolean }
        | undefined;
      const queueStatus = unwrapMulticallResult(queueStatusResult) as
        | {
            processed: bigint;
            userEndPos: bigint;
            secondsRemaining: bigint;
            ready: boolean;
            unlockTimestamp: bigint;
          }
        | undefined;

      if (!exitTicket || !queueStatus) continue;

      // Only display withdrawals that haven't been claimed yet (withdrawn === false)
      if (exitTicket.withdrawn === true) continue;

      const isReady = queueStatus.ready;

      // Use unlockTimestamp from getQueueStatusWithTimestamp
      const unlockTimestampSeconds = Number(queueStatus.unlockTimestamp);
      const estimatedCompletionAt = new Date(unlockTimestampSeconds * 1000);

      // Validate the date before converting to ISO string
      if (isNaN(estimatedCompletionAt.getTime())) {
        continue; // Skip invalid tickets
      }

      const now = Date.now();
      const timeUntilCompletion = estimatedCompletionAt.getTime() - now;

      // Determine status based on time remaining
      let status: 'pending' | 'processing' | 'ready';
      if (isReady || timeUntilCompletion <= 0) {
        status = 'ready';
      } else if (timeUntilCompletion < 24 * 60 * 60 * 1000) {
        // Less than 24 hours remaining
        status = 'processing';
      } else {
        status = 'pending';
      }

      withdrawals.push({
        id: ticketIds[i].toString(),
        amount: exitTicket.amount,
        requestedAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(), // We don't have exact request time from contract
        estimatedCompletionAt: estimatedCompletionAt.toISOString(),
        status,
      });
    }

    return withdrawals;
  }, [poolId, address, ticketsData, ticketIds]);

  return {
    data,
    isLoading,
  };
}


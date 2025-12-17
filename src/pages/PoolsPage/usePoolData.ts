import { useMemo } from 'react';
import { useAccount } from '@network/useAccount';

// Pool phases:
// - 'deposit_window': Pool created, users depositing, portal inactive
// - 'active': Base (1M SQD) + 20% buffer reached, portal operating
// - 'paused': Buffer dropped below minimum, yields stopped
export type PoolPhase = 'deposit_window' | 'active' | 'paused';

export interface PoolOperator {
  name: string;
  address: string;
}

export interface PendingWithdrawal {
  id: string;
  amount: bigint;
  requestedAt: string;
  estimatedCompletionAt: string;
  status: 'pending' | 'processing' | 'ready';
}

export interface WithdrawalQueue {
  // Global limit on SQD that can be withdrawn per time window
  windowLimit: bigint;
  // Current amount already queued in this window
  windowUsed: bigint;
  // Window duration (e.g., "24 hours")
  windowDuration: string;
  // Time until window resets
  windowResetIn?: string;
}

export interface PoolData {
  id: string;
  name: string;
  operator: PoolOperator;
  phase: PoolPhase;
  // APY is calculated as: (monthlyPayoutUsd * 12) / (tvl * sqdPrice)
  apy: number;
  // Monthly payout to SQD providers in USD (e.g., $3000/month)
  monthlyPayoutUsd: number;
  tvl: {
    current: bigint;
    max: bigint; // Pool capacity
  };
  // Activation threshold: Base (1M) + 20% buffer = 1.2M to activate
  activation: {
    baseAmount: bigint; // 1M SQD
    bufferPercent: number; // 20%
    threshold: bigint; // 1.2M SQD (base + buffer)
  };
  buffer: {
    current: bigint;
    min: bigint; // Minimum buffer to keep yields active
  };
  withdrawalQueue: WithdrawalQueue;
  userBalance: bigint;
  userPendingWithdrawals: PendingWithdrawal[];
  maxDepositPerAddress: bigint;
  withdrawWaitTime?: string;
}

// Mock data for UI development - will be replaced with actual contract/GraphQL data
export function usePoolData(poolId?: string) {
  const { address } = useAccount();

  const data = useMemo<PoolData | undefined>(() => {
    if (!poolId) return undefined;

    // Mock pool data
    return {
      id: poolId,
      name: 'Portal Pool',
      operator: {
        name: 'Subsquid',
        address: '0x1234567890abcdef1234567890abcdef12345678',
      },
      phase: 'paused' as PoolPhase,
      apy: 0.04, // 4% - calculated as (monthlyPayoutUsd * 12) / (tvl in USD)
      monthlyPayoutUsd: 3000, // $3,000 per month paid to SQD providers
      tvl: {
        current: BigInt('607000000000000000000000'), // 607k SQD (18 decimals)
        max: BigInt('1000000000000000000000000'), // 1M SQD (Pool capacity per pool)
      },
      activation: {
        baseAmount: BigInt('1000000000000000000000000'), // 1M SQD base requirement
        bufferPercent: 0, // No buffer requirement for activation
        threshold: BigInt('1000000000000000000000000'), // 1M SQD to activate
      },
      buffer: {
        current: BigInt('120000000000000000000000'), // 120k SQD (current buffer above minimum)
        min: BigInt('100000000000000000000000'), // 100k SQD minimum to keep yields
      },
      withdrawalQueue: {
        windowLimit: BigInt('100000000000000000000000'), // 100k SQD per window
        windowUsed: BigInt('35000000000000000000000'), // 35k SQD already queued
        windowDuration: '24 hours',
        windowResetIn: '18 hours',
      },
      userBalance: address ? BigInt('12345600000000000000000') : BigInt(0), // 12,345.6 SQD
      userPendingWithdrawals: address
        ? [
            {
              id: '1',
              amount: BigInt('500000000000000000000'), // 500 SQD
              requestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
              estimatedCompletionAt: new Date(Date.now()).toISOString(),
              status: 'ready' as const,
            },
            {
              id: '2',
              amount: BigInt('1000000000000000000000'), // 1,000 SQD
              requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
              estimatedCompletionAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
              status: 'processing' as const,
            },
          ]
        : [],
      maxDepositPerAddress: BigInt('100000000000000000000000'), // 100k SQD
      withdrawWaitTime: '2 days',
    };
  }, [poolId, address]);

  return {
    data,
    isLoading: false,
  };
}

// Helper to calculate buffer health percentage
export function calculateBufferHealth(pool: PoolData): number {
  const current = Number(pool.buffer.current);
  const min = Number(pool.buffer.min);
  if (min === 0) return 100;
  return (current / min) * 100;
}

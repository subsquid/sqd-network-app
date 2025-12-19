import { useMemo } from 'react';
import { useAccount } from '@network/useAccount';
import { portalPoolAbi, portalRegistryAbi } from '@api/contracts';
import { unwrapMulticallResult } from '@lib/network';
import { useReadContracts } from 'wagmi';
import { BigNumber } from 'bignumber.js';
import { useContracts } from '@network/useContracts';

// Pool phases:
// - 'deposit_window': Pool created, users depositing, portal inactive
// - 'active': Base (1M SQD) + 20% buffer reached, portal operating
// - 'paused': Buffer dropped below minimum, yields stopped
export type PoolPhase = 'deposit_window' | 'active' | 'paused' | 'unknown';

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
  description?: string;
  website?: string;
  operator: PoolOperator;
  phase: PoolPhase;
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
  depositWindowEndsAt?: Date; // When the deposit window closes (only for deposit_window phase)
  buffer: {
    current: bigint;
    min: bigint; // Minimum buffer to keep yields active
  };
  withdrawalQueue: WithdrawalQueue;
  maxDepositPerAddress: bigint;
  withdrawWaitTime?: string;
}

export interface PoolUserData {
  userBalance: bigint;
  userRewards: bigint; // Claimable rewards earned by the user in USDC (6 decimals)
}

function getPhase(state?: number) {
  switch (state) {
    case 0:
      return 'deposit_window';
    case 1:
      return 'active';
    case 2:
      return 'paused';
  }
  return 'unknown';
}

function parseMetadata(value?: string): { name?: string; description?: string; website?: string } {
  try {
    return value ? JSON.parse(value) : {};
  } catch (error) {
    return {};
  }
}

// Fetches pool-level data (no user-specific data)
export function usePoolData(poolId?: string) {
  const { GATEWAY_REGISTRATION } = useContracts();

  const portalPoolContract = {
    abi: portalPoolAbi,
    address: poolId as `0x${string}`,
  } as const;

  const gatewayRegistrationContract = {
    abi: portalRegistryAbi,
    address: GATEWAY_REGISTRATION,
  } as const;

  const { data: contractData, isLoading } = useReadContracts({
    contracts: [
      {
        ...portalPoolContract,
        functionName: 'getActiveStake',
      },
      {
        ...portalPoolContract,
        functionName: 'getPortalInfo',
      },
      {
        ...portalPoolContract,
        functionName: 'getState',
      },
      {
        ...portalPoolContract,
        functionName: 'distributionRateScaled',
      },
      {
        ...portalPoolContract,
        functionName: 'maxStakePerWallet',
      },
      {
        ...gatewayRegistrationContract,
        functionName: 'getMetadata',
        args: [poolId as `0x${string}`],
      },
    ] as const,
    query: {
      enabled: !!poolId,
      select(data) {
        const activeStake = unwrapMulticallResult(data?.[0]) || 0n;
        const portalInfo = unwrapMulticallResult(data?.[1]);
        const state = unwrapMulticallResult(data?.[2]);
        const distributionRatePerSecond = unwrapMulticallResult(data?.[3]) || 0n;
        const maxStakePerWallet = unwrapMulticallResult(data?.[4]) || 0n;
        const metadata = parseMetadata(unwrapMulticallResult(data?.[5]));

        if (!portalInfo) return undefined;

        return {
          name: metadata.name || 'Portal Pool',
          description: metadata.description,
          website: metadata.website,
          activeStake,
          ...portalInfo,
          state,
          distributionRatePerSecond,
          maxStakePerWallet,
        };
      },
    },
  });

  const data = useMemo<PoolData | undefined>(() => {
    if (!poolId) return undefined;
    if (!contractData) return undefined;

    const {
      name,
      description,
      website,
      operator,
      state,
      distributionRatePerSecond,
      activeStake,
      maxCapacity,
      depositDeadline,
      maxStakePerWallet,
    } = contractData;

    return {
      id: poolId,
      name,
      description,
      website,
      operator: {
        name: operator,
        address: operator,
      },
      phase: getPhase(state),
      monthlyPayoutUsd: BigNumber(distributionRatePerSecond)
        .dividedBy(10n ** 36n)
        .multipliedBy(30)
        .multipliedBy(86400)
        .toNumber(),
      tvl: {
        current: activeStake,
        max: maxCapacity,
      },
      activation: {
        baseAmount: BigInt('1000000000000000000000000'), // 1M SQD base requirement
        bufferPercent: 0, // No buffer requirement for activation
        threshold: BigInt('1000000000000000000000000'), // 1M SQD to activate
      },
      depositWindowEndsAt: new Date(Number(depositDeadline) * 1000),
      buffer: {
        current: BigInt('120000000000000000000000'), // 120k SQD (current buffer above minimum) - TODO: get from contract
        min: BigInt('100000000000000000000000'), // 100k SQD minimum to keep yields - TODO: get from contract
      },
      withdrawalQueue: {
        windowLimit: BigInt('100000000000000000000000'), // TODO: get from contract
        windowUsed: BigInt('35000000000000000000000'), // TODO: get from contract
        windowDuration: '24 hours', // TODO: get from contract
        windowResetIn: '18 hours', // TODO: calculate from contract data
      },
      maxDepositPerAddress: maxStakePerWallet,
      withdrawWaitTime: '2 days', // TODO: get from contract
    };
  }, [poolId, contractData]);

  return {
    data,
    isLoading,
  };
}

// Fetches user-specific data for a pool
export function usePoolUserData(poolId?: string) {
  const { address } = useAccount();

  const portalPoolContract = {
    abi: portalPoolAbi,
    address: poolId as `0x${string}`,
  } as const;

  const { data: contractData, isLoading } = useReadContracts({
    contracts: [
      {
        ...portalPoolContract,
        functionName: 'getProviderStake',
        args: [address as `0x${string}`],
      },
      {
        ...portalPoolContract,
        functionName: 'getClaimableRewards',
        args: [address as `0x${string}`],
      },
    ] as const,
    query: {
      enabled: !!poolId && !!address,
    },
  });

  const data = useMemo<PoolUserData | undefined>(() => {
    if (!poolId || !address || !contractData) return undefined;

    const userBalance = unwrapMulticallResult(contractData?.[0]) || 0n;
    const userRewards = unwrapMulticallResult(contractData?.[1]) || 0n;

    return {
      userBalance,
      userRewards,
    };
  }, [poolId, address, contractData]);

  return {
    data,
    isLoading,
  };
}

// Fetches pending withdrawals for a user
// Note: This is a placeholder implementation. In production, you'll likely need to:
// 1. Track ticket IDs from ExitRequested events (via indexer/subgraph)
// 2. Or store ticket IDs in local storage/database
// 3. Then fetch the actual ticket data using getExitTicket and getQueueStatus
export function usePoolPendingWithdrawals(poolId?: string, ticketIds: string[] = []) {
  const { address } = useAccount();

  // Mock data for now - replace with actual contract calls when ticket IDs are available
  const data = useMemo<PendingWithdrawal[]>(() => {
    if (!poolId || !address) return [];

    // TODO: For each ticketId, call:
    // - getExitTicket(address, ticketId) to get ticket info
    // - getQueueStatus(address, ticketId) to get queue status
    // Then map to PendingWithdrawal interface

    // Mock data
    return [
      {
        id: '1',
        amount: BigInt('500000000000000000000'), // 500 SQD
        requestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        estimatedCompletionAt: new Date(Date.now()).toISOString(),
        status: 'ready' as const,
      },
      {
        id: '2',
        amount: BigInt('1000000000000000000000'), // 1,000 SQD
        requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        estimatedCompletionAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        status: 'processing' as const,
      },
    ];
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

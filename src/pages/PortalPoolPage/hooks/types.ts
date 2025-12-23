// Pool phases:
// - 'collecting': Pool created, users depositing, portal inactive
// - 'active': Base (1M SQD) + 20% buffer reached, portal operating
// - 'idle': Buffer dropped below minimum, yields stopped
// - 'debt': Pool is in debt, yields stopped
// - 'failed': Pool has failed, yields stopped
export type PoolPhase = 'collecting' | 'active' | 'debt' | 'idle' | 'failed' | 'unknown';

export interface PoolOperator {
  name: string;
  address: string;
}

export interface PendingWithdrawal {
  id: string;
  amount: bigint;
  estimatedCompletionAt: Date;
}

export interface WithdrawalQueue {
  windowLimit: bigint;
  windowUsed: bigint;
  windowDuration: string;
  windowResetIn?: string;
}

export interface PoolData {
  id: string;
  name: string;
  description?: string;
  website?: string;
  operator: PoolOperator;
  phase: PoolPhase;
  monthlyPayoutUsd: number;
  distributionRatePerSecond: bigint;
  tvl: {
    current: bigint;
    max: bigint;
    min: bigint;
  };
  depositWindowEndsAt?: Date;
  withdrawalQueue: WithdrawalQueue;
  maxDepositPerAddress: bigint;
  withdrawWaitTime?: string;
  lptTokenSymbol?: string;
  lptToken: string;
}

export interface PoolUserData {
  userBalance: bigint;
  userRewards: bigint;
}


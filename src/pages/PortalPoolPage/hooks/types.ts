import type BigNumber from 'bignumber.js';

import type { ERC20TokenData } from '@hooks/useERC20';

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
  amount: BigNumber;
  estimatedCompletionAt: Date;
}

export interface WithdrawalQueue {
  windowLimit: bigint;
  windowUsed: bigint;
  windowDuration: string;
  windowResetIn?: string;
}

export interface PoolTvl {
  current: BigNumber;
  total: BigNumber;
  max: BigNumber;
  min: BigNumber;
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
  tvl: PoolTvl;
  depositWindowEndsAt?: Date;
  withdrawalQueue: WithdrawalQueue;
  maxDepositPerAddress: BigNumber;
  withdrawWaitTime?: string;
  lptToken: ERC20TokenData;
  rewardToken: ERC20TokenData;
  createdAt: Date;
}

export interface PoolUserData {
  userBalance: BigNumber;
  userRewards: bigint;
}

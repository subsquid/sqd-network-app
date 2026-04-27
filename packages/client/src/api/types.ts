import type { AppRouter } from '@sqd/server';
import type { inferRouterOutputs } from '@trpc/server';

export type RouterOutput = inferRouterOutputs<AppRouter>;

// Worker types
export type Worker = RouterOutput['worker']['list'][number];
export type WorkerDetailed = RouterOutput['worker']['get'][number];

// Gateway types
export type Gateway = RouterOutput['gateway']['listMine'][number];

// Account types
export type Vesting = NonNullable<RouterOutput['account']['vesting']>;

// Enum constants
export const AccountType = {
  User: 'USER',
  Vesting: 'VESTING',
  TemporaryHolding: 'TEMPORARY_HOLDING',
} as const;
export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const WorkerStatus = {
  Active: 'ACTIVE',
  Registering: 'REGISTERING',
  Deregistering: 'DEREGISTERING',
  Deregistered: 'DEREGISTERED',
  Withdrawn: 'WITHDRAWN',
  Unknown: 'UNKNOWN',
} as const;
export type WorkerStatus = (typeof WorkerStatus)[keyof typeof WorkerStatus];

export const EventType = {
  Deposit: 'DEPOSIT',
  Withdrawal: 'WITHDRAWAL',
  Exit: 'EXIT',
  Topup: 'TOPUP',
  Claim: 'CLAIM',
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];

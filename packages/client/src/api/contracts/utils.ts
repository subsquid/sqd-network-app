import {
  type Abi,
  BaseError as BaseViemError,
  ContractFunctionRevertedError,
  type Hex,
  decodeErrorResult,
} from 'viem';
import type { WriteContractData } from 'wagmi/query';

export type TxResult = { tx: WriteContractData; error?: never } | { error: string; tx?: never };

export type WriteContractRes =
  | { success: true; failedReason?: never }
  | { success: false; failedReason: string };

/**
 * OpenZeppelin v5 + common Solidity custom errors.
 * Used as a fallback ABI for `decodeErrorResult` when the call-site ABI
 * didn't include error definitions.
 */
const COMMON_ERRORS_ABI = [
  {
    type: 'error',
    name: 'ERC20InsufficientBalance',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'balance', type: 'uint256' },
      { name: 'needed', type: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InsufficientAllowance',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'allowance', type: 'uint256' },
      { name: 'needed', type: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InvalidApprover',
    inputs: [{ name: 'approver', type: 'address' }],
  },
  {
    type: 'error',
    name: 'ERC20InvalidSpender',
    inputs: [{ name: 'spender', type: 'address' }],
  },
  {
    type: 'error',
    name: 'ERC20InvalidSender',
    inputs: [{ name: 'sender', type: 'address' }],
  },
  {
    type: 'error',
    name: 'ERC20InvalidReceiver',
    inputs: [{ name: 'receiver', type: 'address' }],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [{ name: 'account', type: 'address' }],
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [{ name: 'owner', type: 'address' }],
  },
  {
    type: 'error',
    name: 'AccessControlUnauthorizedAccount',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'neededRole', type: 'bytes32' },
    ],
  },
  {
    type: 'error',
    name: 'EnforcedPause',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ExpectedPause',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ReentrancyGuardReentrantCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FailedCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientBalance',
    inputs: [
      { name: 'balance', type: 'uint256' },
      { name: 'needed', type: 'uint256' },
    ],
  },
] as const;

/** User-friendly labels for known decoded error names. */
const ERROR_LABELS: Record<string, string> = {
  ERC20InsufficientBalance: 'Insufficient token balance',
  ERC20InsufficientAllowance: 'Insufficient token allowance',
  ERC20InvalidApprover: 'Invalid token approver',
  ERC20InvalidSpender: 'Invalid token spender',
  ERC20InvalidSender: 'Invalid token sender',
  ERC20InvalidReceiver: 'Invalid token receiver',
  OwnableUnauthorizedAccount: 'Not authorized',
  OwnableInvalidOwner: 'Invalid owner',
  AccessControlUnauthorizedAccount: 'Not authorized for this role',
  EnforcedPause: 'Contract is paused',
  ExpectedPause: 'Contract is not paused',
  ReentrancyGuardReentrantCall: 'Reentrant call detected',
  FailedCall: 'Internal contract call failed',
  InsufficientBalance: 'Insufficient balance',
  // Portal pool errors
  InvalidState: 'Operation not allowed in current pool state',
  PoolPaused: 'Contract is paused',
  PoolNotFailed: 'Pool is not in failed state',
  NotActivated: 'Pool has not been activated yet',
  PoolClosed: 'Pool is closed',
  PoolNotClosed: 'Pool is not closed',
  InsufficientStake: 'Insufficient stake',
  InsufficientTransferableStake: 'Insufficient transferable stake',
  CapacityExceeded: 'Pool is at maximum capacity',
  ExceedsWalletLimit: 'Exceeds per-wallet limit',
  NoStakeToWithdraw: 'Nothing to withdraw',
  UseWithdrawFromFailed: "Use 'Withdraw' for failed pools",
  WaitForActivationOrDeadline: 'Pool is still collecting',
  NoActiveExitRequest: 'No active exit request',
  StillInQueue: 'Withdrawal still in queue',
  AlreadyWithdrawn: 'Already withdrawn',
  NotOperator: 'Only the pool operator can do this',
  NotAdmin: 'Not authorized (admin required)',
  NotWhitelisted: 'Not whitelisted for this pool',
  InvalidAmount: 'Invalid amount',
  BelowMinimum: 'Below minimum threshold',
  BelowCurrentStake: 'Below current stake',
  NoChange: 'No change detected',
  NothingToClaim: 'Nothing to claim',
  DistributionTurnedOff: 'Distribution rate is zero',
  PoolHasDebt: 'Pool has outstanding debt',
  RateExceedsMaximum: 'Rate exceeds maximum',
  RateBelowMinimum: 'Rate below minimum',
  TokenNotAllowed: 'Token not allowed',
  InvalidFeeConfig: 'Invalid fee configuration',
};

const PANIC_REASONS: Record<number, string> = {
  0x01: 'Assertion failed',
  0x11: 'Arithmetic overflow or underflow',
  0x12: 'Division or modulo by zero',
  0x21: 'Invalid enum value',
  0x31: 'Pop on empty array',
  0x32: 'Array index out of bounds',
  0x41: 'Out of memory',
  0x51: 'Invalid function pointer',
};

function formatDecodedError(errorName: string, args?: readonly unknown[]): string {
  if (errorName === 'Panic') {
    const code = Number(args?.[0] ?? 0);
    return PANIC_REASONS[code] ?? `Panic (code ${code})`;
  }

  if (ERROR_LABELS[errorName]) {
    return ERROR_LABELS[errorName];
  }

  return errorName;
}

function tryDecodeRawError(data: Hex, extraAbis?: Abi[]): string | null {
  const abisToTry: Abi[] = [COMMON_ERRORS_ABI as unknown as Abi, ...(extraAbis ?? [])];

  for (const abi of abisToTry) {
    try {
      const decoded = decodeErrorResult({ abi, data });
      return formatDecodedError(decoded.errorName, decoded.args);
    } catch {
      continue;
    }
  }

  return null;
}

export function errorMessage(e: unknown, extraAbis?: Abi[]): string {
  if (!(e instanceof BaseViemError)) {
    return e instanceof Error ? e.message : e?.toString() || 'Unknown error';
  }

  const revertError = e.walk(err => err instanceof ContractFunctionRevertedError);

  if (revertError instanceof ContractFunctionRevertedError) {
    if (revertError.reason) {
      return revertError.reason;
    }

    if (revertError.data) {
      return formatDecodedError(revertError.data.errorName, revertError.data.args);
    }

    if (revertError.raw) {
      const decoded = tryDecodeRawError(revertError.raw, extraAbis);
      if (decoded) return decoded;
    }

    if (revertError.signature) {
      const decoded = tryDecodeRawError(revertError.signature as Hex, extraAbis);
      if (decoded) return decoded;
    }
  }

  const shortMsg = e.shortMessage;
  if (shortMsg) {
    const reasonMatch = shortMsg.match(/reverted with the following reason:\s*\n(.+)/);
    if (reasonMatch?.[1]?.trim()) {
      return reasonMatch[1].trim();
    }

    const sigMatch = shortMsg.match(/reverted with the following signature:\s*\n(0x[a-fA-F0-9]+)/);
    if (sigMatch?.[1]) {
      const decoded = tryDecodeRawError(sigMatch[1] as Hex, extraAbis);
      if (decoded) return decoded;
    }

    const lastLine = shortMsg
      .split('\n')
      .filter(l => l.trim())
      .pop()
      ?.trim();
    if (lastLine) {
      if (lastLine.startsWith('0x')) {
        const decoded = tryDecodeRawError(lastLine as Hex, extraAbis);
        if (decoded) return decoded;
        if (e.metaMessages?.length) return e.metaMessages.join('\n');
      }
      return lastLine;
    }
  }

  return e.message;
}

const USER_REJECTION_PATTERNS = [
  /user rejected/i,
  /user denied/i,
  /rejected the request/i,
  /user cancelled/i,
  /action_rejected/i,
];

export function isUserRejection(e: unknown): boolean {
  if (!(e instanceof Error)) return false;
  const msg = e.message;
  return USER_REJECTION_PATTERNS.some(p => p.test(msg));
}

export function isApproveRequiredError(error: unknown) {
  if (typeof error !== 'string') return;

  const message = error.toLowerCase();

  return message.includes('insufficient allowance') || message.includes('0xfb8f41b2');
}

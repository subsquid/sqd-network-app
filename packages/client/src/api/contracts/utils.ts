import { BaseError as BaseViemError } from 'viem';
import { WriteContractData } from 'wagmi/query';

export type TxResult = { tx: WriteContractData; error?: never } | { error: string; tx?: never };

export type WriteContractRes =
  | { success: true; failedReason?: never }
  | { success: false; failedReason: string };

const KNOWN_ERRORS: Record<string, string> = {
  '0xe450d38c': 'Insufficient balance',
};

export function errorMessage(e: unknown) {
  if (e instanceof BaseViemError) {
    const message = e.shortMessage.split('\n').pop();

    if (message) {
      if (KNOWN_ERRORS[message]) return KNOWN_ERRORS[message];
      else if (message.startsWith('0x') && e.metaMessages) return e.metaMessages?.join('\n');

      return message;
    }

    return e.message;
  }

  return e instanceof Error ? e.message : e?.toString() || 'unknown error';
}

export function isApproveRequiredError(error: unknown) {
  if (typeof error !== 'string') return;

  const message = error.toLowerCase();

  return (
    message.includes('insufficient allowance') || //  openzeppelin old version
    message.includes('0xfb8f41b2') // openzeppelin new version
  );
}

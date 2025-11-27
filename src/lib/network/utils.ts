import BigNumber from 'bignumber.js';
import bs58 from 'bs58';
import { MulticallResponse, toHex } from 'viem';

import { SQD_DECIMALS } from '../../api/contracts/consts';

export function fromSqd(value?: string | number | bigint | BigNumber): BigNumber {
  if (!value) return BigNumber('0');

  value = BigNumber(typeof value === 'bigint' ? value.toString() : value);
  return value.shiftedBy(-SQD_DECIMALS);
}

export function toSqd(value?: string | number | BigNumber): string {
  if (!value) return '0';

  value = BigNumber(value);
  if (value.isNaN()) return '0';

  return value.shiftedBy(SQD_DECIMALS).toFixed(0);
}

export function peerIdToHex(peerId: string) {
  return toHex(bs58.decode(peerId));
}

export function unwrapMulticallResult<T>(result?: MulticallResponse<T>): T | undefined {
  return result?.status === 'success' ? (result.result as T) : undefined;
}

export function getBlockTime(blocksCount: number | bigint) {
  return Number(blocksCount) * 12_000;
}

export function isOwned(
  something: { owner: { id: string; owner?: { id: string } } },
  address: string | undefined,
) {
  return (
    address != null && (something.owner.id === address || something.owner.owner?.id === address)
  );
}

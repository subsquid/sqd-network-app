import BigNumber from 'bignumber.js';
import prettyBytes from 'pretty-bytes';
import { zeroAddress } from 'viem';
import { getAddress } from 'viem/utils';

export function percentFormatter(value?: number | string | BigNumber, decimals = 2) {
  value = BigNumber(value || 0);

  return `${value.lt(0.01) && value.gt(0) ? '<0.01%' : value.toFixed(decimals)}%`;
}

const formatter8 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 8,
});

export function numberWithCommasFormatter(val?: number | bigint | string) {
  if (!val) return '0';

  return formatter8.format(typeof val === 'string' ? Number(val) : val);
}

export function bytesFormatter(val?: number | string, compact?: boolean) {
  // if (!val) return '0 MB';

  return prettyBytes(Number(val || 0), {
    maximumFractionDigits: 2,
    locale: 'en-US',
    space: !compact,
  });
}

const formatterCompact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

export function numberCompactFormatter(val?: number | bigint | string) {
  if (!val) return '0';

  return formatterCompact.format(Number(val));
}

export function addressFormatter(val?: string, compact?: boolean) {
  val = val || zeroAddress;

  const address = getAddress(val);
  return compact ? `${address.substring(0, 6)}...${address?.slice(-4)}` : address;
}

export function urlFormatter(val: string) {
  val = val.trim().toLowerCase();
  return val.startsWith('http://') || val.startsWith('https://')
    ? val
    : val.replace(/^(?!(?:\w+?:)?\/\/)/, 'https://');
}

const tokenFormatOptions = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
};



export function tokenFormatter(val: number | BigNumber, currency: string, decimals = 3) {
  const bn = BigNumber(val);
  const rounded = bn.decimalPlaces(decimals, BigNumber.ROUND_FLOOR);

  const res =
    rounded.eq(0) && !bn.eq(0)
      ? '< ' + BigNumber(1).shiftedBy(-decimals).toFormat(tokenFormatOptions)
      : rounded.toFormat(tokenFormatOptions);

  return res + ` ${currency}`;
}

const toDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function dollarFormatter(val: number | BigNumber) {
  return toDollar.format(Number(val));
}

export const toCompact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
export const toNumber = new Intl.NumberFormat('en-US');

export const toDateSeconds = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZone: 'UTC',
});

export const toDateDay = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

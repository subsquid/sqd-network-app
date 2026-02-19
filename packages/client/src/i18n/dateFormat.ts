import { format, isValid } from 'date-fns';

export function dateFormat(
  value: Date | string | number | undefined,
  tpl: 'dateTime' | 'date' | string = 'date',
) {
  if (!value) return undefined;

  if (tpl === 'dateTime') {
    tpl = 'dd.MM.yyyy HH:mm:ss';
  } else if (tpl === 'date') {
    tpl = 'dd.MM.yyyy';
  }

  if (value.valueOf() == 0) return undefined;

  const date = new Date(value);
  if (!isValid(date)) return undefined;

  return format(new Date(value), tpl);
}

export function relativeDateFormat(
  from: Date | string | number | undefined,
  to: Date | string | number | undefined,
) {
  const fromMs = typeof from === 'number' ? from : new Date(from || 0).getTime();
  const toMs = typeof to === 'number' ? to : new Date(to || 0).getTime();
  const diff = Math.max(toMs - fromMs, 0) / 1000;

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = Math.floor(diff % 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

import { addMilliseconds } from 'date-fns';
import { toDateDay, toDateSeconds } from '@lib/formatters/formatters';

export { createGenerator } from '@lib/array';
export { toUTCDate } from '@lib/datemath';

export function toTimeRange(date: Date, stepMs?: number): string {
  if (!stepMs) return toDateSeconds.format(date);

  const from = date;
  const to = addMilliseconds(date, stepMs - 1);

  // formatRange is available but not in all TypeScript lib versions
  const formatRange = (formatter: Intl.DateTimeFormat) =>
    (
      formatter as Intl.DateTimeFormat & { formatRange: (start: Date, end: Date) => string }
    ).formatRange(from, to);

  if (stepMs >= 24 * 60 * 60 * 1000) {
    return formatRange(toDateDay);
  }

  return formatRange(toDateSeconds);
}

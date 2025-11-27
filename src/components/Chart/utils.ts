import { addMilliseconds } from 'date-fns';
import { toDateDay, toDateSeconds } from '@lib/formatters/formatters';

// Re-export general utilities from lib for backward compatibility
export { createGenerator } from '@lib/array';
export { toUTCDate } from '@lib/datemath';

// ============================================================================
// Chart-Specific Utility Functions
// ============================================================================

/**
 * Formats a date as a time range based on step size
 * This is chart-specific as it's used for chart tooltip/axis formatting
 */
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

import {
  add,
  sub,
  startOfSecond,
  startOfMinute,
  startOfHour,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfSecond,
  endOfMinute,
  endOfHour,
  endOfDay,
  endOfWeek,
  endOfMonth,
  endOfYear,
  parseISO,
  isValid,
} from 'date-fns';

type Unit = 'y' | 'M' | 'w' | 'd' | 'h' | 'm' | 's';

interface MathOperation {
  operator: '+' | '-';
  amount: number;
  unit: Unit;
}

interface RoundOperation {
  unit: Unit;
}

interface ParsedExpression {
  anchor: Date;
  operations: MathOperation[];
  rounding?: RoundOperation;
}

// Unit mappings for date-fns
const UNIT_MAP: Record<Unit, any> = {
  y: 'years',
  M: 'months',
  w: 'weeks',
  d: 'days',
  h: 'hours',
  m: 'minutes',
  s: 'seconds',
};

export function parseDateMath(expression: string, anchor: Date = new Date()): Date {
  if (!expression) return anchor;

  // Handle "now" or relative expressions
  if (expression === 'now') {
    return anchor;
  }

  // Handle anchor||expression format (e.g., "2024-01-01||+1M")
  if (expression.includes('||')) {
    const [anchorStr, mathStr] = expression.split('||');
    const parsedAnchor = parseISO(anchorStr);
    if (!isValid(parsedAnchor)) {
      throw new Error(`Invalid anchor date: ${anchorStr}`);
    }
    return parseDateMath(mathStr, parsedAnchor);
  }

  // Parse relative expression (now+1h, now-5m/d, etc.)
  const parsed = parseExpression(expression, anchor);
  return applyExpression(parsed);
}

/**
 * Check if a string is a valid date math expression
 */
export function isDateMathExpression(expression: string): boolean {
  try {
    if (!expression) return false;

    // Check for basic patterns
    const patterns = [
      /^now([+-]\d+[yMwdhms])*(?:\/[yMwdhms])?$/,
      /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?)?\|\|[+-]\d+[yMwdhms](?:\/[yMwdhms])?$/,
      /^now.*to.*now.*$/,
    ];

    return patterns.some(pattern => pattern.test(expression));
  } catch {
    return false;
  }
}

function parseExpression(expression: string, anchor: Date): ParsedExpression {
  let current = expression;
  const operations: MathOperation[] = [];
  let rounding: RoundOperation | undefined;

  // Handle rounding (e.g., /d, /h)
  const roundMatch = current.match(/\/([yMwdhms])$/);
  if (roundMatch) {
    rounding = { unit: roundMatch[1] as Unit };
    current = current.replace(/\/[yMwdhms]$/, '');
  }

  // Remove "now" prefix
  if (current.startsWith('now')) {
    current = current.substring(3);
  }

  // Parse math operations (e.g., +1h, -5m, +2d-1h)
  const mathRegex = /([+-])(\d+)([yMwdhms])/g;
  let match;

  while ((match = mathRegex.exec(current)) !== null) {
    const [, operator, amountStr, unit] = match;
    operations.push({
      operator: operator as '+' | '-',
      amount: parseInt(amountStr, 10),
      unit: unit as Unit,
    });
  }

  return {
    anchor,
    operations,
    rounding,
  };
}

function applyExpression({ anchor, operations, rounding }: ParsedExpression): Date {
  let result = new Date(anchor);

  // Apply math operations
  for (const op of operations) {
    const duration = { [UNIT_MAP[op.unit]]: op.amount };

    if (op.operator === '+') {
      result = add(result, duration);
    } else {
      result = sub(result, duration);
    }
  }

  // Apply rounding
  if (rounding) {
    result = roundToStartOfUnit(result, rounding.unit);
  }

  return result;
}

function roundToStartOfUnit(date: Date, unit: Unit): Date {
  switch (unit) {
    case 's':
      return startOfSecond(date);
    case 'm':
      return startOfMinute(date);
    case 'h':
      return startOfHour(date);
    case 'd':
      return startOfDay(date);
    case 'w':
      return startOfWeek(date);
    case 'M':
      return startOfMonth(date);
    case 'y':
      return startOfYear(date);
    default:
      return date;
  }
}

export function roundToEndOfUnit(date: Date, unit: Unit): Date {
  switch (unit) {
    case 's':
      return endOfSecond(date);
    case 'm':
      return endOfMinute(date);
    case 'h':
      return endOfHour(date);
    case 'd':
      return endOfDay(date);
    case 'w':
      return endOfWeek(date);
    case 'M':
      return endOfMonth(date);
    case 'y':
      return endOfYear(date);
    default:
      return date;
  }
}

export function parseDateMathEnd(expression: string, anchor: Date = new Date()): Date {
  if (!expression) return anchor;

  const hasRounding = /\/[yMwdhms]$/.test(expression);

  if (hasRounding) {
    const parsed = parseExpression(expression, anchor);
    let result = new Date(anchor);

    for (const op of parsed.operations) {
      const duration = { [UNIT_MAP[op.unit]]: op.amount };

      if (op.operator === '+') {
        result = add(result, duration);
      } else {
        result = sub(result, duration);
      }
    }

    if (parsed.rounding) {
      result = roundToEndOfUnit(result, parsed.rounding.unit);
    }

    return result;
  }

  return parseDateMath(expression, anchor);
}

export function parseTimeRange(start: string, end: string): { from: Date; to: Date } {
  return { from: parseDateMath(start), to: parseDateMathEnd(end) };
}

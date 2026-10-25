import { OperationType } from '../types/calculator';

/**
 * Normalizes floating point numbers to avoid JS float precision bugs (e.g. 0.1 + 0.2 = 0.30000000000000004)
 */
export function normalizeFloat(value: number, precision = 10): number {
  if (!isFinite(value) || isNaN(value)) return value;
  const factor = Math.pow(10, precision);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function performOperation(
  a: number,
  b: number,
  op: OperationType
): { result: number; error?: string } {
  if (isNaN(a) || isNaN(b)) {
    return { result: NaN, error: 'Invalid numerical operand' };
  }

  switch (op) {
    case 'add':
      return { result: normalizeFloat(a + b) };
    case 'subtract':
      return { result: normalizeFloat(a - b) };
    case 'multiply':
      return { result: normalizeFloat(a * b) };
    case 'divide':
      if (b === 0) {
        return { result: NaN, error: 'Division by zero is undefined' };
      }
      return { result: normalizeFloat(a / b) };
    default:
      return { result: NaN, error: 'Unsupported operation' };
  }
}

export function getOperatorSymbol(op: OperationType): string {
  switch (op) {
    case 'add':
      return '+';
    case 'subtract':
      return '−';
    case 'multiply':
      return '×';
    case 'divide':
      return '÷';
  }
}

export function getOperationName(op: OperationType): string {
  switch (op) {
    case 'add':
      return 'Addition';
    case 'subtract':
      return 'Subtraction';
    case 'multiply':
      return 'Multiplication';
    case 'divide':
      return 'Division';
  }
}

export function formatNumber(val: number, options?: { maxDecimals?: number; useGrouping?: boolean }): string {
  if (isNaN(val)) return 'Error';
  if (!isFinite(val)) return val > 0 ? 'Infinity' : '-Infinity';

  const maxDecimals = options?.maxDecimals ?? 8;
  const useGrouping = options?.useGrouping ?? true;

  // If number has fractional part, preserve up to maxDecimals
  const normalized = normalizeFloat(val, maxDecimals);

  // Use Intl.NumberFormat for clean localized formatting
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDecimals,
    useGrouping,
  }).format(normalized);
}

export function getDivisionBreakdown(dividend: number, divisor: number): {
  quotient: number;
  remainder: number;
  decimalResult: number;
} | null {
  if (divisor === 0) return null;
  const quotient = Math.trunc(dividend / divisor);
  const remainder = normalizeFloat(dividend % divisor);
  const decimalResult = normalizeFloat(dividend / divisor);
  return { quotient, remainder, decimalResult };
}

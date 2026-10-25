import { helpers } from '@vuelidate/validators';

export const isNumeric = helpers.withMessage(
  'Please enter a valid numeric value',
  (value: unknown) => {
    if (value === null || value === undefined || value === '') return false;
    const str = String(value).trim();
    if (str === '-' || str === '+' || str === '.') return false;
    return !isNaN(Number(str)) && isFinite(Number(str));
  }
);

export const notZero = helpers.withMessage(
  'Cannot divide by zero (undefined mathematical operation)',
  (value: unknown) => {
    if (value === null || value === undefined || value === '') return true;
    const num = Number(value);
    return !isNaN(num) && num !== 0;
  }
);

export const isNonNegative = helpers.withMessage(
  'Value cannot be negative',
  (value: unknown) => {
    if (value === null || value === undefined || value === '') return true;
    const num = Number(value);
    return isNaN(num) || num >= 0;
  }
);

export const isPositive = helpers.withMessage(
  'Value must be greater than zero',
  (value: unknown) => {
    if (value === null || value === undefined || value === '') return true;
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }
);

export const isReasonableSize = helpers.withMessage(
  'Value exceeds allowed computational range (-1e15 to 1e15)',
  (value: unknown) => {
    if (value === null || value === undefined || value === '') return true;
    const num = Number(value);
    return isNaN(num) || (Math.abs(num) <= 1e15);
  }
);

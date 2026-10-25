export type OperationType = 'add' | 'subtract' | 'multiply' | 'divide';

export interface HistoryItem {
  id: string;
  timestamp: Date;
  operand1: number;
  operand2: number;
  operation: OperationType;
  operatorSymbol: string;
  result: number;
  expression: string;
  formattedResult: string;
  mode: 'keypad' | 'formula' | 'split' | 'percent';
}

export interface CalculatorMemory {
  value: number;
  hasValue: boolean;
  lastUpdated?: Date;
}

export interface ValidationState {
  isValid: boolean;
  errors: Record<string, string[]>;
}

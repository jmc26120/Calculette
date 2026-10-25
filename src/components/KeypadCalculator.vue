<template>
  <div class="w-full max-w-md mx-auto">
    <v-card elevation="2" rounded="lg" class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <!-- Calculator Header & State Indicators -->
      <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
            Four Operations Keypad
          </span>
          <v-chip
            v-if="memory.hasValue"
            size="x-small"
            color="primary"
            variant="flat"
            class="font-mono font-bold text-[10px]"
            title="Stored Memory Value"
          >
            M: {{ formatMemoryVal(memory.value) }}
          </v-chip>
        </div>

        <div class="flex items-center gap-1">
          <v-btn
            icon="mdi-content-copy"
            size="x-small"
            variant="text"
            color="secondary"
            title="Copy current display value"
            :disabled="isError"
            @click="copyCurrentValue"
          />
          <v-btn
            icon="mdi-keyboard-outline"
            size="x-small"
            variant="text"
            color="secondary"
            title="Keyboard shortcuts available"
            @click="$emit('open-shortcuts')"
          />
        </div>
      </div>

      <!-- Digital Display Surface -->
      <div class="p-5 bg-slate-900 text-white select-none">
        <!-- Sub-expression / Calculation Formula -->
        <div class="h-6 flex items-center justify-end text-xs font-mono text-slate-400 truncate">
          <span>{{ equationPreview }}</span>
          <span v-if="activeOperator" class="ml-1 text-amber-400 font-bold">
            {{ getOperatorSymbol(activeOperator) }}
          </span>
        </div>

        <!-- Main Digits Readout -->
        <div class="mt-1 flex items-baseline justify-end overflow-hidden">
          <span
            class="font-mono font-semibold tracking-tight tabular-nums transition-all duration-75 text-right select-all"
            :class="[
              displayString.length > 13 ? 'text-2xl' : displayString.length > 9 ? 'text-3xl' : 'text-4xl',
              isError ? 'text-rose-400' : 'text-white'
            ]"
          >
            {{ formattedDisplay }}
          </span>
        </div>

        <!-- Zero Division Alert Banner -->
        <div
          v-if="isDivisionByZeroRisk"
          class="mt-2 text-[11px] font-sans flex items-center gap-1.5 text-rose-300 bg-rose-950/60 px-2 py-1 rounded border border-rose-800/60"
        >
          <v-icon icon="mdi-alert-circle-outline" size="14" />
          <span>Division by zero is undefined. Press a non-zero digit or clear.</span>
        </div>
      </div>

      <!-- Memory Controls Bar -->
      <div class="grid grid-cols-5 gap-1 p-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
        <v-btn
          size="small"
          variant="text"
          :disabled="!memory.hasValue"
          class="font-mono text-xs font-bold text-slate-600 dark:text-slate-300"
          @click="handleMemoryAction('MC')"
        >
          MC
        </v-btn>
        <v-btn
          size="small"
          variant="text"
          :disabled="!memory.hasValue"
          class="font-mono text-xs font-bold text-slate-600 dark:text-slate-300"
          @click="handleMemoryAction('MR')"
        >
          MR
        </v-btn>
        <v-btn
          size="small"
          variant="text"
          class="font-mono text-xs font-bold text-slate-600 dark:text-slate-300"
          @click="handleMemoryAction('M+')"
        >
          M+
        </v-btn>
        <v-btn
          size="small"
          variant="text"
          class="font-mono text-xs font-bold text-slate-600 dark:text-slate-300"
          @click="handleMemoryAction('M-')"
        >
          M-
        </v-btn>
        <v-btn
          size="small"
          variant="text"
          class="font-mono text-xs font-bold text-primary font-bold"
          @click="handleMemoryAction('MS')"
        >
          MS
        </v-btn>
      </div>

      <!-- Main Tactile Keypad Grid -->
      <div class="p-4 grid grid-cols-4 gap-2.5">
        <!-- Row 1: AC, CE, ⌫, ÷ -->
        <v-btn
          height="52"
          variant="tonal"
          color="error"
          class="text-sm font-bold tracking-wider rounded-lg"
          @click="handleAllClear"
        >
          AC
        </v-btn>
        <v-btn
          height="52"
          variant="tonal"
          color="secondary"
          class="text-sm font-bold tracking-wider rounded-lg"
          @click="handleClearEntry"
        >
          CE
        </v-btn>
        <v-btn
          height="52"
          variant="tonal"
          color="secondary"
          class="rounded-lg"
          title="Backspace"
          @click="handleBackspace"
        >
          <v-icon icon="mdi-backspace-outline" size="20" />
        </v-btn>
        <v-btn
          height="52"
          :variant="activeOperator === 'divide' ? 'flat' : 'tonal'"
          color="primary"
          class="text-lg font-bold rounded-lg transition-transform active:scale-95"
          @click="handleOperator('divide')"
        >
          ÷
        </v-btn>

        <!-- Row 2: 7, 8, 9, × -->
        <v-btn
          height="52"
          variant="elevated"
          class="text-lg font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
          @click="inputDigit('7')"
        >
          7
        </v-btn>
        <v-btn
          height="52"
          variant="elevated"
          class="text-lg font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
          @click="inputDigit('8')"
        >
          8
        </v-btn>
        <v-btn
          height="52"
          variant="elevated"
          class="text-lg font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
          @click="inputDigit('9')"
        >
          9
        </v-btn>
        <v-btn
          height="52"
          :variant="activeOperator === 'multiply' ? 'flat' : 'tonal'"
          color="primary"
          class="text-lg font-bold rounded-lg transition-transform active:scale-95"
          @click="handleOperator('multiply')"
        >
          ×
        </v-btn>

        <!-- Row 3: 4, 5, 6, − -->
        <v-btn
          height="52"
          variant="elevated"
          class="text-lg font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
          @click="inputDigit('4')"
        >
          4
        </v-btn>
        <v-btn
          height="52"
          variant="elevated"
          class="text-lg font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
          @click="inputDigit('5')"
        >
          5
        </v-btn>
        <v-btn
          height="52"
          variant="elevated"
          class="text-lg font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
          @click="inputDigit('6')"
        >
          6
        </v-btn>
        <v-btn
          height="52"
          :variant="activeOperator === 'subtract' ? 'flat' : 'tonal'"
          color="primary"
          class="text-xl font-bold rounded-lg transition-transform active:scale-95"
          @click="handleOperator('subtract')"
        >
          −
        </v-btn>

        <!-- Row 4: 1, 2, 3, + -->
        <v-btn
          height="52"
          variant="elevated"
          class="text-lg font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
          @click="inputDigit('1')"
        >
          1
        </v-btn>
        <v-btn
          height="52"
          variant="elevated"
          class="text-lg font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
          @click="inputDigit('2')"
        >
          2
        </v-btn>
        <v-btn
          height="52"
          variant="elevated"
          class="text-lg font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
          @click="inputDigit('3')"
        >
          3
        </v-btn>
        <v-btn
          height="52"
          :variant="activeOperator === 'add' ? 'flat' : 'tonal'"
          color="primary"
          class="text-lg font-bold rounded-lg transition-transform active:scale-95"
          @click="handleOperator('add')"
        >
          +
        </v-btn>

        <!-- Row 5: ±, 0, ., = -->
        <v-btn
          height="52"
          variant="tonal"
          color="secondary"
          class="text-base font-semibold rounded-lg"
          title="Negate (±)"
          @click="handleToggleSign"
        >
          ±
        </v-btn>
        <v-btn
          height="52"
          variant="elevated"
          class="text-lg font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
          @click="inputDigit('0')"
        >
          0
        </v-btn>
        <v-btn
          height="52"
          variant="elevated"
          class="text-xl font-bold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
          @click="inputDecimal"
        >
          .
        </v-btn>
        <v-btn
          height="52"
          variant="flat"
          color="primary"
          class="text-xl font-bold rounded-lg shadow-md transition-all hover:brightness-105 active:scale-95"
          :disabled="isDivisionByZeroRisk"
          @click="handleEquals"
        >
          =
        </v-btn>
      </div>

      <!-- Quick Operational Footer / Info Strip -->
      <div class="px-5 py-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span class="truncate">Precision: IEEE 754 float normalized</span>
        <div class="flex items-center gap-1 shrink-0">
          <v-btn
            size="x-small"
            variant="text"
            color="secondary"
            title="Calculate 10% percentage of current value"
            @click="handlePercentage"
          >
            %
          </v-btn>
          <span class="text-slate-300 dark:text-slate-700">|</span>
          <v-btn
            size="x-small"
            variant="text"
            color="secondary"
            title="Invert (1/x)"
            @click="handleReciprocal"
          >
            1/x
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { OperationType, CalculatorMemory, HistoryItem } from '../types/calculator';
import { performOperation, getOperatorSymbol, formatNumber, normalizeFloat } from '../utils/math';
import { audioManager } from '../utils/audio';

const emit = defineEmits<{
  (e: 'calculation-completed', item: HistoryItem): void;
  (e: 'notify', message: string, color?: string): void;
  (e: 'open-shortcuts'): void;
}>();

// State
const displayString = ref<string>('0');
const previousOperand = ref<number | null>(null);
const activeOperator = ref<OperationType | null>(null);
const waitingForSecondOperand = ref<boolean>(false);
const equationPreview = ref<string>('');
const isError = ref<boolean>(false);

const memory = ref<CalculatorMemory>({
  value: 0,
  hasValue: false,
});

// Computed
const formattedDisplay = computed(() => {
  if (isError.value) return displayString.value;
  const num = parseFloat(displayString.value);
  if (isNaN(num)) return displayString.value;

  // If user is currently typing a trailing decimal point or trailing zeros after decimal
  if (displayString.value.includes('.')) {
    const [intPart, decPart] = displayString.value.split('.');
    const formattedInt = new Intl.NumberFormat('en-US').format(Number(intPart) || 0);
    return `${formattedInt}.${decPart}`;
  }

  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 10 }).format(num);
});

// Guard against division by zero in real-time
const isDivisionByZeroRisk = computed(() => {
  if (activeOperator.value === 'divide' && parseFloat(displayString.value) === 0 && !waitingForSecondOperand.value) {
    return true;
  }
  return false;
});

// Methods
function formatMemoryVal(val: number): string {
  return formatNumber(val, { maxDecimals: 4 });
}

function inputDigit(digit: string) {
  audioManager.playClick('number');
  if (isError.value) {
    handleAllClear();
  }

  if (waitingForSecondOperand.value) {
    displayString.value = digit;
    waitingForSecondOperand.value = false;
  } else {
    if (displayString.value === '0') {
      displayString.value = digit;
    } else {
      if (displayString.value.replace('.', '').length < 16) {
        displayString.value += digit;
      }
    }
  }
}

function inputDecimal() {
  audioManager.playClick('number');
  if (isError.value) {
    handleAllClear();
  }

  if (waitingForSecondOperand.value) {
    displayString.value = '0.';
    waitingForSecondOperand.value = false;
    return;
  }

  if (!displayString.value.includes('.')) {
    displayString.value += '.';
  }
}

function handleOperator(op: OperationType) {
  audioManager.playClick('operator');
  if (isError.value) return;

  const currentVal = parseFloat(displayString.value);

  // If an operation was already pending and user taps another operator
  if (activeOperator.value && !waitingForSecondOperand.value && previousOperand.value !== null) {
    const { result, error } = performOperation(previousOperand.value, currentVal, activeOperator.value);
    if (error) {
      isError.value = true;
      displayString.value = error;
      emit('notify', error, 'error');
      audioManager.playClick('error');
      return;
    }

    // Save intermediate calculation to history
    recordHistoryItem(previousOperand.value, currentVal, activeOperator.value, result);

    previousOperand.value = result;
    displayString.value = String(result);
  } else {
    previousOperand.value = currentVal;
  }

  activeOperator.value = op;
  equationPreview.value = `${formatNumber(previousOperand.value!)} ${getOperatorSymbol(op)}`;
  waitingForSecondOperand.value = true;
}

function handleEquals() {
  audioManager.playClick('action');
  if (isError.value || !activeOperator.value || previousOperand.value === null) return;

  const currentVal = parseFloat(displayString.value);

  // Check division by zero
  if (activeOperator.value === 'divide' && currentVal === 0) {
    isError.value = true;
    displayString.value = 'Cannot divide by 0';
    emit('notify', 'Math Error: Division by zero is undefined', 'error');
    audioManager.playClick('error');
    return;
  }

  const { result, error } = performOperation(previousOperand.value, currentVal, activeOperator.value);
  if (error) {
    isError.value = true;
    displayString.value = error;
    emit('notify', error, 'error');
    audioManager.playClick('error');
    return;
  }

  const opSymbol = getOperatorSymbol(activeOperator.value);
  equationPreview.value = `${formatNumber(previousOperand.value)} ${opSymbol} ${formatNumber(currentVal)} =`;

  recordHistoryItem(previousOperand.value, currentVal, activeOperator.value, result);

  displayString.value = String(result);
  previousOperand.value = null;
  activeOperator.value = null;
  waitingForSecondOperand.value = true;
}

function recordHistoryItem(a: number, b: number, op: OperationType, res: number) {
  const opSymbol = getOperatorSymbol(op);
  const item: HistoryItem = {
    id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date(),
    operand1: a,
    operand2: b,
    operation: op,
    operatorSymbol: opSymbol,
    result: res,
    expression: `${formatNumber(a)} ${opSymbol} ${formatNumber(b)}`,
    formattedResult: formatNumber(res),
    mode: 'keypad',
  };
  emit('calculation-completed', item);
}

function handleAllClear() {
  audioManager.playClick('action');
  displayString.value = '0';
  previousOperand.value = null;
  activeOperator.value = null;
  waitingForSecondOperand.value = false;
  equationPreview.value = '';
  isError.value = false;
}

function handleClearEntry() {
  audioManager.playClick('action');
  displayString.value = '0';
  isError.value = false;
}

function handleBackspace() {
  audioManager.playClick('number');
  if (isError.value) {
    handleAllClear();
    return;
  }

  if (waitingForSecondOperand.value) return;

  if (displayString.value.length > 1) {
    displayString.value = displayString.value.slice(0, -1);
    if (displayString.value === '-' || displayString.value === '-0') {
      displayString.value = '0';
    }
  } else {
    displayString.value = '0';
  }
}

function handleToggleSign() {
  audioManager.playClick('number');
  if (isError.value || displayString.value === '0') return;

  if (displayString.value.startsWith('-')) {
    displayString.value = displayString.value.substring(1);
  } else {
    displayString.value = '-' + displayString.value;
  }
}

function handlePercentage() {
  audioManager.playClick('action');
  if (isError.value) return;
  const num = parseFloat(displayString.value);
  if (isNaN(num)) return;

  const percentVal = normalizeFloat(num / 100);
  displayString.value = String(percentVal);
}

function handleReciprocal() {
  audioManager.playClick('action');
  if (isError.value) return;
  const num = parseFloat(displayString.value);
  if (num === 0) {
    isError.value = true;
    displayString.value = 'Cannot divide by 0';
    emit('notify', 'Division by zero is undefined', 'error');
    audioManager.playClick('error');
    return;
  }

  const res = normalizeFloat(1 / num);
  recordHistoryItem(1, num, 'divide', res);
  displayString.value = String(res);
}

// Memory operations
function handleMemoryAction(action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') {
  audioManager.playClick('action');
  if (isError.value && action !== 'MC') return;

  const currentVal = parseFloat(displayString.value) || 0;

  switch (action) {
    case 'MC':
      memory.value = { value: 0, hasValue: false };
      emit('notify', 'Memory cleared', 'info');
      break;
    case 'MR':
      if (memory.value.hasValue) {
        displayString.value = String(memory.value.value);
        waitingForSecondOperand.value = false;
        emit('notify', `Memory recalled: ${memory.value.value}`, 'info');
      }
      break;
    case 'MS':
      memory.value = { value: currentVal, hasValue: true, lastUpdated: new Date() };
      emit('notify', `Stored ${currentVal} in memory`, 'success');
      break;
    case 'M+':
      memory.value = {
        value: normalizeFloat(memory.value.value + currentVal),
        hasValue: true,
        lastUpdated: new Date(),
      };
      emit('notify', `Added to memory (New: ${memory.value.value})`, 'info');
      break;
    case 'M-':
      memory.value = {
        value: normalizeFloat(memory.value.value - currentVal),
        hasValue: true,
        lastUpdated: new Date(),
      };
      emit('notify', `Subtracted from memory (New: ${memory.value.value})`, 'info');
      break;
  }
}

async function copyCurrentValue() {
  try {
    await navigator.clipboard.writeText(displayString.value);
    emit('notify', `Copied ${displayString.value} to clipboard`, 'success');
  } catch {
    emit('notify', 'Failed to copy to clipboard', 'error');
  }
}

// External injection for history reuse
function injectValue(val: number | string) {
  displayString.value = String(val);
  isError.value = false;
  waitingForSecondOperand.value = false;
}

// Keyboard shortcut event handler
function handleKeyDown(e: KeyboardEvent) {
  // Ignore if user is typing in an input field (e.g. Vuelidate form inputs)
  if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
    return;
  }

  if (e.key >= '0' && e.key <= '9') {
    e.preventDefault();
    inputDigit(e.key);
  } else if (e.key === '.') {
    e.preventDefault();
    inputDecimal();
  } else if (e.key === '+') {
    e.preventDefault();
    handleOperator('add');
  } else if (e.key === '-') {
    e.preventDefault();
    handleOperator('subtract');
  } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
    e.preventDefault();
    handleOperator('multiply');
  } else if (e.key === '/') {
    e.preventDefault();
    handleOperator('divide');
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    handleEquals();
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    handleBackspace();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    handleAllClear();
  } else if (e.key === 'Delete') {
    e.preventDefault();
    handleClearEntry();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

defineExpose({
  injectValue,
});
</script>

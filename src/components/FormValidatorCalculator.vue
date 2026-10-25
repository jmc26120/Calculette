<template>
  <div class="w-full max-w-4xl mx-auto space-y-6">
    <!-- Main Form Card -->
    <v-card elevation="2" rounded="lg" class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/60">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <v-icon icon="mdi-shield-check-outline" color="primary" size="20" />
            <span>Vuelidate Form Calculator</span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Strict validation with custom rules for the four fundamental arithmetic operations
          </p>
        </div>

        <!-- Real-time Vuelidate Status Badges -->
        <div class="flex items-center gap-2 text-xs">
          <span
            class="px-2 py-0.5 rounded text-[11px] font-mono font-medium border"
            :class="v$.$invalid ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50' : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50'"
          >
            {{ v$.$invalid ? 'Invalid Form' : 'Valid Form' }}
          </span>
          <span
            class="px-2 py-0.5 rounded text-[11px] font-mono font-medium border"
            :class="v$.$dirty ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'"
          >
            {{ v$.$dirty ? 'Dirty (Touched)' : 'Pristine' }}
          </span>
        </div>
      </div>

      <div class="p-6">
        <!-- Interactive Quick Presets Strip -->
        <div class="mb-6 flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium text-slate-500 mr-1">Quick Presets:</span>
          <v-btn
            size="x-small"
            variant="outlined"
            color="secondary"
            class="text-xs"
            @click="applyPreset(100, 'divide', 3)"
          >
            100 ÷ 3
          </v-btn>
          <v-btn
            size="x-small"
            variant="outlined"
            color="secondary"
            class="text-xs"
            @click="applyPreset(355, 'divide', 113)"
          >
            355 ÷ 113 (π approx)
          </v-btn>
          <v-btn
            size="x-small"
            variant="outlined"
            color="secondary"
            class="text-xs"
            @click="applyPreset(499.99, 'multiply', 1.2)"
          >
            499.99 × 1.2
          </v-btn>
          <v-btn
            size="x-small"
            variant="outlined"
            color="secondary"
            class="text-xs"
            @click="applyPreset(1024, 'subtract', 768)"
          >
            1024 − 768
          </v-btn>
          <v-btn
            size="x-small"
            variant="outlined"
            color="error"
            class="text-xs"
            title="Test division by zero Vuelidate rule"
            @click="applyPreset(50, 'divide', 0)"
          >
            50 ÷ 0 (Test Error)
          </v-btn>
        </div>

        <form @submit.prevent="handleSubmit">
          <v-row dense>
            <!-- Operand 1 -->
            <v-col cols="12" md="4">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                First Number (Operand A)
              </label>
              <v-text-field
                v-model="formData.operand1"
                placeholder="e.g. 145.75"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :error-messages="getErrors('operand1')"
                prefix="#"
                clearable
                @blur="v$.operand1.$touch()"
                @update:model-value="v$.operand1.$touch()"
              >
                <template #append-inner>
                  <v-icon
                    v-if="v$.operand1.$dirty && !v$.operand1.$invalid"
                    icon="mdi-check-circle"
                    color="success"
                    size="18"
                  />
                </template>
              </v-text-field>
              <span class="text-[11px] text-slate-500 mt-1 block">
                {{ getOperand1Term(formData.operation) }}
              </span>
            </v-col>

            <!-- Operation Selector -->
            <v-col cols="12" md="4">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Operation (+, −, ×, ÷)
              </label>
              <div class="grid grid-cols-4 gap-1.5">
                <v-btn
                  v-for="op in operations"
                  :key="op.value"
                  :variant="formData.operation === op.value ? 'flat' : 'outlined'"
                  :color="formData.operation === op.value ? 'primary' : undefined"
                  height="44"
                  class="font-bold text-base"
                  :title="op.title"
                  @click="selectOperation(op.value)"
                >
                  {{ op.symbol }}
                </v-btn>
              </div>
              <span class="text-[11px] text-slate-500 mt-1 block text-center">
                {{ getOperationName(formData.operation) }}
              </span>
            </v-col>

            <!-- Operand 2 -->
            <v-col cols="12" md="4">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Second Number (Operand B)
              </label>
              <v-text-field
                v-model="formData.operand2"
                placeholder="e.g. 24.5"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :error-messages="getErrors('operand2')"
                prefix="#"
                clearable
                @blur="v$.operand2.$touch()"
                @update:model-value="v$.operand2.$touch()"
              >
                <template #append-inner>
                  <v-icon
                    v-if="v$.operand2.$dirty && !v$.operand2.$invalid"
                    icon="mdi-check-circle"
                    color="success"
                    size="18"
                  />
                  <v-icon
                    v-else-if="v$.operand2.$dirty && v$.operand2.$invalid"
                    icon="mdi-alert-circle"
                    color="error"
                    size="18"
                  />
                </template>
              </v-text-field>
              <span class="text-[11px] text-slate-500 mt-1 block">
                {{ getOperand2Term(formData.operation) }}
              </span>
            </v-col>
          </v-row>

          <!-- Advanced Precision & Rounding Options -->
          <div class="mt-5 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <v-row dense align="center">
              <v-col cols="12" sm="6" md="5">
                <div class="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Decimal Precision:</span>
                  <span class="font-mono font-bold">{{ formData.precision }} digits</span>
                </div>
                <v-slider
                  v-model="formData.precision"
                  min="0"
                  max="10"
                  step="1"
                  thumb-label
                  color="primary"
                  hide-details
                />
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Thousand Separators
                </label>
                <v-switch
                  v-model="useSeparators"
                  color="primary"
                  density="compact"
                  hide-details
                  label="1,000,000 Grouping"
                />
              </v-col>

              <v-col cols="12" md="3" class="flex justify-end items-center gap-2 pt-2 md:pt-0">
                <v-btn
                  variant="text"
                  color="secondary"
                  size="small"
                  @click="resetForm"
                >
                  Reset
                </v-btn>
                <v-btn
                  type="submit"
                  color="primary"
                  variant="flat"
                  size="default"
                  prepend-icon="mdi-calculator"
                  :disabled="v$.$invalid"
                  class="font-semibold shadow-sm"
                >
                  Calculate
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </form>
      </div>

      <!-- Calculation Result & Mathematical Breakdown -->
      <div v-if="computation" class="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-6">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div class="text-xs uppercase tracking-wider font-semibold text-slate-500">Computed Output</div>
            <div class="font-mono text-3xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">
              {{ computation.formattedResult }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <v-btn
              size="small"
              variant="outlined"
              color="secondary"
              prepend-icon="mdi-content-copy"
              @click="copyResult"
            >
              Copy Result
            </v-btn>
            <v-btn
              size="small"
              variant="flat"
              color="primary"
              prepend-icon="mdi-swap-horizontal"
              @click="$emit('send-to-keypad', computation.result)"
            >
              Load in Keypad
            </v-btn>
          </div>
        </div>

        <!-- Formula Expression Tag -->
        <div class="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm">
          <div class="font-mono text-slate-800 dark:text-slate-200">
            <span class="text-slate-400">Formula: </span>
            <span class="font-semibold">{{ computation.expression }} = {{ computation.formattedResult }}</span>
          </div>
          <span class="text-xs text-slate-500">{{ getOperationName(computation.operation) }}</span>
        </div>

        <!-- Detailed Operation Specific Insights -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <!-- Division details -->
          <template v-if="computation.operation === 'divide' && divisionDetails">
            <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <span class="text-slate-500 block">Integer Quotient</span>
              <span class="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                {{ divisionDetails.quotient }}
              </span>
            </div>
            <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <span class="text-slate-500 block">Remainder</span>
              <span class="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                {{ divisionDetails.remainder }}
              </span>
            </div>
            <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <span class="text-slate-500 block">Mixed Fraction</span>
              <span class="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                {{ divisionDetails.quotient }} and {{ divisionDetails.remainder }}/{{ computation.operand2 }}
              </span>
            </div>
          </template>

          <!-- Multiplication details -->
          <template v-else-if="computation.operation === 'multiply'">
            <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <span class="text-slate-500 block">Multiplicand</span>
              <span class="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{{ computation.operand1 }}</span>
            </div>
            <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <span class="text-slate-500 block">Multiplier</span>
              <span class="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{{ computation.operand2 }}</span>
            </div>
            <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <span class="text-slate-500 block">Scientific Notation</span>
              <span class="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                {{ computation.result.toExponential(4) }}
              </span>
            </div>
          </template>

          <!-- Addition details -->
          <template v-else-if="computation.operation === 'add'">
            <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <span class="text-slate-500 block">Sum</span>
              <span class="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{{ computation.formattedResult }}</span>
            </div>
            <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <span class="text-slate-500 block">Commutative Equivalence</span>
              <span class="font-mono text-sm text-slate-700 dark:text-slate-300">
                {{ computation.operand2 }} + {{ computation.operand1 }}
              </span>
            </div>
            <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <span class="text-slate-500 block">Average (Mean)</span>
              <span class="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                {{ ((computation.operand1 + computation.operand2) / 2).toFixed(formData.precision) }}
              </span>
            </div>
          </template>

          <!-- Subtraction details -->
          <template v-else-if="computation.operation === 'subtract'">
            <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <span class="text-slate-500 block">Minuend</span>
              <span class="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{{ computation.operand1 }}</span>
            </div>
            <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <span class="text-slate-500 block">Subtrahend</span>
              <span class="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{{ computation.operand2 }}</span>
            </div>
            <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <span class="text-slate-500 block">Difference Sign</span>
              <span class="font-mono text-sm font-bold" :class="computation.result < 0 ? 'text-rose-500' : 'text-emerald-500'">
                {{ computation.result < 0 ? 'Negative (−)' : computation.result === 0 ? 'Zero (0)' : 'Positive (+)' }}
              </span>
            </div>
          </template>
        </div>
      </div>
    </v-card>

    <!-- Vuelidate Schema & Rules Inspector -->
    <v-card elevation="1" rounded="lg" class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <v-icon icon="mdi-code-json" size="18" color="secondary" />
          <span>Active Vuelidate Validation Schema</span>
        </h3>
        <span class="text-xs text-slate-500">Live Validator Introspection</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div class="font-semibold text-slate-700 dark:text-slate-300 mb-1">Operand 1 (A) Rules</div>
          <ul class="space-y-1 text-slate-600 dark:text-slate-400">
            <li class="flex items-center gap-1.5">
              <v-icon
                :icon="v$.operand1.required.$invalid ? 'mdi-close-circle-outline' : 'mdi-check-circle-outline'"
                :color="v$.operand1.required.$invalid ? 'error' : 'success'"
                size="14"
              />
              <span>required</span>
            </li>
            <li class="flex items-center gap-1.5">
              <v-icon
                :icon="v$.operand1.isNumeric.$invalid ? 'mdi-close-circle-outline' : 'mdi-check-circle-outline'"
                :color="v$.operand1.isNumeric.$invalid ? 'error' : 'success'"
                size="14"
              />
              <span>isNumeric (finite float)</span>
            </li>
            <li class="flex items-center gap-1.5">
              <v-icon
                :icon="v$.operand1.isReasonableSize.$invalid ? 'mdi-close-circle-outline' : 'mdi-check-circle-outline'"
                :color="v$.operand1.isReasonableSize.$invalid ? 'error' : 'success'"
                size="14"
              />
              <span>range check (≤ 1e15)</span>
            </li>
          </ul>
        </div>

        <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div class="font-semibold text-slate-700 dark:text-slate-300 mb-1">Operation Rules</div>
          <ul class="space-y-1 text-slate-600 dark:text-slate-400">
            <li class="flex items-center gap-1.5">
              <v-icon
                :icon="v$.operation.required.$invalid ? 'mdi-close-circle-outline' : 'mdi-check-circle-outline'"
                :color="v$.operation.required.$invalid ? 'error' : 'success'"
                size="14"
              />
              <span>required (+, −, ×, ÷)</span>
            </li>
          </ul>
        </div>

        <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div class="font-semibold text-slate-700 dark:text-slate-300 mb-1">Operand 2 (B) Rules</div>
          <ul class="space-y-1 text-slate-600 dark:text-slate-400">
            <li class="flex items-center gap-1.5">
              <v-icon
                :icon="v$.operand2.required.$invalid ? 'mdi-close-circle-outline' : 'mdi-check-circle-outline'"
                :color="v$.operand2.required.$invalid ? 'error' : 'success'"
                size="14"
              />
              <span>required</span>
            </li>
            <li class="flex items-center gap-1.5">
              <v-icon
                :icon="v$.operand2.isNumeric.$invalid ? 'mdi-close-circle-outline' : 'mdi-check-circle-outline'"
                :color="v$.operand2.isNumeric.$invalid ? 'error' : 'success'"
                size="14"
              />
              <span>isNumeric (finite float)</span>
            </li>
            <li class="flex items-center gap-1.5 font-medium" :class="formData.operation === 'divide' ? 'text-primary' : ''">
              <v-icon
                :icon="v$.operand2.notZeroIfDivision.$invalid ? 'mdi-close-circle-outline' : 'mdi-check-circle-outline'"
                :color="v$.operand2.notZeroIfDivision.$invalid ? 'error' : 'success'"
                size="14"
              />
              <span>notZeroIfDivision</span>
            </li>
          </ul>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minValue, maxValue, helpers } from '@vuelidate/validators';
import { OperationType, HistoryItem } from '../types/calculator';
import {
  isNumeric,
  isReasonableSize,
} from '../utils/validators';
import {
  performOperation,
  getOperatorSymbol,
  getOperationName,
  formatNumber,
  getDivisionBreakdown,
} from '../utils/math';
import { audioManager } from '../utils/audio';

const emit = defineEmits<{
  (e: 'calculation-completed', item: HistoryItem): void;
  (e: 'send-to-keypad', val: number): void;
  (e: 'notify', msg: string, color?: string): void;
}>();

// Form Data Model
const formData = reactive({
  operand1: '48.5',
  operation: 'multiply' as OperationType,
  operand2: '12',
  precision: 4,
});

const useSeparators = ref(true);

const operations: { value: OperationType; symbol: string; title: string }[] = [
  { value: 'add', symbol: '+', title: 'Addition' },
  { value: 'subtract', symbol: '−', title: 'Subtraction' },
  { value: 'multiply', symbol: '×', title: 'Multiplication' },
  { value: 'divide', symbol: '÷', title: 'Division' },
];

// Custom Vuelidate rule for division by zero
const notZeroIfDivision = helpers.withMessage(
  'Cannot divide by zero. Divisor must be non-zero.',
  (val: unknown) => {
    if (formData.operation === 'divide') {
      if (val === null || val === undefined || val === '') return true;
      const num = Number(val);
      return !isNaN(num) && num !== 0;
    }
    return true;
  }
);

// Vuelidate validation rules schema
const rules = {
  operand1: {
    required: helpers.withMessage('First operand is required', required),
    isNumeric,
    isReasonableSize,
  },
  operation: {
    required: helpers.withMessage('Operation is required', required),
  },
  operand2: {
    required: helpers.withMessage('Second operand is required', required),
    isNumeric,
    isReasonableSize,
    notZeroIfDivision,
  },
  precision: {
    required,
    minValue: minValue(0),
    maxValue: maxValue(10),
  },
};

const v$ = useVuelidate(rules, formData);

// Computation Output
interface ComputationResult {
  operand1: number;
  operand2: number;
  operation: OperationType;
  result: number;
  expression: string;
  formattedResult: string;
}

const computation = ref<ComputationResult | null>(null);

const divisionDetails = computed(() => {
  if (!computation.value || computation.value.operation !== 'divide') return null;
  return getDivisionBreakdown(computation.value.operand1, computation.value.operand2);
});

function getErrors(field: 'operand1' | 'operand2' | 'operation') {
  return v$.value[field].$errors.map((err) => String(err.$message));
}

function selectOperation(op: OperationType) {
  audioManager.playClick('operator');
  formData.operation = op;
  v$.value.operand2.$touch();
}

function applyPreset(op1: number, op: OperationType, op2: number) {
  audioManager.playClick('action');
  formData.operand1 = String(op1);
  formData.operation = op;
  formData.operand2 = String(op2);
  v$.value.$touch();
  if (!v$.value.$invalid) {
    calculate();
  }
}

function resetForm() {
  audioManager.playClick('action');
  formData.operand1 = '';
  formData.operation = 'add';
  formData.operand2 = '';
  formData.precision = 4;
  computation.value = null;
  v$.value.$reset();
}

function handleSubmit() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    audioManager.playClick('error');
    emit('notify', 'Please fix validation errors before computing', 'error');
    return;
  }
  calculate();
}

function calculate() {
  const num1 = parseFloat(formData.operand1);
  const num2 = parseFloat(formData.operand2);

  const { result, error } = performOperation(num1, num2, formData.operation);
  if (error) {
    audioManager.playClick('error');
    emit('notify', error, 'error');
    return;
  }

  audioManager.playClick('action');
  const opSymbol = getOperatorSymbol(formData.operation);
  const formatted = formatNumber(result, {
    maxDecimals: formData.precision,
    useGrouping: useSeparators.value,
  });

  const expr = `${formatNumber(num1, { maxDecimals: 8, useGrouping: useSeparators.value })} ${opSymbol} ${formatNumber(num2, { maxDecimals: 8, useGrouping: useSeparators.value })}`;

  computation.value = {
    operand1: num1,
    operand2: num2,
    operation: formData.operation,
    result,
    expression: expr,
    formattedResult: formatted,
  };

  const item: HistoryItem = {
    id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date(),
    operand1: num1,
    operand2: num2,
    operation: formData.operation,
    operatorSymbol: opSymbol,
    result,
    expression: expr,
    formattedResult: formatted,
    mode: 'formula',
  };

  emit('calculation-completed', item);
  emit('notify', `Computed ${formatted}`, 'success');
}

async function copyResult() {
  if (!computation.value) return;
  try {
    await navigator.clipboard.writeText(String(computation.value.result));
    emit('notify', 'Copied result to clipboard', 'success');
  } catch {
    emit('notify', 'Unable to copy to clipboard', 'error');
  }
}

function getOperand1Term(op: OperationType): string {
  switch (op) {
    case 'add': return 'Augend (Value being added to)';
    case 'subtract': return 'Minuend (Value from which another is subtracted)';
    case 'multiply': return 'Multiplicand (Number to be multiplied)';
    case 'divide': return 'Dividend (Number being divided)';
  }
}

function getOperand2Term(op: OperationType): string {
  switch (op) {
    case 'add': return 'Addend (Value being added)';
    case 'subtract': return 'Subtrahend (Value being subtracted)';
    case 'multiply': return 'Multiplier (Number of times to multiply)';
    case 'divide': return 'Divisor (Number by which dividend is divided)';
  }
}
</script>

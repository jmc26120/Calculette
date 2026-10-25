<template>
  <div class="w-full max-w-4xl mx-auto space-y-6">
    <v-row>
      <!-- Bill Split & Tip (Demonstrating +, ×, ÷) -->
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg" class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full flex flex-col">
          <div class="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <v-icon icon="mdi-account-group-outline" color="primary" size="18" />
              <span>Bill Split & Tip (Operations: +, ×, ÷)</span>
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Calculates tip via × and split shares via ÷ with Vuelidate</p>
          </div>

          <div class="p-5 flex-1 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bill Subtotal ($)
              </label>
              <v-text-field
                v-model="splitForm.bill"
                type="number"
                step="0.01"
                prefix="$"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :error-messages="splitV$.bill.$errors.map(e => String(e.$message))"
                @blur="splitV$.bill.$touch()"
              />
            </div>

            <div>
              <div class="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Tip Rate</span>
                <span class="font-mono text-primary font-bold">{{ splitForm.tipPercent }}%</span>
              </div>
              <div class="grid grid-cols-5 gap-1 mb-2">
                <v-btn
                  v-for="tip in [0, 10, 15, 18, 20]"
                  :key="tip"
                  size="x-small"
                  :variant="splitForm.tipPercent === tip ? 'flat' : 'outlined'"
                  :color="splitForm.tipPercent === tip ? 'primary' : undefined"
                  @click="splitForm.tipPercent = tip; splitV$.tipPercent.$touch()"
                >
                  {{ tip }}%
                </v-btn>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Number of Diners / People
              </label>
              <v-text-field
                v-model="splitForm.diners"
                type="number"
                step="1"
                min="1"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :error-messages="splitV$.diners.$errors.map(e => String(e.$message))"
                @blur="splitV$.diners.$touch()"
              />
            </div>

            <!-- Calculated Output Card -->
            <div
              v-if="!splitV$.$invalid && splitResults"
              class="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
            >
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Tip Amount (Bill × {{ splitForm.tipPercent }}%):</span>
                <span class="font-mono font-bold text-slate-800 dark:text-slate-200">${{ splitResults.tipAmount.toFixed(2) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Total with Tip (Bill + Tip):</span>
                <span class="font-mono font-bold text-slate-800 dark:text-slate-200">${{ splitResults.totalBill.toFixed(2) }}</span>
              </div>
              <v-divider />
              <div class="flex items-center justify-between pt-1">
                <span class="font-semibold text-slate-700 dark:text-slate-300">Each Person Pays (Total ÷ {{ splitForm.diners }}):</span>
                <span class="font-mono text-base font-bold text-primary">${{ splitResults.perPerson.toFixed(2) }}</span>
              </div>

              <div class="pt-2 flex justify-end">
                <v-btn
                  size="x-small"
                  variant="text"
                  color="primary"
                  prepend-icon="mdi-history"
                  @click="recordSplitCalculation"
                >
                  Save to History Tape
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Percentage Delta & Margin (Demonstrating −, ÷, ×) -->
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="lg" class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full flex flex-col">
          <div class="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <v-icon icon="mdi-chart-line-variant" color="primary" size="18" />
              <span>Percentage Change (Operations: −, ÷, ×)</span>
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Calculates difference via − and delta ratio via ÷ with Vuelidate</p>
          </div>

          <div class="p-5 flex-1 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Original Initial Value (V₁)
              </label>
              <v-text-field
                v-model="deltaForm.initialValue"
                type="number"
                step="any"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :error-messages="deltaV$.initialValue.$errors.map(e => String(e.$message))"
                @blur="deltaV$.initialValue.$touch()"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Final Value (V₂)
              </label>
              <v-text-field
                v-model="deltaForm.finalValue"
                type="number"
                step="any"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :error-messages="deltaV$.finalValue.$errors.map(e => String(e.$message))"
                @blur="deltaV$.finalValue.$touch()"
              />
            </div>

            <!-- Calculated Output Card -->
            <div
              v-if="!deltaV$.$invalid && deltaResults"
              class="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
            >
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Absolute Difference (V₂ − V₁):</span>
                <span class="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {{ deltaResults.diff >= 0 ? '+' : '' }}{{ deltaResults.diff.toFixed(2) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Ratio ((V₂ − V₁) ÷ V₁):</span>
                <span class="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {{ (deltaResults.ratio).toFixed(4) }}
                </span>
              </div>
              <v-divider />
              <div class="flex items-center justify-between pt-1">
                <span class="font-semibold text-slate-700 dark:text-slate-300">Percentage Shift:</span>
                <span
                  class="font-mono text-base font-bold flex items-center gap-1"
                  :class="deltaResults.percent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
                >
                  <v-icon :icon="deltaResults.percent >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'" size="18" />
                  {{ deltaResults.percent >= 0 ? '+' : '' }}{{ deltaResults.percent.toFixed(2) }}%
                </span>
              </div>

              <div class="pt-2 flex justify-end">
                <v-btn
                  size="x-small"
                  variant="text"
                  color="primary"
                  prepend-icon="mdi-history"
                  @click="recordDeltaCalculation"
                >
                  Save to History Tape
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minValue, helpers } from '@vuelidate/validators';
import { HistoryItem } from '../types/calculator';
import { notZero, isNumeric } from '../utils/validators';
import { formatNumber } from '../utils/math';

const emit = defineEmits<{
  (e: 'calculation-completed', item: HistoryItem): void;
  (e: 'notify', msg: string, color?: string): void;
}>();

// Form 1: Split & Tip
const splitForm = reactive({
  bill: '84.00',
  tipPercent: 18,
  diners: '3',
});

const splitRules = {
  bill: {
    required: helpers.withMessage('Bill amount is required', required),
    isNumeric,
    minValue: helpers.withMessage('Bill must be at least $0.01', minValue(0.01)),
  },
  tipPercent: {
    required,
    minValue: minValue(0),
  },
  diners: {
    required: helpers.withMessage('Number of people is required', required),
    isNumeric,
    minValue: helpers.withMessage('Must be at least 1 person', minValue(1)),
  },
};

const splitV$ = useVuelidate(splitRules, splitForm);

const splitResults = computed(() => {
  const bill = parseFloat(splitForm.bill);
  const tip = Number(splitForm.tipPercent);
  const diners = parseInt(splitForm.diners, 10);

  if (isNaN(bill) || isNaN(diners) || diners <= 0 || bill <= 0) return null;

  const tipAmount = bill * (tip / 100);
  const totalBill = bill + tipAmount;
  const perPerson = totalBill / diners;

  return { tipAmount, totalBill, perPerson };
});

function recordSplitCalculation() {
  if (!splitResults.value) return;
  const diners = parseInt(splitForm.diners, 10);
  const item: HistoryItem = {
    id: 'split_' + Date.now(),
    timestamp: new Date(),
    operand1: splitResults.value.totalBill,
    operand2: diners,
    operation: 'divide',
    operatorSymbol: '÷',
    result: splitResults.value.perPerson,
    expression: `$${splitResults.value.totalBill.toFixed(2)} ÷ ${diners} diners`,
    formattedResult: `$${splitResults.value.perPerson.toFixed(2)}/person`,
    mode: 'split',
  };
  emit('calculation-completed', item);
  emit('notify', 'Recorded split calculation to history tape', 'success');
}

// Form 2: Percentage Delta
const deltaForm = reactive({
  initialValue: '120',
  finalValue: '150',
});

const deltaRules = {
  initialValue: {
    required: helpers.withMessage('Initial value is required', required),
    isNumeric,
    notZero: helpers.withMessage('Initial base value cannot be 0 (cannot divide by zero)', notZero),
  },
  finalValue: {
    required: helpers.withMessage('Final value is required', required),
    isNumeric,
  },
};

const deltaV$ = useVuelidate(deltaRules, deltaForm);

const deltaResults = computed(() => {
  const v1 = parseFloat(deltaForm.initialValue);
  const v2 = parseFloat(deltaForm.finalValue);

  if (isNaN(v1) || isNaN(v2) || v1 === 0) return null;

  const diff = v2 - v1;
  const ratio = diff / v1;
  const percent = ratio * 100;

  return { diff, ratio, percent };
});

function recordDeltaCalculation() {
  if (!deltaResults.value) return;
  const v1 = parseFloat(deltaForm.initialValue);
  const v2 = parseFloat(deltaForm.finalValue);
  const item: HistoryItem = {
    id: 'delta_' + Date.now(),
    timestamp: new Date(),
    operand1: deltaResults.value.diff,
    operand2: v1,
    operation: 'divide',
    operatorSymbol: '÷',
    result: deltaResults.value.percent,
    expression: `(${formatNumber(v2)} − ${formatNumber(v1)}) ÷ ${formatNumber(v1)} × 100`,
    formattedResult: `${deltaResults.value.percent >= 0 ? '+' : ''}${deltaResults.value.percent.toFixed(2)}%`,
    mode: 'percent',
  };
  emit('calculation-completed', item);
  emit('notify', 'Recorded percentage delta to history tape', 'success');
}
</script>

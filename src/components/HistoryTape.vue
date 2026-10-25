<template>
  <div class="w-full max-w-4xl mx-auto space-y-4">
    <v-card elevation="2" rounded="lg" class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <!-- Tape Header -->
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/60">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <v-icon icon="mdi-history" color="primary" size="20" />
            <span>Calculation Audit Tape</span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            {{ history.length }} calculation{{ history.length === 1 ? '' : 's' }} recorded in current session
          </p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Export Actions -->
          <v-btn
            size="small"
            variant="outlined"
            color="secondary"
            prepend-icon="mdi-download"
            :disabled="history.length === 0"
            @click="exportTapeAsText"
          >
            Export Tape
          </v-btn>
          <v-btn
            size="small"
            variant="tonal"
            color="error"
            prepend-icon="mdi-trash-can-outline"
            :disabled="history.length === 0"
            @click="clearHistory"
          >
            Clear Tape
          </v-btn>
        </div>
      </div>

      <!-- Filter Bar -->
      <div v-if="history.length > 0" class="px-6 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 flex items-center justify-between">
        <span class="text-xs font-medium text-slate-500">Filter by operation:</span>
        <div class="flex items-center gap-1">
          <v-btn
            v-for="filter in filterOptions"
            :key="filter.value"
            size="x-small"
            :variant="selectedFilter === filter.value ? 'flat' : 'text'"
            :color="selectedFilter === filter.value ? 'primary' : 'secondary'"
            class="text-xs font-semibold"
            @click="selectedFilter = filter.value"
          >
            {{ filter.label }}
          </v-btn>
        </div>
      </div>

      <!-- Tape Content Body -->
      <div class="p-6">
        <div v-if="filteredHistory.length === 0" class="py-12 text-center">
          <v-icon icon="mdi-calculator-variant-outline" size="48" class="text-slate-300 dark:text-slate-700 mb-2" />
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">No calculations recorded yet</p>
          <p class="text-xs text-slate-400 mt-1">Use the Keypad or Vuelidate Form to perform calculations</p>
        </div>

        <div v-else class="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          <div
            v-for="item in filteredHistory"
            :key="item.id"
            class="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary/40 bg-white dark:bg-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-800/60 transition-all flex flex-wrap items-center justify-between gap-3"
          >
            <!-- Expression & Result Info -->
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span
                  class="w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono"
                  :class="getOperationBadgeStyle(item.operation)"
                >
                  {{ item.operatorSymbol }}
                </span>
                <span class="font-mono text-sm text-slate-700 dark:text-slate-300">
                  {{ item.expression }}
                </span>
                <span class="text-slate-400 text-xs">=</span>
                <span class="font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums">
                  {{ item.formattedResult }}
                </span>
              </div>

              <div class="flex items-center gap-2 text-[11px] text-slate-400">
                <span>{{ formatTimestamp(item.timestamp) }}</span>
                <span>·</span>
                <span class="capitalize">{{ item.mode }} mode</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1">
              <v-btn
                icon="mdi-content-copy"
                size="x-small"
                variant="text"
                color="secondary"
                title="Copy result"
                @click="copyItem(item)"
              />
              <v-btn
                icon="mdi-swap-horizontal"
                size="x-small"
                variant="tonal"
                color="primary"
                title="Load into Keypad"
                @click="$emit('load-in-keypad', item.result)"
              />
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { HistoryItem, OperationType } from '../types/calculator';

const props = defineProps<{
  history: HistoryItem[];
}>();

const emit = defineEmits<{
  (e: 'clear-history'): void;
  (e: 'load-in-keypad', val: number): void;
  (e: 'notify', msg: string, color?: string): void;
}>();

type FilterType = 'all' | OperationType;

const selectedFilter = ref<FilterType>('all');

const filterOptions: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Add (+)', value: 'add' },
  { label: 'Sub (−)', value: 'subtract' },
  { label: 'Mul (×)', value: 'multiply' },
  { label: 'Div (÷)', value: 'divide' },
];

const filteredHistory = computed(() => {
  if (selectedFilter.value === 'all') return props.history;
  return props.history.filter((item) => item.operation === selectedFilter.value);
});

function getOperationBadgeStyle(op: OperationType) {
  switch (op) {
    case 'add':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    case 'subtract':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
    case 'multiply':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
    case 'divide':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
  }
}

function formatTimestamp(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

async function copyItem(item: HistoryItem) {
  try {
    await navigator.clipboard.writeText(`${item.expression} = ${item.formattedResult}`);
    emit('notify', 'Copied equation to clipboard', 'success');
  } catch {
    emit('notify', 'Failed to copy', 'error');
  }
}

function clearHistory() {
  emit('clear-history');
}

function exportTapeAsText() {
  if (props.history.length === 0) return;
  const header = `=========================================\n  PRECISION CALCULATOR AUDIT TAPE\n  Exported: ${new Date().toLocaleString()}\n=========================================\n\n`;
  const lines = props.history.map((item, idx) => {
    return `[${idx + 1}] ${formatTimestamp(item.timestamp)}: ${item.expression} = ${item.formattedResult} (${item.operation.toUpperCase()})`;
  });

  const content = header + lines.join('\n') + `\n\nTotal Calculations: ${props.history.length}\n`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `calculator-audit-tape-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  emit('notify', 'Audit tape downloaded', 'success');
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="500" @update:model-value="$emit('update:modelValue', $event)">
    <v-card rounded="lg" class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <v-icon icon="mdi-keyboard-outline" color="primary" size="20" />
          <span>Keyboard Shortcuts</span>
        </h3>
        <v-btn icon="mdi-close" size="x-small" variant="text" @click="$emit('update:modelValue', false)" />
      </div>

      <div class="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
        <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span>Numbers & Decimal</span>
          <kbd class="px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">0 - 9, .</kbd>
        </div>
        <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span>Addition</span>
          <kbd class="px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">+</kbd>
        </div>
        <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span>Subtraction</span>
          <kbd class="px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">-</kbd>
        </div>
        <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span>Multiplication</span>
          <kbd class="px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">* or x</kbd>
        </div>
        <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span>Division</span>
          <kbd class="px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">/</kbd>
        </div>
        <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span>Evaluate / Equals</span>
          <kbd class="px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Enter or =</kbd>
        </div>
        <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span>Backspace</span>
          <kbd class="px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Backspace</kbd>
        </div>
        <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span>All Clear (AC)</span>
          <kbd class="px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Escape</kbd>
        </div>
        <div class="flex items-center justify-between py-1">
          <span>Clear Entry (CE)</span>
          <kbd class="px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Delete</kbd>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <v-btn color="primary" variant="flat" size="small" @click="$emit('update:modelValue', false)">
          Got It
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();
</script>

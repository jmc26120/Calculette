<template>
  <v-app :theme="isDark ? 'dark' : 'light'" class="min-h-screen">
    <!-- Top Navigation Bar following the Top Bar Contract -->
    <header class="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        <!-- Zone 1: Brand Wordmark -->
        <div class="flex items-center gap-3 shrink-0">
          <div class="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center font-mono font-bold text-lg shadow-sm">
            ÷
          </div>
          <span class="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Precision Calculator
          </span>
        </div>

        <!-- Zone 2: Navigation Links / Segmented Tabs -->
        <nav class="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
            :class="activeTab === tab.id
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'"
            @click="activeTab = tab.id"
          >
            <v-icon :icon="tab.icon" size="16" />
            <span>{{ tab.label }}</span>
            <span
              v-if="tab.id === 'history' && history.length > 0"
              class="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-primary/10 text-primary font-mono"
            >
              {{ history.length }}
            </span>
          </button>
        </nav>

        <!-- Zone 3: Primary Action & Quick Controls -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Audio click toggle -->
          <v-btn
            :icon="isAudioEnabled ? 'mdi-volume-high' : 'mdi-volume-off'"
            size="small"
            variant="text"
            :color="isAudioEnabled ? 'primary' : 'secondary'"
            :title="isAudioEnabled ? 'Audio feedback: Enabled' : 'Audio feedback: Muted'"
            @click="toggleAudio"
          />

          <!-- Dark mode toggle -->
          <v-btn
            :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
            size="small"
            variant="text"
            color="secondary"
            :title="isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'"
            @click="toggleTheme"
          />

          <!-- Shortcut info -->
          <v-btn
            icon="mdi-help-circle-outline"
            size="small"
            variant="text"
            color="secondary"
            title="Keyboard shortcuts"
            @click="showShortcuts = true"
          />
        </div>
      </div>

      <!-- Mobile Tab Strip -->
      <div class="md:hidden border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around bg-slate-50 dark:bg-slate-900">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-2 py-1 text-xs font-medium rounded flex flex-col items-center gap-0.5"
          :class="activeTab === tab.id ? 'text-primary font-bold' : 'text-slate-500'"
          @click="activeTab = tab.id"
        >
          <v-icon :icon="tab.icon" size="18" />
          <span class="text-[10px]">{{ tab.label }}</span>
        </button>
      </div>
    </header>

    <!-- Main Viewport Content -->
    <v-main class="bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 flex-1">
      <div class="max-w-6xl mx-auto">
        <!-- Subheading / Mode Context Banner -->
        <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {{ currentTabTitle }}
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {{ currentTabDescription }}
            </p>
          </div>

          <!-- Feature Tag Pill replacement: clean unboxed metadata -->
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <span>Vue 3</span>
            <span aria-hidden="true">·</span>
            <span>Vuetify 3</span>
            <span aria-hidden="true">·</span>
            <span>Vuelidate Validation</span>
          </div>
        </div>

        <!-- Tab 0: Keypad Calculator -->
        <div v-show="activeTab === 'keypad'" class="py-2">
          <KeypadCalculator
            ref="keypadRef"
            @calculation-completed="handleCalculationCompleted"
            @notify="showNotification"
            @open-shortcuts="showShortcuts = true"
          />
        </div>

        <!-- Tab 1: Form Validator Calculator (Vuelidate Driven) -->
        <div v-show="activeTab === 'form'" class="py-2">
          <FormValidatorCalculator
            @calculation-completed="handleCalculationCompleted"
            @send-to-keypad="loadIntoKeypad"
            @notify="showNotification"
          />
        </div>

        <!-- Tab 2: Practical Calculators (+, −, ×, ÷) -->
        <div v-show="activeTab === 'practical'" class="py-2">
          <PracticalCalculators
            @calculation-completed="handleCalculationCompleted"
            @notify="showNotification"
          />
        </div>

        <!-- Tab 3: History Audit Tape -->
        <div v-show="activeTab === 'history'" class="py-2">
          <HistoryTape
            :history="history"
            @clear-history="clearHistory"
            @load-in-keypad="loadIntoKeypad"
            @notify="showNotification"
          />
        </div>
      </div>
    </v-main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span>Four operations arithmetic: Addition (+), Subtraction (−), Multiplication (×), Division (÷)</span>
        </div>
        <div class="flex items-center gap-3">
          <button class="hover:text-slate-900 dark:hover:text-slate-300 transition-colors" @click="showShortcuts = true">
            Shortcuts
          </button>
          <span>·</span>
          <button class="hover:text-slate-900 dark:hover:text-slate-300 transition-colors" @click="activeTab = 'form'">
            Vuelidate Schema
          </button>
          <span>·</span>
          <button class="hover:text-slate-900 dark:hover:text-slate-300 transition-colors" @click="activeTab = 'history'">
            Audit Log ({{ history.length }})
          </button>
        </div>
      </div>
    </footer>

    <!-- Keyboard Shortcuts Modal -->
    <KeyboardShortcutsDialog v-model="showShortcuts" />

    <!-- Global Snackbar Notification -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2500"
      rounded="lg"
      elevation="4"
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="text" size="small" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import KeypadCalculator from './components/KeypadCalculator.vue';
import FormValidatorCalculator from './components/FormValidatorCalculator.vue';
import PracticalCalculators from './components/PracticalCalculators.vue';
import HistoryTape from './components/HistoryTape.vue';
import KeyboardShortcutsDialog from './components/KeyboardShortcutsDialog.vue';
import { HistoryItem } from './types/calculator';
import { audioManager } from './utils/audio';

type TabId = 'keypad' | 'form' | 'practical' | 'history';

const activeTab = ref<TabId>('keypad');
const isDark = ref(false);
const isAudioEnabled = ref(false);
const showShortcuts = ref(false);
const keypadRef = ref<any>(null);

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'keypad', label: 'Standard Keypad', icon: 'mdi-dialpad' },
  { id: 'form', label: 'Vuelidate Form', icon: 'mdi-shield-check-outline' },
  { id: 'practical', label: 'Real-World Tools', icon: 'mdi-function-variant' },
  { id: 'history', label: 'Audit Tape', icon: 'mdi-history' },
];

const currentTabTitle = computed(() => {
  switch (activeTab.value) {
    case 'keypad': return 'Tactile Four-Operation Keypad';
    case 'form': return 'Vuelidate Arithmetic Form & Inspector';
    case 'practical': return 'Real-World Calculations (+, −, ×, ÷)';
    case 'history': return 'Calculation History & Session Tape';
  }
});

const currentTabDescription = computed(() => {
  switch (activeTab.value) {
    case 'keypad': return 'High-precision interactive calculator with memory register, audio feedback, and keyboard controls.';
    case 'form': return 'Real-time form validation powered by Vuelidate with custom zero-division prevention and quotient breakdowns.';
    case 'practical': return 'Practical bill splitting, tip distribution, and percentage margin calculations powered by basic operations.';
    case 'history': return 'Chronological audit record of every computation performed, exportable to disk.';
  }
});

// History state
const history = ref<HistoryItem[]>([
  {
    id: 'seed_1',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    operand1: 1450,
    operand2: 12,
    operation: 'multiply',
    operatorSymbol: '×',
    result: 17400,
    expression: '1,450 × 12',
    formattedResult: '17,400',
    mode: 'keypad',
  },
  {
    id: 'seed_2',
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    operand1: 350,
    operand2: 4,
    operation: 'divide',
    operatorSymbol: '÷',
    result: 87.5,
    expression: '350 ÷ 4',
    formattedResult: '87.5',
    mode: 'formula',
  },
]);

// Snackbar state
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
});

function showNotification(message: string, color = 'success') {
  snackbar.value = {
    show: true,
    message,
    color,
  };
}

function handleCalculationCompleted(item: HistoryItem) {
  history.value.unshift(item);
  // Keep maximum 100 items in session
  if (history.value.length > 100) {
    history.value.pop();
  }
}

function clearHistory() {
  history.value = [];
  showNotification('Calculation tape cleared', 'info');
}

function loadIntoKeypad(val: number) {
  activeTab.value = 'keypad';
  setTimeout(() => {
    if (keypadRef.value?.injectValue) {
      keypadRef.value.injectValue(val);
      showNotification(`Loaded ${val} into Keypad display`, 'info');
    }
  }, 50);
}

function toggleTheme() {
  isDark.value = !isDark.value;
  applyDarkClass();
}

function toggleAudio() {
  isAudioEnabled.value = !isAudioEnabled.value;
  audioManager.enabled = isAudioEnabled.value;
  if (isAudioEnabled.value) {
    audioManager.playClick('action');
    showNotification('Keypad click sound enabled', 'info');
  } else {
    showNotification('Keypad sound muted', 'info');
  }
}

function applyDarkClass() {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Check system preference
onMounted(() => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true;
    applyDarkClass();
  }
});

watch(isDark, applyDarkClass);
</script>

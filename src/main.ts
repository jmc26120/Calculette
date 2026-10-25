import { createApp } from 'vue';
import App from './App.vue';

// Vuetify styles and icon fonts
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Tailwind & custom styles
import './index.css';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#0284c7',
          error: '#ef4444',
          info: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          surface: '#ffffff',
          background: '#f8fafc',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#3b82f6',
          secondary: '#94a3b8',
          accent: '#38bdf8',
          error: '#f87171',
          info: '#60a5fa',
          success: '#34d399',
          warning: '#fbbf24',
          surface: '#0f172a',
          background: '#020617',
        },
      },
    },
  },
});

const app = createApp(App);
app.use(vuetify);
app.mount('#app');

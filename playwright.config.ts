import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:3070',
    headless: true, // Запускать в фоновом режиме
  },
});
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120 * 1000,
  expect: { timeout: 10 * 1000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['html', { open: 'on-failure' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: [
    {
      command: 'npm run start',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 180 * 1000,
      env: {
        ...process.env,
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
        TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
        NEXT_PUBLIC_PYTHON_RUNNER_ORIGIN: 'http://127.0.0.1:8788',
      },
    },
    {
      command: 'npm run dev:runner',
      url: 'http://127.0.0.1:8788/',
      reuseExistingServer: !process.env.CI,
      timeout: 180 * 1000,
    },
  ],
});

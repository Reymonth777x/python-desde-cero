import { defineConfig, devices } from '@playwright/test';

const skipBuild = process.env.PLAYWRIGHT_SKIP_BUILD === '1';
const serverCommand = skipBuild
  ? 'npm run start -- --hostname 127.0.0.1'
  : 'npm run build && npm run start -- --hostname 127.0.0.1';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'list' : 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000',
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
  webServer: {
    command: serverCommand,
    url: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_e2e_placeholder',
      NEXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3000',
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
      TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
    },
  },
});

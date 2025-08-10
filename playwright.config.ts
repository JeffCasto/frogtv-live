import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  use: {
    browserName: 'chromium',
    headless: true,
  },
  // Start the Next.js dev server before running tests
  webServer: {
    // Install web dependencies before starting dev server (first run in CI/local)
    command: 'npm i --silent && npm run dev',
    cwd: 'web',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
  projects: [
    {
      name: 'Desktop Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
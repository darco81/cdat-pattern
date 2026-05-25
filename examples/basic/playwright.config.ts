import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for CDAT Basic Example
 *
 * Guardian Pattern Implementation:
 * - health-check project runs first (pre-flight validation)
 * - Feature test projects depend on health-check passing
 * - This ensures environment issues are caught before feature tests run
 *
 * @see https://playwright.dev/docs/test-configuration
 * @see https://playwright.dev/docs/test-projects#dependencies
 */
export default defineConfig({
  testDir: './features',
  testMatch: '**/test.ts', // Match Guardian pattern: components.ts, data.ts, actions.ts, test.ts

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'https://demo.playwright.dev',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video recording */
    video: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    // Pre-flight health check (Guardian pattern)
    {
      name: 'health-check',
      testDir: './features/_health',
      use: { ...devices['Desktop Chrome'] },
    },

    // Feature tests depend on health checks
    {
      name: 'chromium-features',
      testDir: './features',
      testIgnore: './features/_health/**',
      dependencies: ['health-check'], // Runs after health check passes
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox-features',
      testDir: './features',
      testIgnore: './features/_health/**',
      dependencies: ['health-check'], // Runs after health check passes
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit-features',
      testDir: './features',
      testIgnore: './features/_health/**',
      dependencies: ['health-check'], // Runs after health check passes
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'fs';
import path from 'path';
import { Environment } from '@cdat/utils';

/**
 * CDAT Pattern - Playwright Configuration
 *
 * Features:
 * - Environment-aware settings
 * - Cookie consent caching
 * - CloudFlare Access support
 *
 * @see https://playwright.dev/docs/test-configuration
 */

// Cookie consent storage state path
const cookieStateFile = path.join(__dirname, '.auth', 'cookies-accepted.json');
const hasCookieState = existsSync(cookieStateFile);

export default defineConfig({
  // Test directory following CDAT structure
  testDir: './features',

  // Run tests in parallel
  fullyParallel: true,

  // Fail build if test.only is left in code
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI
  retries: process.env.CI ? 2 : 0,

  // Parallel workers
  workers: process.env.CI ? 1 : undefined,

  // Reporters
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // Global setup for cookie consent
  globalSetup: require.resolve('@cdat/utils/cookie-consent'),

  // Shared settings
  use: {
    // Base URL from environment
    baseURL: Environment.baseURL,

    // Environment-aware timeouts
    actionTimeout: Environment.testConfig.actionTimeout,
    navigationTimeout: Environment.testConfig.actionTimeout * 3,

    // Tracing for debugging
    trace: 'on-first-retry',

    // Screenshots and video
    screenshot: Environment.testConfig.screenshotOnFailure ? 'only-on-failure' : 'off',
    video: Environment.testConfig.videoOnFailure ? 'retain-on-failure' : 'off',

    // CloudFlare Access headers
    ...(Environment.cloudflare && {
      extraHTTPHeaders: {
        'CF-Access-Client-Id': Environment.cloudflare.clientId,
        'CF-Access-Client-Secret': Environment.cloudflare.clientSecret,
      },
    }),

    // Load cookie consent state if available
    storageState: hasCookieState ? cookieStateFile : undefined,
  },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
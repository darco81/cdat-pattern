/**
 * CDAT Environment Management
 * Universal environment loader with type-safe configuration
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  /** Environment name: local, dev, stage, prod */
  name: string;

  /** Base URL for the application */
  baseURL: string;

  /** API configuration (optional) */
  api?: {
    url: string;
    timeout: number;
  };

  /** CloudFlare Access configuration for protected environments (optional) */
  cloudflare?: {
    clientId: string;
    clientSecret: string;
  };

  /** Test execution configuration */
  testConfig: {
    headless: boolean;
    slowMo: number;
    actionTimeout: number;
    screenshotOnFailure: boolean;
    videoOnFailure: boolean;
  };

  /** Primary test user credentials */
  testUser: {
    email: string;
    password: string;
    name: string;
  };

  /** Additional test users for parallel execution (optional) */
  testUsers?: Array<{
    email: string;
    password: string;
    role?: string;
  }>;
}

/**
 * Get default action timeout based on environment
 * Local environments get longer timeouts for debugging
 */
function getDefaultActionTimeout(envName: string): number {
  if (envName === 'local') {
    return 10000;
  }
  if (envName === 'stage' || envName === 'staging') {
    return 8000;
  }
  // Production and other environments
  return 5000;
}

/**
 * Load environment-specific .env file
 */
function loadEnvironmentFile(): void {
  const envName = process.env.NODE_ENV || 'local';
  const envFile = `.env.${envName}`;
  const envPath = path.resolve(process.cwd(), envFile);

  dotenv.config({ path: envPath });

  // Fallback to .env if specific file doesn't exist
  dotenv.config();
}

/**
 * Build environment configuration from environment variables
 */
function buildEnvironmentConfig(): EnvironmentConfig {
  loadEnvironmentFile();

  const name = process.env.NODE_ENV || 'local';

  const config: EnvironmentConfig = {
    name,
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    testConfig: {
      headless: process.env.TEST_HEADLESS !== 'false',
      slowMo: parseInt(process.env.TEST_SLOW_MO || '0', 10),
      actionTimeout: parseInt(
        process.env.ACTION_TIMEOUT || String(getDefaultActionTimeout(name)),
        10
      ),
      screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE === 'true',
      videoOnFailure: process.env.VIDEO_ON_FAILURE === 'true',
    },

    testUser: {
      email: process.env.TEST_USER_EMAIL || '',
      password: process.env.TEST_USER_PASSWORD || '',
      name: process.env.TEST_USER_NAME || 'Test User',
    },
  };

  // Add API config if URL is provided
  if (process.env.API_URL) {
    config.api = {
      url: process.env.API_URL,
      timeout: parseInt(process.env.API_TIMEOUT || '10000', 10),
    };
  }

  // Add CloudFlare config if credentials are provided
  if (process.env.CF_ACCESS_CLIENT_ID && process.env.CF_ACCESS_CLIENT_SECRET) {
    config.cloudflare = {
      clientId: process.env.CF_ACCESS_CLIENT_ID,
      clientSecret: process.env.CF_ACCESS_CLIENT_SECRET,
    };
  }

  // Add additional test users if configured
  const additionalUsers = buildAdditionalUsers();
  if (additionalUsers.length > 0) {
    config.testUsers = [config.testUser, ...additionalUsers];
  }

  return config;
}

/**
 * Build additional test users from environment variables
 * Looks for TEST_USER_2_EMAIL, TEST_USER_2_PASSWORD, etc.
 */
function buildAdditionalUsers(): Array<{ email: string; password: string; role?: string }> {
  const users: Array<{ email: string; password: string; role?: string }> = [];

  for (let i = 2; i <= 10; i++) {
    const email = process.env[`TEST_USER_${i}_EMAIL`];
    const password = process.env[`TEST_USER_${i}_PASSWORD`];

    if (!email || !password) {
      break;
    }

    users.push({
      email,
      password,
      role: process.env[`TEST_USER_${i}_ROLE`],
    });
  }

  return users;
}

/**
 * Print environment info to console
 */
function printEnvironmentInfo(config: EnvironmentConfig): void {
  const cfStatus = config.cloudflare ? '✅ Enabled' : '❌ Disabled';
  const userCount = config.testUsers?.length || 1;

  console.log(`
┌─────────────────────────────────────────────────────┐
│  🌍 CDAT Environment Configuration                  │
├─────────────────────────────────────────────────────┤
│  Environment:  ${config.name.padEnd(35)}│
│  Base URL:     ${config.baseURL.padEnd(35)}│
│  Timeout:      ${(config.testConfig.actionTimeout + 'ms').padEnd(35)}│
│  CloudFlare:   ${cfStatus.padEnd(35)}│
│  Test Users:   ${(userCount + ' configured').padEnd(35)}│
│  Headless:     ${(config.testConfig.headless ? 'Yes' : 'No').padEnd(35)}│
└─────────────────────────────────────────────────────┘
`);
}

// Build and export singleton
const Environment = buildEnvironmentConfig();
printEnvironmentInfo(Environment);

export { Environment };
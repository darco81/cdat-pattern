/**
 * CDAT Cookie Consent Global Setup
 * Handles GDPR cookie banners with 24-hour caching for performance
 */

import { chromium, FullConfig } from '@playwright/test';
import { existsSync, mkdirSync, statSync } from 'fs';
import * as path from 'path';
import { Environment } from './environment';

/** Cookie consent storage file path */
const AUTH_DIR = path.join(process.cwd(), '.auth');
const COOKIE_STATE_FILE = path.join(AUTH_DIR, 'cookies-accepted.json');

/** Maximum age for cached cookies (24 hours in milliseconds) */
const MAX_COOKIE_AGE_MS = 24 * 60 * 60 * 1000;

/** Environments that typically have cookie banners */
const COOKIE_BANNER_ENVIRONMENTS = ['stage', 'staging', 'prod', 'production'];

/** Common cookie banner selectors */
const COOKIE_BANNER_SELECTORS = [
  '[data-testid="cookie-consent"]',
  '#CybotCookiebotDialog',
  '#cookie-banner',
  '.cookie-consent',
  '.cookie-banner',
  '[class*="cookie-consent"]',
  '[class*="cookie-banner"]',
  '#onetrust-consent-sdk',
  '.cc-window',
];

/** Common accept button selectors */
const ACCEPT_BUTTON_SELECTORS = [
  'button:has-text("Accept all")',
  'button:has-text("Accept All")',
  'button:has-text("Allow all")',
  'button:has-text("Allow All")',
  'button:has-text("Agree")',
  'button:has-text("OK")',
  '[data-testid="cookie-accept"]',
  '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
  '#onetrust-accept-btn-handler',
  '.cc-accept',
];

/**
 * Check if cached cookies are still valid (less than 24 hours old)
 */
function isCookieCacheValid(): boolean {
  if (!existsSync(COOKIE_STATE_FILE)) {
    return false;
  }

  const fileStats = statSync(COOKIE_STATE_FILE);
  const fileAge = Date.now() - fileStats.mtimeMs;

  return fileAge < MAX_COOKIE_AGE_MS;
}

/**
 * Get age of cached cookies in hours
 */
function getCookieCacheAgeHours(): number {
  if (!existsSync(COOKIE_STATE_FILE)) {
    return -1;
  }

  const fileStats = statSync(COOKIE_STATE_FILE);
  const fileAge = Date.now() - fileStats.mtimeMs;

  return Math.floor(fileAge / (1000 * 60 * 60));
}

/**
 * Check if current environment typically has cookie banners
 */
function shouldHandleCookieBanner(): boolean {
  return COOKIE_BANNER_ENVIRONMENTS.includes(Environment.name);
}

/**
 * Find and click the cookie accept button
 */
async function acceptCookies(page: import('@playwright/test').Page): Promise<boolean> {
  // Try each banner selector
  for (const bannerSelector of COOKIE_BANNER_SELECTORS) {
    const banner = page.locator(bannerSelector).first();

    const isBannerVisible = await banner.isVisible({ timeout: 1000 }).catch(() => false);

    if (!isBannerVisible) {
      continue;
    }

    console.log(`[Cookie Consent] Found banner: ${bannerSelector}`);

    // Try each accept button selector
    for (const buttonSelector of ACCEPT_BUTTON_SELECTORS) {
      const button = page.locator(buttonSelector).first();

      const isButtonVisible = await button.isVisible({ timeout: 500 }).catch(() => false);

      if (!isButtonVisible) {
        continue;
      }

      console.log(`[Cookie Consent] Clicking: ${buttonSelector}`);
      await button.click();

      // Wait for banner to disappear
      await banner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

      return true;
    }
  }

  return false;
}

/**
 * Global setup function for Playwright
 * Accepts cookies once and caches the state for 24 hours
 *
 * @example
 * // playwright.config.ts
 * import { cookieConsentSetup } from '@cdat/utils';
 *
 * export default defineConfig({
 *   globalSetup: require.resolve('@cdat/utils/cookie-consent'),
 *   // or use the exported function directly
 * });
 */
export async function globalSetup(_config: FullConfig): Promise<void> {
  // Skip on local environment (usually no cookie banners)
  if (!shouldHandleCookieBanner()) {
    console.log(`[Cookie Consent] Skipping - environment "${Environment.name}" typically has no cookie banners`);
    return;
  }

  // Check if we have valid cached cookies
  if (isCookieCacheValid()) {
    const ageHours = getCookieCacheAgeHours();
    console.log(`[Cookie Consent] Using cached cookies (${ageHours}h old, valid for ${24 - ageHours}h more)`);
    return;
  }

  // Log status
  if (existsSync(COOKIE_STATE_FILE)) {
    const ageHours = getCookieCacheAgeHours();
    console.log(`[Cookie Consent] Refreshing stale cookies (${ageHours}h old)`);
    // Continue with auth directory setup
  }

  if (!existsSync(COOKIE_STATE_FILE)) {
    console.log('[Cookie Consent] No cached cookies found, accepting...');
  }

  // Ensure auth directory exists
  if (!existsSync(AUTH_DIR)) {
    mkdirSync(AUTH_DIR, { recursive: true });
  }

  // Launch browser and accept cookies
  const browser = await chromium.launch({
    headless: Environment.testConfig.headless,
  });

  const contextOptions: Parameters<typeof browser.newContext>[0] = {};

  // Add CloudFlare headers if configured
  if (Environment.cloudflare) {
    contextOptions.extraHTTPHeaders = {
      'CF-Access-Client-Id': Environment.cloudflare.clientId,
      'CF-Access-Client-Secret': Environment.cloudflare.clientSecret,
    };
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  try {
    // Navigate to base URL
    await page.goto(Environment.baseURL, { waitUntil: 'domcontentloaded' });

    // Smart wait for cookie banner to appear (not using waitForTimeout)
    const bannerLocator = page.locator(COOKIE_BANNER_SELECTORS.join(', ')).first();
    await bannerLocator.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});

    // Try to accept cookies
    const accepted = await acceptCookies(page);

    if (accepted) {
      console.log('[Cookie Consent] ✅ Cookies accepted successfully');

      // Wait for any cookie-related requests to complete
      await page.waitForLoadState('networkidle').catch(() => {});

      // Save storage state
      await context.storageState({ path: COOKIE_STATE_FILE });
      console.log(`[Cookie Consent] 💾 State saved to ${COOKIE_STATE_FILE}`);
      // Continue with cleanup
    }

    if (!accepted) {
      console.log('[Cookie Consent] ⚠️ No cookie banner found (this may be OK)');
    }
  } catch (error) {
    console.error('[Cookie Consent] ❌ Error:', error);
  } finally {
    await browser.close();
  }
}

export default globalSetup;

/** Export constants for customization */
export {
  COOKIE_BANNER_SELECTORS,
  ACCEPT_BUTTON_SELECTORS,
  COOKIE_STATE_FILE,
  MAX_COOKIE_AGE_MS,
};
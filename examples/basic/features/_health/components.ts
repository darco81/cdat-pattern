import type { Page, Locator } from '@playwright/test';

/**
 * Health Guardian Components
 *
 * LOCATOR POLICY: ARIA-first, never by translated text
 * - getByRole() for semantic elements
 * - getByTestId() for test-specific elements
 * - NEVER getByText() with translated content
 */
export class HealthComponents {
  // Critical navigation elements (accessibility validation)
  readonly mainNavigation: Locator;
  readonly loginButton: Locator;
  readonly searchForm: Locator;

  // Error/loading state indicators
  readonly errorBanner: Locator;
  readonly loadingSpinner: Locator;
  readonly offlineIndicator: Locator;

  // i18n health validation elements
  readonly pageTitle: Locator;
  readonly primaryHeading: Locator;

  constructor(private readonly page: Page) {
    // ARIA-first locators for accessibility validation
    this.mainNavigation = page.getByRole('navigation');
    this.loginButton = page.getByTestId('login-button'); // Avoid hardcoded text per ARIA-first policy
    this.searchForm = page.getByRole('search');

    // Error/loading states by test ID (semantic roles not applicable)
    this.errorBanner = page.getByTestId('error-banner');
    this.loadingSpinner = page.getByTestId('loading-spinner');
    this.offlineIndicator = page.getByTestId('offline-indicator');

    // Content elements for i18n validation
    this.pageTitle = page.locator('title');
    this.primaryHeading = page.getByRole('heading', { level: 1 });
  }

  /**
   * Locates elements containing raw translation keys
   * Pattern: word.word (e.g., "nav.home", "button.submit")
   * These should NOT be visible in production
   */
  getTranslationKeyElements(): Locator {
    return this.page.locator('text=/\\b\\w+\\.\\w+\\b/');
  }

  /**
   * Locates critical interactive elements for keyboard accessibility check
   * All should be focusable and have accessible names
   */
  getCriticalInteractiveElements(): Locator {
    return this.page.locator('button, [role="button"], a, input, select, textarea');
  }
}
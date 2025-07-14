/**
 * Login Feature - Components Layer
 *
 * This file contains ONLY locators and selectors.
 * No business logic, no assertions, no waits.
 *
 * @layer Components (C in CDAT)
 */

import type { Page, Locator } from '@playwright/test';

/**
 * Login page component locators
 *
 * @example
 * ```typescript
 * const components = new LoginComponents(page);
 * await components.usernameInput.fill('user');
 * ```
 */
export class LoginComponents {
  // ─────────────────────────────────────────────────────────────────
  // FORM ELEMENTS
  // ─────────────────────────────────────────────────────────────────

  /** Username/email input field */
  readonly usernameInput: Locator;

  /** Password input field */
  readonly passwordInput: Locator;

  /** Submit/login button */
  readonly submitButton: Locator;

  // ─────────────────────────────────────────────────────────────────
  // FEEDBACK ELEMENTS
  // ─────────────────────────────────────────────────────────────────

  /** Error message container */
  readonly errorMessage: Locator;

  /** Success message or redirect indicator */
  readonly successIndicator: Locator;

  // ─────────────────────────────────────────────────────────────────
  // NAVIGATION ELEMENTS
  // ─────────────────────────────────────────────────────────────────

  /** Forgot password link */
  readonly forgotPasswordLink: Locator;

  /** Register/Sign up link */
  readonly registerLink: Locator;

  /** Remember me checkbox */
  readonly rememberMeCheckbox: Locator;

  constructor(private readonly page: Page) {
    // Form elements
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });

    // Feedback elements
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.successIndicator = page.locator('[data-testid="success-indicator"]');

    // Navigation elements
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    this.registerLink = page.getByRole('link', { name: /sign up|register/i });
    this.rememberMeCheckbox = page.getByLabel(/remember me/i);
  }

  // ─────────────────────────────────────────────────────────────────
  // COMPOSED SELECTORS (Selector Composition Pattern)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Get a specific field error by field name
   *
   * @param fieldName - Name of the field (username, password)
   * @returns Locator for the field-specific error message
   */
  getFieldError(fieldName: string): Locator {
    return this.page.locator(`[data-testid="${fieldName}-error"]`);
  }
}

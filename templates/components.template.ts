/**
 * {{FEATURE_NAME}} Feature - Components Layer
 *
 * This file contains ONLY locators and selectors.
 * No business logic, no assertions, no waits.
 *
 * @layer Components (C in CDAT)
 */

import type { Page, Locator } from '@playwright/test';

/**
 * {{FEATURE_NAME}} component locators
 */
export class {{FEATURE_NAME}}Components {
  // ─────────────────────────────────────────────────────────────────
  // PRIMARY ELEMENTS
  // ─────────────────────────────────────────────────────────────────

  /** Main container for the feature */
  readonly container: Locator;

  // TODO: Add your locators here
  // readonly elementName: Locator;

  // ─────────────────────────────────────────────────────────────────
  // FORM ELEMENTS (if applicable)
  // ─────────────────────────────────────────────────────────────────

  // readonly inputField: Locator;
  // readonly submitButton: Locator;

  // ─────────────────────────────────────────────────────────────────
  // FEEDBACK ELEMENTS
  // ─────────────────────────────────────────────────────────────────

  /** Error message container */
  readonly errorMessage: Locator;

  /** Success message container */
  readonly successMessage: Locator;

  /** Loading indicator */
  readonly loader: Locator;

  constructor(private readonly page: Page) {
    // Primary elements
    this.container = page.locator('[data-testid="{{feature-name}}-container"]');

    // TODO: Initialize your locators here
    // Use semantic locators when possible:
    // this.elementName = page.getByRole('button', { name: 'Submit' });
    // this.inputField = page.getByLabel('Email');

    // Feedback elements
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.loader = page.locator('[data-testid="loader"]');
  }

  // ─────────────────────────────────────────────────────────────────
  // DYNAMIC SELECTORS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Get element by index
   */
  // getItem(index: number): Locator {
  //   return this.items.nth(index);
  // }

  /**
   * Get field-specific error
   */
  getFieldError(fieldName: string): Locator {
    return this.page.locator(`[data-testid="${fieldName}-error"]`);
  }
}

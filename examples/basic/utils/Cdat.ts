/**
 * CDAT Utility Class
 *
 * Smart wait utilities for CDAT Pattern.
 * Eliminates flaky tests by replacing hardcoded timeouts.
 *
 * @example
 * ```typescript
 * // Instead of:
 * await page.waitForTimeout(5000);
 * await button.click();
 *
 * // Use:
 * await Cdat.waitAndClick(button);
 * ```
 */

import type { Locator, Page } from '@playwright/test';

/**
 * Locator states for wait operations
 */
export enum LocatorState {
  Attached = 'attached',
  Detached = 'detached',
  Visible = 'visible',
  Hidden = 'hidden',
}

/**
 * CDAT Smart Wait Utilities
 */
export class Cdat {
  // ─────────────────────────────────────────────────────────────────
  // TIMEOUT CONSTANTS
  // ─────────────────────────────────────────────────────────────────

  static readonly VERY_SHORT_TIMEOUT = 1000;
  static readonly SHORT_TIMEOUT = 3000;
  static readonly MEDIUM_TIMEOUT = 5000;
  static readonly DEFAULT_TIMEOUT = 10000;
  static readonly LONG_TIMEOUT = 30000;

  // ─────────────────────────────────────────────────────────────────
  // CORE WAIT METHODS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Wait for locator to reach a specific state
   */
  static async waitForState(
    locator: Locator,
    state: LocatorState,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await locator.waitFor({ state, timeout });
  }

  /**
   * Check state without throwing (returns boolean)
   */
  static async checkState(
    locator: Locator,
    state: LocatorState,
    timeout: number = this.SHORT_TIMEOUT
  ): Promise<boolean> {
    try {
      await locator.waitFor({ state, timeout });
      return true;
    } catch {
      return false;
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // INTERACTION METHODS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Wait for visible and click
   */
  static async waitAndClick(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.click();
  }

  /**
   * Wait, fill, and verify value
   */
  static async waitAndFill(
    locator: Locator,
    value: string,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.fill(value);
    await locator.blur();

    const inputValue = await locator.inputValue();
    if (inputValue !== value) {
      throw new Error(
        `Input verification failed: expected "${value}", got "${inputValue}"`
      );
    }
  }

  /**
   * Wait and clear input
   */
  static async waitAndClear(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.clear();
  }

  /**
   * Wait and check checkbox/radio
   */
  static async waitAndCheck(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.check();
  }

  /**
   * Wait and uncheck checkbox
   */
  static async waitAndUncheck(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.uncheck();
  }

  // ─────────────────────────────────────────────────────────────────
  // TEXT RETRIEVAL
  // ─────────────────────────────────────────────────────────────────

  /**
   * Wait and get text content
   */
  static async waitForText(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<string> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    const text = await locator.textContent();
    return text ?? '';
  }

  /**
   * Wait and get input value
   */
  static async waitForInputValue(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<string> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    return locator.inputValue();
  }

  // ─────────────────────────────────────────────────────────────────
  // NAVIGATION HELPERS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Wait for URL to contain string
   */
  static async waitForUrlContains(
    page: Page,
    urlPart: string,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await page.waitForURL(`**/*${urlPart}*`, { timeout });
  }
}

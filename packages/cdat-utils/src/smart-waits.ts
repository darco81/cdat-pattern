/**
 * CDAT Pattern - Smart Wait Utilities
 * @description Intelligent waiting methods that eliminate flaky tests
 */

import type { Locator, Page } from '@playwright/test';
import { LocatorState, type StateCheckResult } from './types';
import { TIMEOUTS } from './constants';

/**
 * CDAT Utility Class
 *
 * Provides smart waiting methods that replace hardcoded timeouts.
 * All methods follow the "Zero waitForTimeout" principle.
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
export class Cdat {
  // ─────────────────────────────────────────────────────────────────
  // TIMEOUT CONSTANTS (exposed for convenience)
  // ─────────────────────────────────────────────────────────────────

  static readonly VERY_SHORT_TIMEOUT = TIMEOUTS.VERY_SHORT;
  static readonly SHORT_TIMEOUT = TIMEOUTS.SHORT;
  static readonly MEDIUM_TIMEOUT = TIMEOUTS.MEDIUM;
  static readonly DEFAULT_TIMEOUT = TIMEOUTS.DEFAULT;
  static readonly LONG_TIMEOUT = TIMEOUTS.LONG;

  // ─────────────────────────────────────────────────────────────────
  // CORE WAIT METHODS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Wait for locator to reach a specific state
   *
   * @param locator - Playwright locator to wait for
   * @param state - Target state (visible, hidden, attached, detached)
   * @param timeout - Maximum wait time in milliseconds
   * @throws Error if timeout is exceeded
   *
   * @example
   * ```typescript
   * await Cdat.waitForState(submitButton, LocatorState.Visible);
   * await Cdat.waitForState(loader, LocatorState.Hidden);
   * ```
   */
  static async waitForState(
    locator: Locator,
    state: LocatorState,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await locator.waitFor({ state, timeout });
  }

  /**
   * Check if locator is in a specific state (non-throwing)
   *
   * @param locator - Playwright locator to check
   * @param state - Target state to verify
   * @param timeout - Maximum wait time in milliseconds
   * @returns true if element reaches the state, false otherwise
   *
   * @example
   * ```typescript
   * if (await Cdat.checkState(errorMessage, LocatorState.Visible)) {
   *   // Handle error case
   * }
   * ```
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

  /**
   * Detailed state check with result object
   *
   * @param locator - Playwright locator to check
   * @param state - Target state to verify
   * @param timeout - Maximum wait time in milliseconds
   * @returns StateCheckResult with success status and error details
   */
  static async checkStateDetailed(
    locator: Locator,
    state: LocatorState,
    timeout: number = this.SHORT_TIMEOUT
  ): Promise<StateCheckResult> {
    try {
      await locator.waitFor({ state, timeout });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // INTERACTION METHODS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Wait for element to be visible and click it
   *
   * @param locator - Playwright locator to click
   * @param timeout - Maximum wait time in milliseconds
   *
   * @example
   * ```typescript
   * await Cdat.waitAndClick(submitButton);
   * await Cdat.waitAndClick(navLink, Cdat.LONG_TIMEOUT);
   * ```
   */
  static async waitAndClick(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.click();
  }

  /**
   * Wait for element, fill with value, and verify input
   *
   * @param locator - Playwright locator (input, textarea)
   * @param value - Value to fill
   * @param timeout - Maximum wait time in milliseconds
   * @throws Error if filled value doesn't match expected value
   *
   * @example
   * ```typescript
   * await Cdat.waitAndFill(emailInput, 'user@example.com');
   * ```
   */
  static async waitAndFill(
    locator: Locator,
    value: string,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.fill(value);
    await locator.blur();

    // Verify the value was filled correctly
    const inputValue = await locator.inputValue();
    if (inputValue !== value) {
      throw new Error(
        `Input verification failed: expected "${value}", got "${inputValue}"`
      );
    }
  }

  /**
   * Wait for element and clear its value
   *
   * @param locator - Playwright locator (input, textarea)
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitAndClear(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.clear();
  }

  /**
   * Wait for element and type text character by character
   * Use this when fill() doesn't trigger proper events
   *
   * @param locator - Playwright locator
   * @param text - Text to type
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitAndType(
    locator: Locator,
    text: string,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.pressSequentially(text);
  }

  /**
   * Wait for select element and choose option by value
   *
   * @param locator - Playwright locator for select element
   * @param value - Option value to select
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitAndSelect(
    locator: Locator,
    value: string,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.selectOption(value);
  }

  /**
   * Wait for checkbox/radio and check it if not already checked
   *
   * @param locator - Playwright locator for checkbox/radio
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitAndCheck(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.check();
  }

  /**
   * Wait for checkbox/radio and uncheck it if checked
   *
   * @param locator - Playwright locator for checkbox/radio
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitAndUncheck(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.uncheck();
  }

  // ─────────────────────────────────────────────────────────────────
  // TEXT RETRIEVAL METHODS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Wait for element and get its text content
   *
   * @param locator - Playwright locator
   * @param timeout - Maximum wait time in milliseconds
   * @returns Text content of the element
   *
   * @example
   * ```typescript
   * const errorText = await Cdat.waitForText(errorMessage);
   * ```
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
   * Wait for element and get its inner text (visible text only)
   *
   * @param locator - Playwright locator
   * @param timeout - Maximum wait time in milliseconds
   * @returns Inner text of the element
   */
  static async waitForInnerText(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<string> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    return locator.innerText();
  }

  /**
   * Wait for input element and get its value
   *
   * @param locator - Playwright locator for input
   * @param timeout - Maximum wait time in milliseconds
   * @returns Input value
   */
  static async waitForInputValue(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<string> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    return locator.inputValue();
  }

  // ─────────────────────────────────────────────────────────────────
  // COUNT AND COLLECTION METHODS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Wait for minimum number of elements to be present
   *
   * @param locator - Playwright locator
   * @param minCount - Minimum number of elements expected
   * @param timeout - Maximum wait time in milliseconds
   * @returns true if minimum count reached, false otherwise
   *
   * @example
   * ```typescript
   * await Cdat.waitForMinimumCount(productCards, 3);
   * ```
   */
  static async waitForMinimumCount(
    locator: Locator,
    minCount: number,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const count = await locator.count();
      if (count >= minCount) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return false;
  }

  /**
   * Wait for exact number of elements
   *
   * @param locator - Playwright locator
   * @param expectedCount - Exact number of elements expected
   * @param timeout - Maximum wait time in milliseconds
   * @returns true if exact count reached, false otherwise
   */
  static async waitForExactCount(
    locator: Locator,
    expectedCount: number,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const count = await locator.count();
      if (count === expectedCount) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return false;
  }

  // ─────────────────────────────────────────────────────────────────
  // NAVIGATION HELPERS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Wait for URL to contain a specific string
   *
   * @param page - Playwright page object
   * @param urlPart - URL substring to wait for
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForUrlContains(
    page: Page,
    urlPart: string,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await page.waitForURL(`**/*${urlPart}*`, { timeout });
  }

  /**
   * Wait for navigation to complete after triggering an action
   *
   * Use this when you need to click a link/button and wait for navigation.
   * For simple navigation waiting, use waitForNavigation() instead.
   *
   * @param page - Playwright page object
   * @param action - Async function that triggers navigation
   * @param timeout - Maximum wait time in milliseconds
   *
   * @example
   * ```typescript
   * await Cdat.waitForNavigationWithAction(page, async () => {
   *   await submitButton.click();
   * });
   * ```
   */
  static async waitForNavigationWithAction(
    page: Page,
    action: () => Promise<void>,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    await Promise.all([
      page.waitForLoadState('networkidle', { timeout }),
      action(),
    ]);
  }

  // ─────────────────────────────────────────────────────────────────
  // VISIBILITY HELPERS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Wait for element to disappear (become hidden or detached)
   *
   * @param locator - Playwright locator
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForHidden(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Hidden, timeout);
  }

  /**
   * Wait for loading indicator to disappear
   *
   * @param locator - Playwright locator for loading indicator
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForLoaderToDisappear(
    locator: Locator,
    timeout: number = this.LONG_TIMEOUT
  ): Promise<void> {
    // First check if loader is present
    const isVisible = await this.checkState(locator, LocatorState.Visible, 500);
    if (isVisible) {
      await this.waitForState(locator, LocatorState.Hidden, timeout);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // ENHANCED INTERACTION METHODS (from production analysis)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Smart hover with visibility wait
   * Enhanced method from production repositories analysis
   *
   * @param locator - Playwright locator
   * @param timeout - Maximum wait time in milliseconds
   *
   * @example
   * ```typescript
   * await Cdat.waitAndHover(menuItem);
   * ```
   */
  static async waitAndHover(
    locator: Locator,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    try {
      await this.waitForState(locator, LocatorState.Visible, timeout);
      await locator.hover();
    } catch (error) {
      const selector = await this.getLocatorDescription(locator);
      throw new Error(`Failed to hover over element "${selector}". Original error: ${error}`);
    }
  }

  /**
   * Wait for navigation to complete with optional URL validation
   * Enhanced method from production repositories analysis
   *
   * @param page - Playwright page object
   * @param expectedUrl - Expected URL pattern (string contains or RegExp match)
   * @param timeout - Maximum wait time in milliseconds
   * @throws Error if navigation times out or URL doesn't match
   *
   * @example
   * ```typescript
   * // Wait for page to finish loading
   * await Cdat.waitForNavigation(page);
   *
   * // Wait and validate URL contains string
   * await Cdat.waitForNavigation(page, '/dashboard');
   *
   * // Wait and validate URL matches pattern
   * await Cdat.waitForNavigation(page, /\/product\/\d+/);
   * ```
   */
  static async waitForNavigation(
    page: Page,
    expectedUrl?: string | RegExp,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<void> {
    try {
      await page.waitForLoadState('networkidle', { timeout });

      if (!expectedUrl) {
        return;
      }

      const currentUrl = page.url();
      const urlMatches = typeof expectedUrl === 'string'
        ? currentUrl.includes(expectedUrl)
        : expectedUrl.test(currentUrl);

      if (!urlMatches) {
        const expectedType = typeof expectedUrl === 'string' ? 'contain' : 'match';
        throw new Error(
          `Navigation URL validation failed. Expected URL to ${expectedType} "${expectedUrl}", but got: ${currentUrl}`
        );
      }
    } catch (error) {
      const currentUrl = page.url();
      throw new Error(`Navigation timeout within ${timeout}ms. Current URL: ${currentUrl}. Original error: ${error}`);
    }
  }

  /**
   * Wait for multiple elements with optional count validation
   * Enhanced method from production repositories analysis
   *
   * @param locator - Playwright locator
   * @param expectedCount - Expected minimum/exact count (optional)
   * @param timeout - Maximum wait time in milliseconds
   * @returns Number of elements found
   *
   * @example
   * ```typescript
   * const count = await Cdat.waitForElements(productCards);
   * await Cdat.waitForElements(menuItems, 5); // Wait for exactly 5 items
   * ```
   */
  static async waitForElements(
    locator: Locator,
    expectedCount?: number,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<number> {
    try {
      if (expectedCount !== undefined) {
        await locator.first().waitFor({ state: 'visible', timeout });
        // Wait for the expected count using Playwright's count method
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
          const currentCount = await locator.count();
          if (currentCount >= expectedCount) {
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const finalCount = await locator.count();
        if (finalCount < expectedCount) {
          throw new Error(`Expected at least ${expectedCount} elements, but found ${finalCount}`);
        }
      }
      return await locator.count();
    } catch (error) {
      const selector = await this.getLocatorDescription(locator);
      throw new Error(`Failed to find expected elements "${selector}". Expected: ${expectedCount}, Original error: ${error}`);
    }
  }

  /**
   * Enhanced waitAndFill with input verification
   * Production-tested method with value verification
   *
   * @param locator - Playwright locator
   * @param value - Value to fill
   * @param timeout - Maximum wait time in milliseconds
   *
   * @example
   * ```typescript
   * await Cdat.waitAndFillVerified(emailField, 'test@example.com');
   * ```
   */
  static async waitAndFillVerified(
    locator: Locator,
    value: string,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    try {
      await this.waitForState(locator, LocatorState.Visible, timeout);
      await locator.focus();
      await locator.fill(value);
      await locator.blur();

      // Verify the value was entered correctly
      const inputValue = await locator.inputValue();
      if (inputValue !== value) {
        const selector = await this.getLocatorDescription(locator);
        throw new Error(`Input value mismatch for "${selector}": expected "${value}", but got "${inputValue}"`);
      }
    } catch (error) {
      const selector = await this.getLocatorDescription(locator);
      throw new Error(`Failed to fill element "${selector}" with value "${value}". Original error: ${error}`);
    }
  }

  /**
   * Generic value waiting with type safety
   * Advanced method from production repositories analysis
   *
   * @param getValue - Function that returns the value to check
   * @param expectedValue - Expected value to wait for
   * @param timeout - Maximum wait time in milliseconds
   * @returns The actual value when condition is met
   *
   * @example
   * ```typescript
   * const price = await Cdat.waitForValue(
   *   () => priceElement.textContent(),
   *   '$99.99'
   * );
   * ```
   */
  static async waitForValue<T>(
    getValue: () => Promise<T>,
    expectedValue: T,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<T> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        const currentValue = await getValue();
        if (currentValue === expectedValue) {
          return currentValue;
        }
      } catch {
        // Continue waiting if getValue throws
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const finalValue = await getValue();
    throw new Error(`Value did not match within ${timeout}ms. Expected: ${expectedValue}, got: ${finalValue}`);
  }

  /**
   * Clear browser data (localStorage, sessionStorage, cookies)
   * Production utility method for test isolation
   *
   * @param page - Playwright page object
   *
   * @example
   * ```typescript
   * await Cdat.clearBrowserData(page);
   * ```
   */
  static async clearBrowserData(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.context().clearCookies();
  }

  /**
   * Take screenshot with descriptive naming
   * Production utility for debugging
   *
   * @param page - Playwright page object
   * @param name - Screenshot name
   * @param options - Screenshot options
   *
   * @example
   * ```typescript
   * await Cdat.takeScreenshot(page, 'error-state');
   * ```
   */
  static async takeScreenshot(
    page: Page,
    name: string,
    options?: { fullPage?: boolean }
  ): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    await page.screenshot({
      path: `screenshots/${filename}`,
      fullPage: options?.fullPage ?? false
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // CRM/ERP SPECIFIC METHODS (from production patterns)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Wait for data grid to reload (useful for CRM/ERP grid operations)
   *
   * @param page - Playwright page object
   * @param gridLocator - Locator for the data grid container
   * @param timeout - Maximum wait time in milliseconds
   *
   * @example
   * ```typescript
   * await Cdat.waitForGridReload(page, dataGrid);
   * ```
   */
  static async waitForGridReload(
    _page: Page,
    gridLocator: Locator,
    timeout: number = this.LONG_TIMEOUT
  ): Promise<void> {
    try {
      // Wait for loading state to appear (with short timeout as it may already be loading)
      const loadingIndicator = gridLocator.locator('[data-loading="true"]');
      await this.waitForState(loadingIndicator, LocatorState.Visible, 2000);

      // Wait for loading state to disappear
      await this.waitForState(loadingIndicator, LocatorState.Hidden, timeout);
    } catch (error) {
      throw new Error(`Grid reload timeout within ${timeout}ms. Original error: ${error}`);
    }
  }

  /**
   * Select an option from a dropdown (for custom dropdowns)
   *
   * @param dropdownLocator - Locator for the dropdown trigger
   * @param optionText - Text of the option to select
   * @param timeout - Maximum wait time in milliseconds
   *
   * @example
   * ```typescript
   * await Cdat.selectOption(roleDropdown, 'Administrator');
   * ```
   */
  static async selectOption(
    dropdownLocator: Locator,
    optionText: string,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    try {
      await this.waitAndClick(dropdownLocator, timeout);
      const option = dropdownLocator.page().locator(`text="${optionText}"`);
      await this.waitAndClick(option, timeout);
    } catch (error) {
      const selector = await this.getLocatorDescription(dropdownLocator);
      throw new Error(`Failed to select option "${optionText}" from dropdown "${selector}". Original error: ${error}`);
    }
  }

  /**
   * Upload a file to a file input element
   *
   * @param fileInputLocator - Locator for the file input element
   * @param filePath - Path to the file to upload
   * @param timeout - Maximum wait time in milliseconds
   *
   * @example
   * ```typescript
   * await Cdat.uploadFile(fileUpload, './documents/test.pdf');
   * ```
   */
  static async uploadFile(
    fileInputLocator: Locator,
    filePath: string,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    try {
      await this.waitForState(fileInputLocator, LocatorState.Attached, timeout);
      await fileInputLocator.setInputFiles(filePath);
    } catch (error) {
      const selector = await this.getLocatorDescription(fileInputLocator);
      throw new Error(`Failed to upload file "${filePath}" to element "${selector}". Original error: ${error}`);
    }
  }

  /**
   * Wait for form submission to complete (with loading indicators)
   *
   * @param formLocator - Locator for the form container
   * @param timeout - Maximum wait time in milliseconds
   *
   * @example
   * ```typescript
   * await Cdat.waitForFormSubmit(createUserForm);
   * ```
   */
  static async waitForFormSubmit(
    formLocator: Locator,
    timeout: number = this.LONG_TIMEOUT
  ): Promise<void> {
    try {
      // Wait for form to show loading state
      const loadingIndicator = formLocator.locator('[data-loading="true"]');
      await this.waitForState(loadingIndicator, LocatorState.Visible, 2000);

      // Wait for loading to complete
      await this.waitForState(loadingIndicator, LocatorState.Hidden, timeout);
    } catch (error) {
      throw new Error(`Form submission timeout within ${timeout}ms. Original error: ${error}`);
    }
  }

  /**
   * Hover over an element and get tooltip text
   *
   * @param locator - Locator for the element to hover over
   * @param tooltipSelector - Selector for the tooltip element
   * @param timeout - Maximum wait time in milliseconds
   * @returns The tooltip text content
   *
   * @example
   * ```typescript
   * const helpText = await Cdat.hoverAndGetTooltip(helpIcon);
   * ```
   */
  static async hoverAndGetTooltip(
    locator: Locator,
    tooltipSelector: string = '[role="tooltip"]',
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<string> {
    try {
      await this.waitForState(locator, LocatorState.Visible, timeout);
      await locator.hover();

      const tooltipLocator = locator.page().locator(tooltipSelector);
      return await this.waitForText(tooltipLocator, timeout);
    } catch (error) {
      const selector = await this.getLocatorDescription(locator);
      throw new Error(`Failed to get tooltip from element "${selector}". Original error: ${error}`);
    }
  }

  /**
   * Check if element contains specific text (non-throwing)
   *
   * @param locator - Locator for the element to check
   * @param expectedText - Text that should be contained
   * @param timeout - Maximum wait time in milliseconds
   * @returns true if text is found, false otherwise
   *
   * @example
   * ```typescript
   * const hasError = await Cdat.containsText(messageArea, 'Error');
   * ```
   */
  static async containsText(
    locator: Locator,
    expectedText: string,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<boolean> {
    try {
      const actualText = await this.waitForText(locator, timeout);
      return actualText.includes(expectedText);
    } catch {
      return false;
    }
  }

  /**
   * Scroll element into view and ensure it's visible
   *
   * @param locator - Locator for the element to scroll to
   * @param timeout - Maximum wait time in milliseconds
   *
   * @example
   * ```typescript
   * await Cdat.scrollIntoView(bottomButton);
   * ```
   */
  static async scrollIntoView(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    try {
      await this.waitForState(locator, LocatorState.Attached, timeout);
      await locator.scrollIntoViewIfNeeded();
      await this.waitForState(locator, LocatorState.Visible, timeout);
    } catch (error) {
      const selector = await this.getLocatorDescription(locator);
      throw new Error(`Failed to scroll element "${selector}" into view. Original error: ${error}`);
    }
  }

  /**
   * Click element and wait for navigation to complete
   *
   * @param locator - Locator for the element to click
   * @param page - Playwright page object
   * @param expectedUrl - Expected URL pattern (optional)
   * @param timeout - Maximum wait time in milliseconds
   *
   * @example
   * ```typescript
   * await Cdat.clickAndWaitForNavigation(submitButton, page, '/success');
   * ```
   */
  static async clickAndWaitForNavigation(
    locator: Locator,
    page: Page,
    expectedUrl?: string | RegExp,
    timeout: number = this.LONG_TIMEOUT
  ): Promise<void> {
    try {
      await Promise.all([
        page.waitForLoadState('networkidle', { timeout }),
        this.waitAndClick(locator, timeout)
      ]);

      if (expectedUrl) {
        await this.waitForNavigation(page, expectedUrl, timeout);
      }
    } catch (error) {
      const selector = await this.getLocatorDescription(locator);
      const currentUrl = page.url();
      throw new Error(`Click and navigation failed for element "${selector}". Current URL: ${currentUrl}. Original error: ${error}`);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // UTILITY METHODS (from production analysis)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Get locator description for error messages
   * Production utility for better error reporting
   */
  private static async getLocatorDescription(locator: Locator): Promise<string> {
    try {
      const selector = await this.getLocatorSelector(locator);
      return selector || 'Unknown locator';
    } catch {
      return 'Complex locator';
    }
  }

  /**
   * Get locator selector string for error reporting
   * Production utility helper method
   *
   * @param locator - Playwright locator
   * @returns Human-readable selector description
   */
  private static async getLocatorSelector(locator: Locator): Promise<string> {
    try {
      // Try to get the selector string from the locator
      const locatorString = locator.toString();

      if (!locatorString.includes('locator(')) {
        return locatorString;
      }

      // Extract selector from "locator('selector')" format
      const selectorMatch = locatorString.match(/locator\('([^']+)'\)/);
      if (selectorMatch?.[1]) {
        return selectorMatch[1];
      }

      // Extract selector from 'locator("selector")' format
      const doubleQuoteMatch = locatorString.match(/locator\("([^"]+)"\)/);
      if (doubleQuoteMatch?.[1]) {
        return doubleQuoteMatch[1];
      }

      return 'Complex locator';
    } catch {
      return 'Unknown locator';
    }
  }
}

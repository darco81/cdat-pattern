/**
 * CDAT Utility Class
 * Smart wait utilities for CDAT Pattern
 */

import type { Locator, Page } from '@playwright/test';

export enum LocatorState {
  Attached = 'attached',
  Detached = 'detached',
  Visible = 'visible',
  Hidden = 'hidden',
}

export class Cdat {
  static readonly VERY_SHORT_TIMEOUT = 1000;
  static readonly SHORT_TIMEOUT = 3000;
  static readonly MEDIUM_TIMEOUT = 5000;
  static readonly DEFAULT_TIMEOUT = 10000;
  static readonly LONG_TIMEOUT = 30000;

  static async waitForState(
    locator: Locator,
    state: LocatorState,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await locator.waitFor({ state, timeout });
  }

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

  static async waitAndClick(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.click();
  }

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

  static async waitAndClear(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.clear();
  }

  static async waitAndSelect(
    locator: Locator,
    value: string,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.selectOption(value);
  }

  static async waitAndCheck(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.check();
  }

  static async waitAndUncheck(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    await locator.uncheck();
  }

  static async waitForText(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<string> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    const text = await locator.textContent();
    return text ?? '';
  }

  static async waitForInputValue(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<string> {
    await this.waitForState(locator, LocatorState.Visible, timeout);
    return locator.inputValue();
  }

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

  static async waitForUrlContains(
    page: Page,
    urlPart: string,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await page.waitForURL(`**/*${urlPart}*`, { timeout });
  }

  static async waitForHidden(
    locator: Locator,
    timeout: number = this.MEDIUM_TIMEOUT
  ): Promise<void> {
    await this.waitForState(locator, LocatorState.Hidden, timeout);
  }
}

/**
 * {{FEATURE_NAME}} Feature - Actions Layer
 *
 * This file contains business logic and user interactions.
 * NO expect() assertions here - those belong in tests.
 *
 * @layer Actions (A in CDAT)
 */

import type { Page } from '@playwright/test';
import { Cdat, LocatorState } from '../utils/Cdat';
import { {{FEATURE_NAME}}Components } from './components';
import type { {{FEATURE_NAME}}FormData } from './data';

/**
 * {{FEATURE_NAME}} feature actions
 */
export class {{FEATURE_NAME}}Actions {
  private readonly components: {{FEATURE_NAME}}Components;

  constructor(private readonly page: Page) {
    this.components = new {{FEATURE_NAME}}Components(page);
  }

  // ─────────────────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────────────────

  /**
   * Navigate to {{FEATURE_NAME}} page
   */
  async navigateTo(): Promise<void> {
    await this.page.goto('/{{feature-name}}');
    await Cdat.waitForState(this.components.container, LocatorState.Visible);
  }

  // ─────────────────────────────────────────────────────────────────
  // ATOMIC ACTIONS
  // ─────────────────────────────────────────────────────────────────

  // TODO: Add your atomic actions here
  // Each action should do ONE thing

  /**
   * Fill field1
   */
  // async fillField1(value: string): Promise<void> {
  //   await Cdat.waitAndFill(this.components.field1Input, value);
  // }

  /**
   * Submit form
   */
  // async submit(): Promise<void> {
  //   await Cdat.waitAndClick(this.components.submitButton);
  // }

  // ─────────────────────────────────────────────────────────────────
  // COMPOSED ACTIONS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Complete main flow with provided data
   */
  async completeFlow(data: {{FEATURE_NAME}}FormData): Promise<void> {
    // TODO: Compose atomic actions
    // await this.fillField1(data.field1);
    // if (data.field2) {
    //   await this.fillField2(data.field2);
    // }
    // await this.submit();
  }

  // ─────────────────────────────────────────────────────────────────
  // STATE GETTERS (Return data, don't assert)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    const isVisible = await Cdat.checkState(
      this.components.errorMessage,
      LocatorState.Visible
    );

    if (!isVisible) {
      return '';
    }

    return Cdat.waitForText(this.components.errorMessage);
  }

  /**
   * Check if operation was successful
   */
  async isSuccessful(): Promise<boolean> {
    return Cdat.checkState(
      this.components.successMessage,
      LocatorState.Visible
    );
  }

  /**
   * Check if loading indicator is visible
   */
  async isLoading(): Promise<boolean> {
    return Cdat.checkState(
      this.components.loader,
      LocatorState.Visible
    );
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete(): Promise<void> {
    await Cdat.waitForLoaderToDisappear(this.components.loader);
  }

  // ─────────────────────────────────────────────────────────────────
  // HELPER METHODS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Clear form
   */
  // async clearForm(): Promise<void> {
  //   await Cdat.waitAndClear(this.components.field1Input);
  // }
}

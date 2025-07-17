/**
 * Login Feature - Actions Layer
 *
 * This file contains business logic and user interactions.
 * NO expect() assertions here - those belong in tests.
 *
 * @layer Actions (A in CDAT)
 */

import type { Page } from '@playwright/test';
import { Cdat, LocatorState } from '../../utils/Cdat';
import { LoginComponents } from './components';
import type { LoginCredentials, LoginResult } from './data';

/**
 * Login feature actions
 *
 * Implements user interactions for login functionality.
 * All methods use smart waits (Zero waitForTimeout principle).
 *
 * @example
 * ```typescript
 * const actions = new LoginActions(page);
 * await actions.login(VALID_USER);
 * ```
 */
export class LoginActions {
  private readonly components: LoginComponents;

  constructor(private readonly page: Page) {
    this.components = new LoginComponents(page);
  }

  // ─────────────────────────────────────────────────────────────────
  // ATOMIC ACTIONS (Single Responsibility)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Fill username field
   *
   * @param username - Username to enter
   */
  async fillUsername(username: string): Promise<void> {
    await Cdat.waitAndFill(this.components.usernameInput, username);
  }

  /**
   * Fill password field
   *
   * @param password - Password to enter
   */
  async fillPassword(password: string): Promise<void> {
    await Cdat.waitAndFill(this.components.passwordInput, password);
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await Cdat.waitAndClick(this.components.submitButton);
  }

  /**
   * Toggle remember me checkbox
   *
   * @param checked - Whether to check the checkbox
   */
  async setRememberMe(checked: boolean): Promise<void> {
    if (checked) {
      await Cdat.waitAndCheck(this.components.rememberMeCheckbox);
      return;
    }

    await Cdat.waitAndUncheck(this.components.rememberMeCheckbox);
  }

  // ─────────────────────────────────────────────────────────────────
  // COMPOSED ACTIONS (Method Composition Pattern)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Perform complete login flow
   *
   * @param credentials - User credentials
   *
   * @example
   * ```typescript
   * await actions.login({ username: 'user', password: 'pass' });
   * ```
   */
  async login(credentials: LoginCredentials): Promise<void> {
    await this.fillUsername(credentials.username);
    await this.fillPassword(credentials.password);

    if (credentials.rememberMe !== undefined) {
      await this.setRememberMe(credentials.rememberMe);
    }

    await this.clickSubmit();
  }

  /**
   * Login and wait for successful redirect
   *
   * @param credentials - User credentials
   * @param expectedUrl - Expected URL after successful login
   */
  async loginAndWaitForRedirect(
    credentials: LoginCredentials,
    expectedUrl: string
  ): Promise<void> {
    await this.login(credentials);
    await Cdat.waitForUrlContains(this.page, expectedUrl);
  }

  // ─────────────────────────────────────────────────────────────────
  // STATE GETTERS (No assertions - return data for tests)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Get current error message text
   *
   * @returns Error message text or empty string if not visible
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
   * Check if login was successful (success indicator visible)
   *
   * @returns true if success indicator is visible
   */
  async isLoginSuccessful(): Promise<boolean> {
    return Cdat.checkState(
      this.components.successIndicator,
      LocatorState.Visible
    );
  }

  /**
   * Check if error message is displayed
   *
   * @returns true if error message is visible
   */
  async isErrorDisplayed(): Promise<boolean> {
    return Cdat.checkState(
      this.components.errorMessage,
      LocatorState.Visible
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // NAVIGATION ACTIONS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Navigate to login page
   *
   * @param baseUrl - Base URL of the application
   */
  async navigateToLoginPage(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/login`);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await Cdat.waitAndClick(this.components.forgotPasswordLink);
  }

  /**
   * Click register link
   */
  async clickRegister(): Promise<void> {
    await Cdat.waitAndClick(this.components.registerLink);
  }

  // ─────────────────────────────────────────────────────────────────
  // FORM HELPERS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await Cdat.waitAndClear(this.components.usernameInput);
    await Cdat.waitAndClear(this.components.passwordInput);
  }

  /**
   * Get current form values
   *
   * @returns Current values in the form
   */
  async getFormValues(): Promise<{ username: string; password: string }> {
    const username = await Cdat.waitForInputValue(this.components.usernameInput);
    const password = await Cdat.waitForInputValue(this.components.passwordInput);

    return { username, password };
  }
}

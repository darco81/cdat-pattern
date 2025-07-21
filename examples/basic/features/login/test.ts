/**
 * Login Feature - Tests Layer
 *
 * This file contains test scenarios with assertions.
 * All expect() calls belong HERE, not in Actions.
 *
 * @layer Tests (T in CDAT)
 */

import { test, expect } from '@playwright/test';
import { LoginActions } from './actions';
import { LoginComponents } from './components';
import {
  VALID_USER,
  INVALID_CREDENTIALS,
  EMPTY_CREDENTIALS,
  LOGIN_URLS,
  LoginErrorType,
} from './data';

// ─────────────────────────────────────────────────────────────────
// TEST SETUP
// ─────────────────────────────────────────────────────────────────

test.describe('Login Feature', () => {
  let actions: LoginActions;
  let components: LoginComponents;

  test.beforeEach(async ({ page, baseURL }) => {
    actions = new LoginActions(page);
    components = new LoginComponents(page);

    // Navigate to login page before each test
    await page.goto(`${baseURL}${LOGIN_URLS.loginPage}`);
  });

  // ─────────────────────────────────────────────────────────────────
  // POSITIVE SCENARIOS
  // ─────────────────────────────────────────────────────────────────

  test.describe('Positive Scenarios', () => {
    test('TC_LOGIN_001: Given valid credentials, When user logs in, Then dashboard is displayed', async ({
      page,
    }) => {
      // Arrange
      const credentials = VALID_USER;

      // Act
      await actions.login(credentials);

      // Assert
      await expect(page).toHaveURL(new RegExp(LOGIN_URLS.dashboardPage));
    });

    test('TC_LOGIN_002: Given valid credentials with remember me, When user logs in, Then session persists', async ({
      page,
    }) => {
      // Arrange
      const credentials = { ...VALID_USER, rememberMe: true };

      // Act
      await actions.login(credentials);

      // Assert
      await expect(page).toHaveURL(new RegExp(LOGIN_URLS.dashboardPage));
      // Additional assertion: Check for persistent session cookie
      const cookies = await page.context().cookies();
      const sessionCookie = cookies.find((c) => c.name === 'session');
      expect(sessionCookie?.expires).toBeGreaterThan(Date.now() / 1000);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // NEGATIVE SCENARIOS
  // ─────────────────────────────────────────────────────────────────

  test.describe('Negative Scenarios', () => {
    test('TC_LOGIN_003: Given invalid credentials, When user logs in, Then error is displayed', async () => {
      // Arrange
      const credentials = INVALID_CREDENTIALS;

      // Act
      await actions.login(credentials);

      // Assert
      const errorMessage = await actions.getErrorMessage();
      expect(errorMessage).toContain(LoginErrorType.InvalidCredentials);
    });

    test('TC_LOGIN_004: Given empty username, When user submits form, Then validation error is shown', async () => {
      // Arrange
      const credentials = { ...EMPTY_CREDENTIALS, password: 'somepassword' };

      // Act
      await actions.login(credentials);

      // Assert
      const fieldError = components.getFieldError('username');
      await expect(fieldError).toBeVisible();
      await expect(fieldError).toContainText(LoginErrorType.RequiredField);
    });

    test('TC_LOGIN_005: Given empty password, When user submits form, Then validation error is shown', async () => {
      // Arrange
      const credentials = { ...EMPTY_CREDENTIALS, username: 'someuser' };

      // Act
      await actions.login(credentials);

      // Assert
      const fieldError = components.getFieldError('password');
      await expect(fieldError).toBeVisible();
      await expect(fieldError).toContainText(LoginErrorType.RequiredField);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // NAVIGATION SCENARIOS
  // ─────────────────────────────────────────────────────────────────

  test.describe('Navigation', () => {
    test('TC_LOGIN_006: Given login page, When forgot password clicked, Then forgot password page opens', async ({
      page,
    }) => {
      // Act
      await actions.clickForgotPassword();

      // Assert
      await expect(page).toHaveURL(new RegExp(LOGIN_URLS.forgotPasswordPage));
    });

    test('TC_LOGIN_007: Given login page, When register clicked, Then register page opens', async ({
      page,
    }) => {
      // Act
      await actions.clickRegister();

      // Assert
      await expect(page).toHaveURL(new RegExp(LOGIN_URLS.registerPage));
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // ACCESSIBILITY SCENARIOS
  // ─────────────────────────────────────────────────────────────────

  test.describe('Accessibility', () => {
    test('TC_LOGIN_008: Given login form, Then all inputs have accessible labels', async () => {
      // Assert
      await expect(components.usernameInput).toBeVisible();
      await expect(components.passwordInput).toBeVisible();

      // Verify labels are properly associated
      await expect(components.usernameInput).toHaveAccessibleName(/username/i);
      await expect(components.passwordInput).toHaveAccessibleName(/password/i);
    });

    test('TC_LOGIN_009: Given login form, Then form is keyboard navigable', async ({ page }) => {
      // Act - Navigate with Tab key
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Assert - Submit button should be focused
      await expect(components.submitButton).toBeFocused();
    });
  });
});

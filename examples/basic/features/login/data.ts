/**
 * Login Feature - Data Layer
 *
 * This file contains ONLY test data, types, and constants.
 * No business logic, no locators.
 *
 * @layer Data (D in CDAT)
 */

// ─────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────

/**
 * User credentials for login
 */
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Login response data
 */
export interface LoginResult {
  success: boolean;
  errorMessage?: string;
  redirectUrl?: string;
}

// ─────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────

/**
 * Types of login errors
 */
export enum LoginErrorType {
  InvalidCredentials = 'Invalid username or password',
  AccountLocked = 'Account is locked',
  AccountDisabled = 'Account is disabled',
  NetworkError = 'Network error occurred',
  RequiredField = 'This field is required',
}

// ─────────────────────────────────────────────────────────────────
// TEST DATA - Valid Credentials
// ─────────────────────────────────────────────────────────────────

/**
 * Valid test user credentials
 * Works with demo.playwright.dev/todoapp
 */
export const VALID_USER: LoginCredentials = {
  username: 'testuser',
  password: 'Password123!',
  rememberMe: false,
};

/**
 * Admin user credentials
 */
export const ADMIN_USER: LoginCredentials = {
  username: 'admin',
  password: 'AdminPass123!',
  rememberMe: true,
};

// ─────────────────────────────────────────────────────────────────
// TEST DATA - Invalid Credentials
// ─────────────────────────────────────────────────────────────────

/**
 * Invalid credentials for negative testing
 */
export const INVALID_CREDENTIALS: LoginCredentials = {
  username: 'wronguser',
  password: 'wrongpassword',
};

/**
 * Empty credentials for validation testing
 */
export const EMPTY_CREDENTIALS: LoginCredentials = {
  username: '',
  password: '',
};

/**
 * Credentials with SQL injection attempt (for security testing)
 */
export const SQL_INJECTION_ATTEMPT: LoginCredentials = {
  username: "' OR '1'='1",
  password: "' OR '1'='1",
};

// ─────────────────────────────────────────────────────────────────
// URLS
// ─────────────────────────────────────────────────────────────────

/**
 * URL paths for login feature
 */
export const LOGIN_URLS = {
  loginPage: '/login',
  dashboardPage: '/dashboard',
  forgotPasswordPage: '/forgot-password',
  registerPage: '/register',
} as const;

// ─────────────────────────────────────────────────────────────────
// TIMEOUTS
// ─────────────────────────────────────────────────────────────────

/**
 * Feature-specific timeout overrides
 */
export const LOGIN_TIMEOUTS = {
  /** Time to wait for login API response */
  loginApiResponse: 10000,
  /** Time to wait for redirect after successful login */
  redirectAfterLogin: 5000,
} as const;

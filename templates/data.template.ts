/**
 * {{FEATURE_NAME}} Feature - Data Layer
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
 * Main data structure for {{FEATURE_NAME}}
 */
export interface {{FEATURE_NAME}}Data {
  // TODO: Define your data structure
  id: string;
  name: string;
}

/**
 * Form data for {{FEATURE_NAME}}
 */
export interface {{FEATURE_NAME}}FormData {
  // TODO: Define form fields
  field1: string;
  field2?: string;
}

// ─────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────

/**
 * Status options for {{FEATURE_NAME}}
 */
export enum {{FEATURE_NAME}}Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}

/**
 * Error types for {{FEATURE_NAME}}
 */
export enum {{FEATURE_NAME}}ErrorType {
  NotFound = 'Resource not found',
  ValidationFailed = 'Validation failed',
  Unauthorized = 'Unauthorized access',
}

// ─────────────────────────────────────────────────────────────────
// TEST DATA - Valid Cases
// ─────────────────────────────────────────────────────────────────

/**
 * Valid test data for happy path tests
 */
export const VALID_DATA: {{FEATURE_NAME}}FormData = {
  field1: 'valid-value',
  field2: 'optional-value',
};

// ─────────────────────────────────────────────────────────────────
// TEST DATA - Invalid Cases
// ─────────────────────────────────────────────────────────────────

/**
 * Invalid test data for negative tests
 */
export const INVALID_DATA: {{FEATURE_NAME}}FormData = {
  field1: '',
  field2: 'too-long-value-that-exceeds-maximum-length',
};

// ─────────────────────────────────────────────────────────────────
// URLS
// ─────────────────────────────────────────────────────────────────

/**
 * URL paths for {{FEATURE_NAME}} feature
 */
export const {{FEATURE_NAME_UPPER}}_URLS = {
  main: '/{{feature-name}}',
  detail: (id: string) => `/{{feature-name}}/${id}`,
  create: '/{{feature-name}}/new',
} as const;

// ─────────────────────────────────────────────────────────────────
// TIMEOUTS (if feature-specific overrides needed)
// ─────────────────────────────────────────────────────────────────

/**
 * Feature-specific timeout overrides
 */
export const {{FEATURE_NAME_UPPER}}_TIMEOUTS = {
  apiResponse: 10000,
  animation: 500,
} as const;

// ─────────────────────────────────────────────────────────────────
// EXPECTED VALUES
// ─────────────────────────────────────────────────────────────────

/**
 * Expected values for assertions
 */
export const EXPECTED = {
  minItems: 1,
  maxItems: 100,
  defaultPageSize: 10,
} as const;

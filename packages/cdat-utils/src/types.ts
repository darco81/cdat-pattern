/**
 * CDAT Pattern - Type Definitions
 * @description Core types and enums for CDAT utility methods
 */

/**
 * Locator states for wait operations
 * Maps directly to Playwright's waitFor state options
 */
export enum LocatorState {
  /** Element is attached to DOM */
  Attached = 'attached',
  /** Element is detached from DOM */
  Detached = 'detached',
  /** Element is visible in viewport */
  Visible = 'visible',
  /** Element is hidden (display:none, visibility:hidden, etc.) */
  Hidden = 'hidden',
}

/**
 * Options for wait operations
 */
export interface WaitOptions {
  /** Timeout in milliseconds */
  timeout?: number;
  /** Whether to throw on timeout (default: true) */
  throwOnTimeout?: boolean;
}

/**
 * Result of a state check operation
 */
export interface StateCheckResult {
  /** Whether the check passed */
  success: boolean;
  /** Actual state if check failed */
  actualState?: string;
  /** Error message if check failed */
  error?: string;
}

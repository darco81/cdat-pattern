/**
 * CDAT Pattern - Timeout Constants
 * @description Standardized timeout values for consistent wait behavior
 */

/**
 * Timeout configuration for CDAT operations
 * All values are in milliseconds
 */
export const TIMEOUTS = {
  /** Very short operations (animations, tooltips) - 1 second */
  VERY_SHORT: 1000,
  /** Short operations (quick state changes) - 3 seconds */
  SHORT: 3000,
  /** Medium operations (form submissions, navigation) - 5 seconds */
  MEDIUM: 5000,
  /** Default timeout for most operations - 10 seconds */
  DEFAULT: 10000,
  /** Long operations (file uploads, complex API calls) - 30 seconds */
  LONG: 30000,
  /** Very long operations (heavy processing) - 60 seconds */
  VERY_LONG: 60000,
} as const;

/**
 * Type for timeout keys
 */
export type TimeoutKey = keyof typeof TIMEOUTS;

/**
 * Default retry configuration
 */
export const RETRY_CONFIG = {
  /** Maximum number of retries for flaky operations */
  MAX_RETRIES: 3,
  /** Base delay between retries in milliseconds */
  RETRY_DELAY: 500,
  /** Multiplier for exponential backoff */
  BACKOFF_MULTIPLIER: 2,
} as const;

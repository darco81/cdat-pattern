/**
 * CDAT Pattern Utilities
 * @description Smart wait utilities for Playwright E2E tests
 * @see https://github.com/dar-kow/cdat-pattern
 */

export { Cdat } from './smart-waits';
export { LocatorState } from './types';
export type { WaitOptions, StateCheckResult } from './types';
export { TIMEOUTS, RETRY_CONFIG } from './constants';
export type { TimeoutKey } from './constants';

// Domain-specific utilities (from production analysis)
export { GlobalComponents } from './global-components';

// Environment management
export { Environment, type EnvironmentConfig } from './environment';

// Cookie consent setup
export {
  globalSetup as cookieConsentSetup,
  COOKIE_BANNER_SELECTORS,
  ACCEPT_BUTTON_SELECTORS,
  COOKIE_STATE_FILE,
} from './cookie-consent';

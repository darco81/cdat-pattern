/**
 * Health Guardian Data
 *
 * Contains thresholds, expected states, and validation criteria
 * for cross-cutting concerns: backend health, i18n, accessibility
 */

// Health check performance thresholds
export const HEALTH_THRESHOLDS = {
  maxResponseTime: 5000,      // API response time (ms)
  minNavigationElements: 1,   // Minimum critical nav items
  maxRawI18nKeys: 0,         // Visible translation keys (should be 0)
  maxLoadingTime: 10000,     // Page load timeout (ms)
} as const;

// Critical application routes for backend health validation
export const CRITICAL_ROUTES = [
  '/',                        // Homepage
  '/login',                   // Authentication page
] as const;

// Expected accessibility characteristics
export interface AccessibilityExpectation {
  role: string;
  hasAccessibleName: boolean;
  isKeyboardAccessible: boolean;
  isRequired?: boolean;
}

// Critical accessibility elements that must be present and properly configured
export const CRITICAL_A11Y_ELEMENTS: AccessibilityExpectation[] = [
  {
    role: 'navigation',
    hasAccessibleName: false,    // Navigation may not need explicit name
    isKeyboardAccessible: true,
    isRequired: true
  },
  {
    role: 'link',
    hasAccessibleName: true,
    isKeyboardAccessible: true,
    isRequired: true
  },
];

// i18n validation patterns and expectations
export const I18N_PATTERNS = {
  // Raw translation keys that indicate i18n failure
  rawKey: /\b\w+\.\w+\b/,
  // Expected content pattern (basic validation)
  validText: /^[\w\s\-.,!?'"()]+$/,
  // Minimum text length for translated content
  minTextLength: 2,
} as const;

// Health check result types
export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    backend: boolean;
    i18n: boolean;
    accessibility: boolean;
  };
  details: string[];
  timestamp: number;
}

// Individual check results
export interface BackendHealthResult {
  route: string;
  status: number;
  responseTime: number;
  isHealthy: boolean;
}

export interface I18nHealthResult {
  hasRawKeys: boolean;
  rawKeyCount: number;
  validTranslations: boolean;
}

export interface A11yHealthResult {
  element: string;
  hasRole: boolean;
  hasAccessibleName: boolean;
  isKeyboardAccessible: boolean;
  isValid: boolean;
}

// Error messages for health check failures
export const HEALTH_ERROR_MESSAGES = {
  BACKEND_DOWN: 'Backend services are not responding',
  BACKEND_SLOW: 'Backend response time exceeds threshold',
  I18N_RAW_KEYS: 'Raw translation keys are visible to users',
  I18N_MISSING: 'Critical translations are missing',
  A11Y_MISSING_ROLE: 'Critical element missing accessibility role',
  A11Y_NO_NAME: 'Interactive element lacks accessible name',
  A11Y_NOT_KEYBOARD: 'Element not accessible via keyboard',
} as const;
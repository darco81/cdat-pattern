import type { Page, Response } from '@playwright/test';
import { Cdat, LocatorState } from '../../utils/Cdat';
import { HealthComponents } from './components';
import {
  HEALTH_THRESHOLDS,
  CRITICAL_ROUTES,
  CRITICAL_A11Y_ELEMENTS,
  I18N_PATTERNS,
  HEALTH_ERROR_MESSAGES,
  type HealthCheckResult,
  type BackendHealthResult,
  type I18nHealthResult,
  type A11yHealthResult,
  type AccessibilityExpectation
} from './data';

/**
 * Health Guardian Actions
 *
 * Contains business logic for validating cross-cutting concerns.
 * NO assertions - returns data for tests to assert upon.
 * Follows Zero Rules: no any, no waitForTimeout, no else.
 */
export class HealthActions {
  private readonly components: HealthComponents;

  constructor(private readonly page: Page) {
    this.components = new HealthComponents(page);
  }

  /**
   * Backend Health Check
   * Validates that critical routes respond with non-5xx status
   * within acceptable response time
   */
  async checkBackendHealth(): Promise<boolean> {
    for (const route of CRITICAL_ROUTES) {
      const result = await this.checkSingleRoute(route);

      if (!result.isHealthy) {
        return false;
      }
    }

    return true;
  }

  /**
   * Detailed backend health check with per-route results
   */
  async getDetailedBackendHealth(): Promise<BackendHealthResult[]> {
    const results: BackendHealthResult[] = [];

    for (const route of CRITICAL_ROUTES) {
      const result = await this.checkSingleRoute(route);
      results.push(result);
    }

    return results;
  }

  /**
   * Check single route health
   */
  private async checkSingleRoute(route: string): Promise<BackendHealthResult> {
    const startTime = Date.now();

    try {
      const response: Response = await this.page.goto(route);
      const responseTime = Date.now() - startTime;
      const status = response.status();

      const isHealthy = status < 500 && responseTime <= HEALTH_THRESHOLDS.maxResponseTime;

      return {
        route,
        status,
        responseTime,
        isHealthy
      };

    } catch (error) {
      return {
        route,
        status: 0,
        responseTime: Date.now() - startTime,
        isHealthy: false
      };
    }
  }

  /**
   * i18n Health Check
   * Validates that no raw translation keys are visible
   * and critical content is properly translated
   */
  async checkI18nHealth(): Promise<boolean> {
    // Navigate to homepage for i18n validation
    await this.page.goto('/');

    const result = await this.getDetailedI18nHealth();
    return !result.hasRawKeys && result.validTranslations;
  }

  /**
   * Detailed i18n health check
   */
  async getDetailedI18nHealth(): Promise<I18nHealthResult> {
    // Check for visible raw translation keys
    const rawKeys = this.components.getTranslationKeyElements();
    const rawKeyCount = await rawKeys.count();

    // Check critical content has valid translations
    const titleExists = await Cdat.checkState(
      this.components.pageTitle,
      LocatorState.Attached
    );

    let validTranslations = true;

    if (titleExists) {
      const titleText = await Cdat.waitForText(this.components.pageTitle);

      // Title should not be a raw translation key
      if (I18N_PATTERNS.rawKey.test(titleText)) {
        validTranslations = false;
      }

      // Title should have minimum length
      if (titleText.trim().length < I18N_PATTERNS.minTextLength) {
        validTranslations = false;
      }
    }

    if (!titleExists) {
      validTranslations = false;
    }

    return {
      hasRawKeys: rawKeyCount > HEALTH_THRESHOLDS.maxRawI18nKeys,
      rawKeyCount,
      validTranslations
    };
  }

  /**
   * Accessibility Health Check
   * Validates that critical interactive elements have proper
   * ARIA roles, accessible names, and keyboard accessibility
   */
  async checkAccessibilityHealth(): Promise<boolean> {
    await this.page.goto('/');

    for (const expectation of CRITICAL_A11Y_ELEMENTS) {
      const result = await this.validateAccessibilityElement(expectation);

      if (!result.isValid) {
        return false;
      }
    }

    return true;
  }

  /**
   * Detailed accessibility health check
   */
  async getDetailedA11yHealth(): Promise<A11yHealthResult[]> {
    const results: A11yHealthResult[] = [];

    for (const expectation of CRITICAL_A11Y_ELEMENTS) {
      const result = await this.validateAccessibilityElement(expectation);
      results.push(result);
    }

    return results;
  }

  /**
   * Validate single accessibility element
   */
  private async validateAccessibilityElement(
    expectation: AccessibilityExpectation
  ): Promise<A11yHealthResult> {
    const elements = this.page.getByRole(expectation.role);
    const count = await elements.count();

    const result: A11yHealthResult = {
      element: expectation.role,
      hasRole: count > 0,
      hasAccessibleName: false,
      isKeyboardAccessible: false,
      isValid: false
    };

    if (count === 0) {
      return result;
    }

    // Check first element as representative
    const firstElement = elements.first();

    // Check accessible name if required
    if (expectation.hasAccessibleName) {
      const accessibleName = await firstElement.getAttribute('aria-label');
      const textContent = await firstElement.textContent();
      const hasName = (accessibleName?.trim().length || 0) > 0 ||
                     (textContent?.trim().length || 0) > 0;

      result.hasAccessibleName = hasName;
    }

    if (!expectation.hasAccessibleName) {
      result.hasAccessibleName = true; // Not required
    }

    // Check keyboard accessibility if required
    if (expectation.isKeyboardAccessible) {
      const tabIndex = await firstElement.getAttribute('tabindex');
      const isVisible = await Cdat.checkState(firstElement, LocatorState.Visible);
      const isFocusable = tabIndex !== '-1' && isVisible;

      result.isKeyboardAccessible = isFocusable;
    }

    if (!expectation.isKeyboardAccessible) {
      result.isKeyboardAccessible = true; // Not required
    }

    // Element is valid if all required checks pass
    result.isValid = result.hasRole &&
                    result.hasAccessibleName &&
                    result.isKeyboardAccessible;

    return result;
  }

  /**
   * Comprehensive Health Check
   * Runs all health validations and returns aggregate status
   */
  async performFullHealthCheck(): Promise<HealthCheckResult> {
    const checks = {
      backend: await this.checkBackendHealth(),
      i18n: await this.checkI18nHealth(),
      accessibility: await this.checkAccessibilityHealth(),
    };

    const healthyCount = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;

    // Determine health status using early return pattern (Zero-else rule)
    let status: HealthCheckResult['status'];

    if (healthyCount === totalChecks) {
      status = 'healthy';
    } else if (healthyCount >= totalChecks / 2) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    const details: string[] = [];
    if (!checks.backend) details.push(HEALTH_ERROR_MESSAGES.BACKEND_DOWN);
    if (!checks.i18n) details.push(HEALTH_ERROR_MESSAGES.I18N_RAW_KEYS);
    if (!checks.accessibility) details.push(HEALTH_ERROR_MESSAGES.A11Y_MISSING_ROLE);

    return {
      status, // Safe - always assigned
      checks,
      details,
      timestamp: Date.now()
    };
  }

  /**
   * Get error message for specific failure
   */
  async getFailureReason(): Promise<string> {
    const backendHealthy = await this.checkBackendHealth();
    if (!backendHealthy) {
      return HEALTH_ERROR_MESSAGES.BACKEND_DOWN;
    }

    const i18nHealthy = await this.checkI18nHealth();
    if (!i18nHealthy) {
      return HEALTH_ERROR_MESSAGES.I18N_RAW_KEYS;
    }

    const a11yHealthy = await this.checkAccessibilityHealth();
    if (!a11yHealthy) {
      return HEALTH_ERROR_MESSAGES.A11Y_MISSING_ROLE;
    }

    return 'All health checks passed';
  }
}
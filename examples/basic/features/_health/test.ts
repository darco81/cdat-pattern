import { test, expect } from '@playwright/test';
import { HealthActions } from './actions';
import { HealthComponents } from './components';
import { HEALTH_THRESHOLDS } from './data';

/**
 * Health Guardian Tests (Pre-flight Validation)
 *
 * These tests validate cross-cutting concerns BEFORE feature tests run.
 * Failures here indicate infrastructure/environment issues, not feature bugs.
 *
 * Test naming: TC_HEALTH_XXX for clear identification in reports
 */
test.describe('Environment Health (Pre-flight)', () => {
  let healthActions: HealthActions;
  let healthComponents: HealthComponents;

  test.beforeEach(async ({ page }) => {
    healthActions = new HealthActions(page);
    healthComponents = new HealthComponents(page);
  });

  test('TC_HEALTH_001: Backend services respond with healthy status', async () => {
    // Arrange: Health check configuration is in data.ts

    // Act: Check backend connectivity
    const isBackendHealthy = await healthActions.checkBackendHealth();

    // Assert: All critical routes should return healthy responses
    // Get detailed results for comprehensive failure context
    if (!isBackendHealthy) {
      const detailedResults = await healthActions.getDetailedBackendHealth();
      const failedRoutes = detailedResults.filter(r => !r.isHealthy);
      const failureDetails = failedRoutes.map(r => `${r.route} (${r.status}, ${r.responseTime}ms)`).join(', ');

      expect(isBackendHealthy, `Backend unhealthy: ${failureDetails}`).toBe(true);
    } else {
      expect(isBackendHealthy).toBe(true);
    }
  });

  test('TC_HEALTH_002: i18n translations are properly loaded', async () => {
    // Arrange: Navigate to homepage for i18n validation
    await healthActions.page.goto('/');

    // Act: Check translation health
    const isI18nHealthy = await healthActions.checkI18nHealth();

    // Assert: No raw translation keys should be visible
    // Get detailed results for comprehensive failure context
    if (!isI18nHealthy) {
      const i18nDetails = await healthActions.getDetailedI18nHealth();
      const issues: string[] = [];

      if (i18nDetails.hasRawKeys) {
        issues.push(`${i18nDetails.rawKeyCount} raw translation keys visible`);
      }
      if (!i18nDetails.validTranslations) {
        issues.push('critical translations are invalid or missing');
      }

      expect(isI18nHealthy, `i18n unhealthy: ${issues.join(', ')}`).toBe(true);
    } else {
      expect(isI18nHealthy).toBe(true);
    }
  });

  test('TC_HEALTH_003: Critical elements have accessibility roles and names', async () => {
    // Arrange: Navigate to homepage for a11y validation
    await healthActions.page.goto('/');

    // Act: Check accessibility health
    const isA11yHealthy = await healthActions.checkAccessibilityHealth();

    // Assert: All critical elements should be accessible
    // Get detailed results for comprehensive failure context
    if (!isA11yHealthy) {
      const a11yDetails = await healthActions.getDetailedA11yHealth();
      const invalidElements = a11yDetails.filter(e => !e.isValid);
      const failureDetails = invalidElements.map(e => e.element).join(', ');

      expect(isA11yHealthy, `A11y unhealthy: ${failureDetails} missing required accessibility attributes`).toBe(true);
    } else {
      expect(isA11yHealthy).toBe(true);
    }
  });

  test('TC_HEALTH_FULL: Complete environment health validation', async () => {
    // Arrange: Full health check encompasses all concerns

    // Act: Comprehensive health validation
    const healthReport = await healthActions.performFullHealthCheck();

    // Assert: Overall environment should be healthy
    expect(healthReport.status).toBe('healthy');
    expect(healthReport.checks.backend).toBe(true);
    expect(healthReport.checks.i18n).toBe(true);
    expect(healthReport.checks.accessibility).toBe(true);

    // Assert: No failure details should be present for healthy environment
    expect(healthReport.details).toHaveLength(0);

    // Provide detailed failure context if not healthy
    if (healthReport.status !== 'healthy') {
      const failureContext = `Environment health check failed: ${healthReport.details.join(', ')}`;
      expect(healthReport.status, failureContext).toBe('healthy');
    }
  });

  test('TC_HEALTH_LOCATOR: ARIA-first locator policy is enforced', async () => {
    // Arrange: Navigate to homepage for locator validation
    await healthActions.page.goto('/');

    // Act & Assert: Critical elements should be locatable by ARIA role

    // Navigation should be findable by semantic role
    await expect(healthComponents.mainNavigation).toBeAttached();

    // Login link should be findable by role and accessible name
    await expect(healthComponents.loginButton).toBeVisible();
    await expect(healthComponents.loginButton).toHaveAccessibleName();

    // Page should have proper heading structure
    await expect(healthComponents.primaryHeading).toBeVisible();
    await expect(healthComponents.primaryHeading).toHaveRole('heading');
  });

  test('TC_HEALTH_I18N_DETAIL: Raw translation keys are not visible to users', async () => {
    // Arrange: Navigate to homepage
    await healthActions.page.goto('/');

    // Act: Check for raw translation keys
    const rawKeyElements = healthComponents.getTranslationKeyElements();
    const rawKeyCount = await rawKeyElements.count();

    // Assert: No raw keys should be visible (indicates i18n loading failure)
    expect(rawKeyCount).toBeLessThanOrEqual(HEALTH_THRESHOLDS.maxRawI18nKeys);

    if (rawKeyCount > 0) {
      const firstRawKey = await rawKeyElements.first().textContent();
      expect(rawKeyCount,
        `Found ${rawKeyCount} raw translation keys, first one: "${firstRawKey}"`
      ).toBe(0);
    }
  });

  test('TC_HEALTH_PERF: Page load performance meets thresholds', async ({ page }) => {
    // Arrange: Track navigation timing with high precision
    const startTime = performance.now();

    // Act: Navigate to homepage with timeout
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: HEALTH_THRESHOLDS.maxLoadingTime
    });

    const loadTime = performance.now() - startTime;

    // Assert: Page should load within acceptable timeframe
    if (loadTime >= HEALTH_THRESHOLDS.maxLoadingTime) {
      expect(loadTime, `Page load took ${loadTime.toFixed(2)}ms, exceeds threshold of ${HEALTH_THRESHOLDS.maxLoadingTime}ms`).toBeLessThan(HEALTH_THRESHOLDS.maxLoadingTime);
    } else {
      expect(loadTime).toBeLessThan(HEALTH_THRESHOLDS.maxLoadingTime);
    }
  });
});

// Additional test suite for detailed health reporting
test.describe('Health Reporting (Diagnostic)', () => {
  let healthActions: HealthActions;

  test.beforeEach(async ({ page }) => {
    healthActions = new HealthActions(page);
  });

  test('TC_HEALTH_REPORT: Health check provides detailed failure context', async () => {
    // This test demonstrates how Guardian failures provide clear debugging context
    // It should pass on healthy environments, but show detailed info when failing

    const healthReport = await healthActions.performFullHealthCheck();

    // Log detailed information for debugging (visible in test reports)
    console.log('=== HEALTH REPORT ===');
    console.log('Status:', healthReport.status);
    console.log('Backend healthy:', healthReport.checks.backend);
    console.log('i18n healthy:', healthReport.checks.i18n);
    console.log('A11y healthy:', healthReport.checks.accessibility);
    console.log('Failure details:', healthReport.details);
    console.log('Timestamp:', new Date(healthReport.timestamp).toISOString());

    // Primary assertion
    expect(healthReport.status).toBe('healthy');
  });
});
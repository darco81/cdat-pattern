# CDAT Basic Example

A minimal example demonstrating the CDAT Pattern with a login feature.

## Structure

```
basic/
├── features/
│   ├── _health/             # Guardian module (cross-cutting concerns)
│   │   ├── components.ts    # Health check locators
│   │   ├── data.ts          # Health thresholds & expectations
│   │   ├── actions.ts       # Health validation logic
│   │   └── test.ts          # Pre-flight health tests
│   └── login/
│       ├── components.ts    # Locators only
│       ├── data.ts          # Test data & types
│       ├── actions.ts       # Business logic
│       └── test.ts          # Test scenarios
├── utils/
│   └── Cdat.ts              # Smart wait utilities
├── playwright.config.ts
└── package.json
```

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run tests
npm test

# Run tests with UI
npm run test:ui
```

## CDAT Layers Explained

### Components (C)
```typescript
// Only locators - no logic
export class LoginComponents {
  readonly usernameInput: Locator;
  readonly submitButton: Locator;
  // ...
}
```

### Data (D)
```typescript
// Only test data and types
export interface LoginCredentials {
  username: string;
  password: string;
}

export const VALID_USER: LoginCredentials = {
  username: 'testuser',
  password: 'Password123!',
};
```

### Actions (A)
```typescript
// Business logic - NO expect() here
export class LoginActions {
  async login(credentials: LoginCredentials): Promise<void> {
    await this.fillUsername(credentials.username);
    await this.fillPassword(credentials.password);
    await this.clickSubmit();
  }
}
```

### Tests (T)
```typescript
// Assertions belong here
test('successful login', async () => {
  await actions.login(VALID_USER);
  await expect(page).toHaveURL(/dashboard/);
});
```

## Cross-Cutting Guardians

The `_health` module demonstrates **Guardian Pattern** - CDAT modules that handle cross-cutting concerns:

### Guardian Pattern (_health)
```typescript
// _health/components.ts - Health check locators
readonly mainNavigation: Locator;
readonly errorBanner: Locator;

// _health/actions.ts - Health validation (NO assertions)
async checkBackendHealth(): Promise<boolean>
async checkI18nHealth(): Promise<boolean> 
async checkAccessibilityHealth(): Promise<boolean>

// _health/test.ts - Pre-flight validation
test('Backend services are healthy', async () => {
  const isHealthy = await healthActions.checkBackendHealth();
  expect(isHealthy).toBe(true);
});
```

### ARIA-First Locator Policy

Guardians enforce **ARIA-first locators** - never locate by translated text:

```typescript
// ✅ GOOD - Durable locators
page.getByRole('button', { name: 'Submit' })  // ARIA role
page.getByTestId('error-banner')              // data-testid  

// ❌ BAD - Brittle text locators  
page.getByText('Submit')                      // Breaks on i18n
page.locator('text=Zatwierdzisz')            // Translation-coupled
```

**Why:** Text locators create false coupling between i18n failures and test failures. ARIA locators test the feature while allowing translation assertions to validate i18n properly.

### Guardian Benefits

1. **Clear failure signals** - "Backend down" vs. "Feature X failed" 
2. **Pre-flight validation** - Catch infrastructure issues before feature tests run
3. **Cross-team visibility** - Health status for infra/i18n/a11y teams
4. **Stable feature tests** - Environment issues don't cascade to all tests

## Learn More

See the [CDAT Pattern documentation](../../README.md) for detailed guides.

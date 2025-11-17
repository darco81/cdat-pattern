# Migration Guide

> Migrate from Classic Page Object Model to CDAT Pattern

## Overview

This guide helps you migrate existing POM-based tests to CDAT Pattern. The migration can be done incrementally - you don't need to rewrite everything at once.

---

## Assessment: Where Are You Now?

### Classic POM Indicators

Your codebase likely needs migration if you see:

```typescript
// ❌ God object with mixed responsibilities
class CheckoutPage {
  // 50+ locators
  usernameInput = page.locator('#username');
  passwordInput = page.locator('#password');
  // ... many more

  // Methods with embedded assertions
  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
    await expect(this.dashboard).toBeVisible(); // Assertion in PO!
  }

  // Hardcoded waits
  async waitForLoad() {
    await this.page.waitForTimeout(5000);
  }

  // Test data mixed in
  readonly validUser = { user: 'test', pass: 'test123' };
}
```

---

## Migration Strategy

### Step 1: Create Feature Directory

For each page/feature, create a CDAT feature directory:

```
features/
└── login/
    ├── components.ts    # Will contain locators
    ├── data.ts          # Will contain test data
    ├── actions.ts       # Will contain logic
    └── test.ts          # Tests (may already exist)
```

### Step 2: Extract Components

Move all locators to `components.ts`:

**Before (POM):**
```typescript
class LoginPage {
  usernameInput = this.page.locator('#username');
  passwordInput = this.page.locator('#password');
  loginButton = this.page.locator('#login-btn');
  errorMessage = this.page.locator('.error');
  dashboard = this.page.locator('#dashboard');

  constructor(private page: Page) {}

  // ... methods
}
```

**After (CDAT Components):**
```typescript
// components.ts
import type { Page, Locator } from '@playwright/test';

export class LoginComponents {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly dashboard: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-btn');
    this.errorMessage = page.locator('.error');
    this.dashboard = page.locator('#dashboard');
  }
}
```

**Key changes:**
- `readonly` on all locators
- No methods, just locators
- Private readonly page

### Step 3: Extract Data

Move test data and types to `data.ts`:

**Before (scattered in POM and tests):**
```typescript
// In page object
readonly validUser = { user: 'test', pass: 'test123' };

// In test file
const invalidUser = { user: 'wrong', pass: 'wrong' };
```

**After (CDAT Data):**
```typescript
// data.ts
export interface LoginCredentials {
  username: string;
  password: string;
}

export const VALID_USER: LoginCredentials = {
  username: 'test',
  password: 'test123',
};

export const INVALID_USER: LoginCredentials = {
  username: 'wrong',
  password: 'wrong',
};

export const LOGIN_URLS = {
  login: '/login',
  dashboard: '/dashboard',
} as const;
```

### Step 4: Create Actions

Extract business logic to `actions.ts`, removing assertions:

**Before (POM with assertions):**
```typescript
class LoginPage {
  async login(user: string, pass: string) {
    await this.page.waitForTimeout(2000);
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
    await expect(this.dashboard).toBeVisible(); // Remove this!
  }

  async getErrorText(): Promise<string> {
    await this.page.waitForTimeout(1000);
    return this.errorMessage.textContent() ?? '';
  }
}
```

**After (CDAT Actions):**
```typescript
// actions.ts
import { Cdat, LocatorState } from '../utils/Cdat';
import { LoginComponents } from './components';
import type { LoginCredentials } from './data';

export class LoginActions {
  private readonly components: LoginComponents;

  constructor(private readonly page: Page) {
    this.components = new LoginComponents(page);
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await Cdat.waitAndFill(this.components.usernameInput, credentials.username);
    await Cdat.waitAndFill(this.components.passwordInput, credentials.password);
    await Cdat.waitAndClick(this.components.loginButton);
    // NO assertion here - moved to test
  }

  async getErrorMessage(): Promise<string> {
    return Cdat.waitForText(this.components.errorMessage);
  }

  async isLoginSuccessful(): Promise<boolean> {
    return Cdat.checkState(this.components.dashboard, LocatorState.Visible);
  }
}
```

**Key changes:**
- Smart waits replace `waitForTimeout`
- No `expect()` - assertions go in tests
- Returns data, doesn't assert

### Step 5: Update Tests

Move assertions to test file, use new structure:

**Before:**
```typescript
test('login works', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('test', 'test123');
  // Assertion was inside login()
});
```

**After:**
```typescript
// test.ts
import { test, expect } from '@playwright/test';
import { LoginActions } from './actions';
import { VALID_USER, LOGIN_URLS } from './data';

test('TC_001: Given valid credentials, When login, Then dashboard shown', async ({
  page,
}) => {
  const actions = new LoginActions(page);

  await page.goto(LOGIN_URLS.login);
  await actions.login(VALID_USER);

  await expect(page).toHaveURL(new RegExp(LOGIN_URLS.dashboard));
});
```

---

## Common Migration Patterns

### Assertions in Page Objects

**Before:**
```typescript
async verifyLoginSuccess() {
  await expect(this.dashboard).toBeVisible();
  await expect(this.welcomeMessage).toContainText('Welcome');
}
```

**After:**
```typescript
// In actions.ts - return data
async isLoginSuccessful(): Promise<boolean> {
  return Cdat.checkState(this.components.dashboard, LocatorState.Visible);
}

async getWelcomeMessage(): Promise<string> {
  return Cdat.waitForText(this.components.welcomeMessage);
}

// In test.ts - assert
test('login success', async () => {
  await actions.login(VALID_USER);

  const isSuccessful = await actions.isLoginSuccessful();
  expect(isSuccessful).toBe(true);

  const message = await actions.getWelcomeMessage();
  expect(message).toContain('Welcome');
});
```

### Hardcoded Waits

**Before:**
```typescript
async waitForPageLoad() {
  await this.page.waitForTimeout(5000);
}
```

**After:**
```typescript
async waitForPageLoad(): Promise<void> {
  await Cdat.waitForState(this.components.mainContent, LocatorState.Visible);
  await Cdat.waitForLoaderToDisappear(this.components.loader);
}
```

### Mixed Data

**Before:**
```typescript
class CheckoutPage {
  readonly testAddress = '123 Main St';
  readonly testCard = '4242424242424242';
}
```

**After:**
```typescript
// data.ts
export interface ShippingAddress {
  street: string;
  city: string;
  zip: string;
}

export const TEST_ADDRESS: ShippingAddress = {
  street: '123 Main St',
  city: 'New York',
  zip: '10001',
};

export const TEST_CARDS = {
  success: '4242424242424242',
  declined: '4000000000000002',
} as const;
```

---

## Incremental Migration

You don't have to migrate everything at once:

### Phase 1: New Features

Apply CDAT to all new features. Old POM code continues to work.

### Phase 2: High-Change Areas

Migrate features that change frequently or have flaky tests.

### Phase 3: Remaining Features

Gradually migrate remaining features during refactoring work.

### Coexistence Strategy

CDAT and POM can coexist:

```
tests/
├── pages/              # Old POM (being phased out)
│   ├── LoginPage.ts
│   └── CheckoutPage.ts
└── features/           # New CDAT
    ├── login/
    │   ├── components.ts
    │   ├── data.ts
    │   ├── actions.ts
    │   └── test.ts
    └── cart/
        └── ...
```

---

## Migration Checklist

For each feature:

- [ ] Create feature directory with 4 files
- [ ] Extract locators to `components.ts`
- [ ] Extract types and data to `data.ts`
- [ ] Move logic to `actions.ts` (remove assertions)
- [ ] Update tests to use new structure
- [ ] Replace `waitForTimeout` with smart waits
- [ ] Add proper TypeScript types (no `any`)
- [ ] Refactor if-else to early returns
- [ ] Delete old POM file

---

## Troubleshooting

### Tests fail after migration

1. Check assertions moved from actions to tests
2. Verify smart waits replace hardcoded timeouts
3. Ensure components are properly initialized

### TypeScript errors

1. Add missing type definitions to `data.ts`
2. Use `readonly` on component locators
3. Check import paths

### Flaky tests persist

1. Replace remaining `waitForTimeout` calls
2. Use `waitForLoaderToDisappear` for dynamic content
3. Check for race conditions in assertions

---

## Next Steps

- Read [Best Practices](./BEST-PRACTICES.md)
- Explore [Examples](../examples/)
- Check [FAQ](./FAQ.md)

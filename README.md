# CDAT Pattern

> **Components-Data-Actions-Tests**: A modern 4-layer architecture for maintainable Playwright tests

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40+-green.svg)](https://playwright.dev/)

---

## The Problem

Traditional Page Object Model (POM) often leads to:

- **God Objects** - Page classes that grow to thousands of lines
- **Mixed Responsibilities** - Locators, logic, and assertions tangled together
- **Flaky Tests** - Hardcoded timeouts scattered throughout the codebase
- **Poor Reusability** - Copy-paste patterns instead of composition

## The Solution

CDAT separates concerns into **four distinct layers**, each with a single responsibility:

```
Components  →  Locators only (no logic)
Data        →  Types & test data (no locators)
Actions     →  Business logic (no assertions)
Tests       →  Scenarios & assertions
```

This separation enables:

- **Clear boundaries** between UI structure, data, logic, and verification
- **Easy maintenance** - changes are isolated to relevant layers
- **Smart waits** - no more `waitForTimeout`
- **Type safety** - no `any` types
- **Composition** - build complex flows from simple, reusable pieces

---

## Quick Start

### 1. Install dependencies

```bash
npm init playwright@latest
npm install -D typescript
```

### 2. Create the CDAT structure

```
features/
└── login/
    ├── components.ts    # C - Locators
    ├── data.ts          # D - Types & test data
    ├── actions.ts       # A - Business logic
    └── test.ts          # T - Test scenarios
```

### 3. Implement each layer

**components.ts** - Pure locators, no logic:

```typescript
import type { Page, Locator } from '@playwright/test';

export class LoginComponents {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.locator('[data-testid="error"]');
  }
}
```

**data.ts** - Types and test data:

```typescript
export interface LoginCredentials {
  username: string;
  password: string;
}

export const VALID_USER: LoginCredentials = {
  username: 'testuser',
  password: 'Password123!',
};

export const INVALID_USER: LoginCredentials = {
  username: 'wrong',
  password: 'wrong',
};
```

**actions.ts** - Business logic, NO assertions:

```typescript
import type { Page } from '@playwright/test';
import { Cdat } from '@cdat/utils';
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
    await Cdat.waitAndClick(this.components.submitButton);
  }

  async getErrorMessage(): Promise<string> {
    return Cdat.waitForText(this.components.errorMessage);
  }
}
```

**test.ts** - Scenarios with assertions:

```typescript
import { test, expect } from '@playwright/test';
import { LoginActions } from './actions';
import { VALID_USER, INVALID_USER } from './data';

test.describe('Login Feature', () => {
  let actions: LoginActions;

  test.beforeEach(async ({ page }) => {
    actions = new LoginActions(page);
    await page.goto('/login');
  });

  test('Given valid credentials, When login, Then success', async ({ page }) => {
    await actions.login(VALID_USER);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Given invalid credentials, When login, Then error shown', async () => {
    await actions.login(INVALID_USER);
    const error = await actions.getErrorMessage();
    expect(error).toContain('Invalid');
  });
});
```

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Components    │     │      Data       │
│   (Locators)    │     │  (Test Data)    │
│                 │     │                 │
│  No dependencies│     │  No dependencies│
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
         ┌─────────────────────┐
         │       Actions       │
         │  (Business Logic)   │
         │                     │
         │  Uses: Components   │
         │        + Data       │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │        Tests        │
         │    (Scenarios)      │
         │                     │
         │  Uses: All layers   │
         │  Contains: expect() │
         └─────────────────────┘
```

**Dependency Rules:**
- Components → nothing
- Data → nothing
- Actions → Components + Data
- Tests → Components + Data + Actions

---

## The Three Zero Rules

CDAT enforces three strict rules for maintainable tests:

### 1. Zero `any`

Every variable, parameter, and return value must have a proper type.

```typescript
// Bad
async getProduct(): Promise<any> { ... }

// Good
async getProduct(): Promise<ProductData> { ... }
```

### 2. Zero `waitForTimeout`

Never use hardcoded delays. Use smart waits instead.

```typescript
// Bad
await page.waitForTimeout(5000);
await button.click();

// Good
await Cdat.waitAndClick(button);
```

### 3. Zero `else`

Use early returns for cleaner, flatter code.

```typescript
// Bad
if (condition) {
  // ... nested code
} else {
  throw new Error('...');
}

// Good
if (!condition) {
  throw new Error('...');
}
// ... flat code
```

---

## Smart Waits (Cdat Utility)

The `Cdat` class provides intelligent waiting methods:

```typescript
// Wait and interact
await Cdat.waitAndClick(button);
await Cdat.waitAndFill(input, 'value');
await Cdat.waitAndSelect(dropdown, 'option');

// Wait for states
await Cdat.waitForState(element, LocatorState.Visible);
await Cdat.waitForHidden(loader);

// Get data with waits
const text = await Cdat.waitForText(message);
const value = await Cdat.waitForInputValue(input);

// Check states (non-throwing)
const isVisible = await Cdat.checkState(element, LocatorState.Visible);
```

---

## Comparison

| Aspect | Classic POM | CDAT Pattern |
|--------|-------------|--------------|
| File structure | 1 file per page | 4 files per feature |
| Responsibilities | Mixed | Separated |
| Assertions | In page objects | Only in tests |
| Waits | Scattered timeouts | Centralized smart waits |
| Type safety | Often `any` | Strict typing |
| Reusability | Copy-paste | Composition |

---

## Production Proven

CDAT pattern has been battle-tested across **18 months** and **9 production implementations**:

- B2B Platforms
- E-commerce Systems
- CRM Applications
- Event Management
- Education Platforms
- Invoicing Systems
- Logistics & Transportation
- Automotive Wholesale

---

## Documentation

- [Architecture](docs/ARCHITECTURE.md) - Detailed layer breakdown
- [Zero Rules](docs/ZERO-RULES.md) - The three zero rules explained
- [Composition](docs/COMPOSITION.md) - Selector & method composition
- [Smart Waits](docs/SMART-WAITS.md) - Cdat utility reference
- [Migration Guide](docs/MIGRATION-GUIDE.md) - From classic POM
- [Best Practices](docs/BEST-PRACTICES.md) - Do's and Don'ts
- [FAQ](docs/FAQ.md) - Common questions

## Examples

- [Basic Example](examples/basic/) - Minimal login feature
- [E-commerce Example](examples/e-commerce/) - Full multi-feature suite
- [CRM/ERP Example](examples/crm-erp/) - Enterprise patterns for business applications

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## License

[MIT](LICENSE) - Free for personal and commercial use.

---

<p align="center">
  <strong>Built with CDAT Pattern</strong><br>
  <em>Write tests that scale.</em>
</p>

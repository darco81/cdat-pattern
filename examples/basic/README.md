# CDAT Basic Example

A minimal example demonstrating the CDAT Pattern with a login feature.

## Structure

```
basic/
├── features/
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

## Learn More

See the [CDAT Pattern documentation](../../README.md) for detailed guides.

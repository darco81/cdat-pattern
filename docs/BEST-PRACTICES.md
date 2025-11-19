# Best Practices

> Guidelines for writing maintainable CDAT tests

## Components Layer

### DO

```typescript
// ✅ Use readonly for locators
readonly submitButton: Locator;

// ✅ Use semantic locators when possible
this.loginButton = page.getByRole('button', { name: 'Sign in' });
this.emailInput = page.getByLabel('Email address');

// ✅ Compose selectors for scoping
readonly form = this.page.locator('[data-testid="checkout-form"]');
readonly emailField = this.form.locator('[data-testid="email"]');

// ✅ Create dynamic selectors as methods
getProductCard(index: number): Locator {
  return this.productCards.nth(index);
}
```

### DON'T

```typescript
// ❌ Don't include logic in components
async clickIfVisible() { ... }

// ❌ Don't use assertions
await expect(this.button).toBeVisible();

// ❌ Don't use waits
await this.button.waitFor();

// ❌ Don't use mutable locators
submitButton: Locator; // Missing readonly
```

---

## Data Layer

### DO

```typescript
// ✅ Define interfaces for all data
export interface UserCredentials {
  username: string;
  password: string;
}

// ✅ Use const assertions for constants
export const URLS = {
  home: '/',
  login: '/login',
} as const;

// ✅ Group related data together
export const VALID_USERS = {
  standard: { username: 'user', password: 'pass' },
  admin: { username: 'admin', password: 'admin123' },
};

// ✅ Use enums for fixed values
export enum PaymentMethod {
  CreditCard = 'credit_card',
  PayPal = 'paypal',
}
```

### DON'T

```typescript
// ❌ Don't use any
export const userData: any = { ... };

// ❌ Don't mix locators with data
export const LOGIN_BUTTON = '[data-testid="login"]'; // This is a selector

// ❌ Don't include logic
export function generateUser() { ... } // Put in utils
```

---

## Actions Layer

### DO

```typescript
// ✅ Use smart waits
await Cdat.waitAndClick(this.components.button);
await Cdat.waitAndFill(this.components.input, value);

// ✅ Create atomic actions
async fillEmail(email: string): Promise<void> {
  await Cdat.waitAndFill(this.components.emailField, email);
}

// ✅ Compose higher-level flows
async completeCheckout(data: CheckoutData): Promise<void> {
  await this.fillContactInfo(data.contact);
  await this.fillShippingAddress(data.shipping);
  await this.fillPaymentInfo(data.payment);
  await this.submit();
}

// ✅ Return data from getters, don't assert
async getErrorMessage(): Promise<string> {
  return Cdat.waitForText(this.components.errorMessage);
}

// ✅ Use early return pattern
async processOrder(data: OrderData): Promise<void> {
  if (!data.items.length) {
    throw new Error('Cart is empty');
  }
  if (!data.payment) {
    throw new Error('Payment method required');
  }
  await this.submitOrder(data);
}
```

### DON'T

```typescript
// ❌ Don't use assertions in actions
async login(user: User): Promise<void> {
  await this.fillCredentials(user);
  await this.submit();
  await expect(this.page).toHaveURL(/dashboard/); // Move to test!
}

// ❌ Don't use waitForTimeout
await this.page.waitForTimeout(5000);

// ❌ Don't use any
async getData(): Promise<any> { ... }

// ❌ Don't use else
if (condition) {
  // ...
} else { // Avoid!
  // ...
}
```

---

## Tests Layer

### DO

```typescript
// ✅ Use descriptive test names
test('TC_001: Given valid credentials, When user logs in, Then dashboard is displayed', ...);

// ✅ Follow Arrange-Act-Assert structure
test('successful login', async ({ page }) => {
  // Arrange
  const actions = new LoginActions(page);
  const credentials = VALID_USER;

  // Act
  await page.goto(LOGIN_URLS.login);
  await actions.login(credentials);

  // Assert
  await expect(page).toHaveURL(/dashboard/);
});

// ✅ Use data from data.ts
await actions.login(VALID_USER);

// ✅ Access components directly for visibility assertions
await expect(components.successMessage).toBeVisible();

// ✅ Use test.beforeEach for setup
test.beforeEach(async ({ page }) => {
  actions = new LoginActions(page);
  await page.goto(LOGIN_URLS.login);
});
```

### DON'T

```typescript
// ❌ Don't put business logic in tests
test('checkout', async ({ page }) => {
  await page.locator('#email').fill('test@example.com');
  await page.locator('#address').fill('123 Main St');
  // ... this belongs in actions!
});

// ❌ Don't hardcode test data
await actions.login({ username: 'test', password: 'pass' }); // Use data.ts

// ❌ Don't use waitForTimeout
await page.waitForTimeout(3000);
```

---

## Naming Conventions

### Files

```
components.ts    # Always lowercase
data.ts
actions.ts
test.ts          # Or feature.test.ts
```

### Classes

```typescript
// PascalCase with descriptive suffix
export class LoginComponents { }
export class LoginActions { }
export class CheckoutComponents { }
export class CheckoutActions { }
```

### Interfaces and Types

```typescript
// PascalCase
export interface UserCredentials { }
export interface CheckoutData { }
export type PaymentMethod = 'card' | 'paypal';
```

### Constants

```typescript
// UPPER_SNAKE_CASE for true constants
export const DEFAULT_TIMEOUT = 5000;
export const MAX_RETRIES = 3;

// PascalCase for object constants
export const ValidUser = { username: 'test', password: 'pass' };
// Or UPPER_SNAKE_CASE
export const VALID_USER = { username: 'test', password: 'pass' };
```

### Methods

```typescript
// camelCase, verb-first for actions
async fillEmail(email: string): Promise<void>
async submitForm(): Promise<void>
async navigateToCheckout(): Promise<void>

// get/is prefix for getters
async getErrorMessage(): Promise<string>
async isLoggedIn(): Promise<boolean>
async hasItems(): Promise<boolean>
```

---

## Project Structure

### Recommended

```
project/
├── features/           # Feature-based organization
│   ├── login/
│   │   ├── components.ts
│   │   ├── data.ts
│   │   ├── actions.ts
│   │   └── test.ts
│   ├── cart/
│   └── checkout/
├── utils/
│   ├── Cdat.ts         # Smart wait utilities
│   └── testData.ts     # Data generators
├── fixtures/           # Playwright fixtures
└── playwright.config.ts
```

### Avoid

```
project/
├── pages/              # ❌ Page-based (classic POM)
│   ├── LoginPage.ts
│   └── CheckoutPage.ts
├── tests/              # ❌ Separate from features
│   ├── login.test.ts
│   └── checkout.test.ts
└── data/               # ❌ Global data folder
    └── users.ts
```

---

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

---

## ESLint Configuration

```javascript
module.exports = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.property.name="waitForTimeout"]',
        message: 'Use Cdat smart waits instead',
      },
    ],
  },
};
```

---

## Code Review Checklist

- [ ] Components contain only locators (no logic)
- [ ] Data has proper TypeScript interfaces
- [ ] Actions don't have `expect()` assertions
- [ ] Tests follow Arrange-Act-Assert structure
- [ ] No `any` types
- [ ] No `waitForTimeout` calls
- [ ] No `else` statements (early return used)
- [ ] Descriptive test names
- [ ] Smart waits used everywhere

---

## Next Steps

- Check [FAQ](./FAQ.md)
- See [Examples](../examples/)

# Frequently Asked Questions

## General

### What does CDAT stand for?

**C**omponents - **D**ata - **A**ctions - **T**ests

The four layers of the pattern, representing a clear separation of concerns.

### How is CDAT different from Page Object Model?

| Aspect | Classic POM | CDAT |
|--------|-------------|------|
| Organization | Per page | Per feature |
| Locators | Mixed with logic | Separate layer (Components) |
| Test data | Often hardcoded | Separate layer (Data) |
| Assertions | Sometimes in PO | Only in Tests |
| Maintainability | God objects grow | Small, focused files |

### Is CDAT a replacement for Playwright's built-in patterns?

No, CDAT complements Playwright. It uses Playwright's locators and test framework while providing a structural pattern for organizing your test code.

### Do I need to use TypeScript?

CDAT is designed for TypeScript. The "Zero `any`" rule and strong typing are core to the pattern. You can use JavaScript, but you'll lose significant benefits.

---

## Architecture

### Why four layers instead of three or five?

Four layers provide the right balance:
- **Components** isolates selector changes
- **Data** prevents hardcoding and enables reuse
- **Actions** encapsulates business logic
- **Tests** keeps assertions clean

Fewer layers lead to mixed concerns. More layers add unnecessary complexity.

### Can Actions import from other Actions?

Yes, for shared functionality across features. But prefer composition within the same feature first.

```typescript
// cart/actions.ts
import { ProductActions } from '../product/actions';

export class CartActions {
  async addProductByName(name: string): Promise<void> {
    const productActions = new ProductActions(this.page);
    await productActions.searchProduct(name);
    await productActions.addToCart();
  }
}
```

### Where do API calls go?

In Actions or dedicated utility classes. They're business logic.

```typescript
// actions.ts
async loginViaApi(credentials: Credentials): Promise<void> {
  await this.page.request.post('/api/login', { data: credentials });
}
```

### Where do fixtures go?

Playwright fixtures go in a separate `fixtures/` directory, not in CDAT layers.

---

## Components Layer

### Should I use data-testid or semantic locators?

Prefer semantic locators (`getByRole`, `getByLabel`) when they're stable. Use `data-testid` for elements without semantic meaning.

```typescript
// ✅ Semantic - preferred
this.loginButton = page.getByRole('button', { name: 'Sign in' });
this.emailInput = page.getByLabel('Email address');

// ✅ data-testid - when semantic isn't enough
this.productCard = page.locator('[data-testid="product-card"]');
```

### Can I have methods in Components?

Only for dynamic selectors that return locators:

```typescript
// ✅ OK - returns locator
getProductCard(index: number): Locator {
  return this.productCards.nth(index);
}

// ❌ Not OK - contains logic
async clickFirstProduct(): Promise<void> {
  await this.productCards.first().click();
}
```

---

## Actions Layer

### Why can't I use expect() in Actions?

Assertions in Actions:
1. Mix responsibilities
2. Make actions less reusable
3. Hide test intent in implementation

Instead, return data and let tests assert:

```typescript
// ❌ BAD
async login(credentials: Credentials): Promise<void> {
  await this.fillForm(credentials);
  await expect(this.page).toHaveURL(/dashboard/);
}

// ✅ GOOD
async login(credentials: Credentials): Promise<void> {
  await this.fillForm(credentials);
}

// In test:
await actions.login(credentials);
await expect(page).toHaveURL(/dashboard/);
```

### How do I handle conditional flows?

Use early returns and check states:

```typescript
async dismissCookieBannerIfPresent(): Promise<void> {
  const isVisible = await Cdat.checkState(
    this.components.cookieBanner,
    LocatorState.Visible,
    1000
  );

  if (!isVisible) {
    return;
  }

  await Cdat.waitAndClick(this.components.acceptCookiesButton);
  await Cdat.waitForHidden(this.components.cookieBanner);
}
```

---

## Data Layer

### Where should I put test data generators?

In `utils/` or within `data.ts` if feature-specific:

```typescript
// data.ts
import { faker } from '@faker-js/faker';

export function generateUser(): UserCredentials {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}
```

### How do I handle environment-specific data?

Use environment variables and conditional exports:

```typescript
// data.ts
const isProduction = process.env.ENV === 'production';

export const BASE_URL = isProduction
  ? 'https://app.example.com'
  : 'https://staging.example.com';

export const TEST_USER = isProduction
  ? { username: 'prod-test', password: process.env.PROD_PASSWORD! }
  : { username: 'test', password: 'test123' };
```

---

## Tests Layer

### Should I put all tests in one file?

One test file per feature is recommended. Split into multiple files if:
- File exceeds 500 lines
- Distinct test categories exist (e.g., `checkout-guest.test.ts`, `checkout-user.test.ts`)

### How do I share setup across tests?

Use `test.beforeEach` within the describe block:

```typescript
test.describe('Login Feature', () => {
  let actions: LoginActions;

  test.beforeEach(async ({ page }) => {
    actions = new LoginActions(page);
    await page.goto('/login');
  });

  test('valid login', async () => {
    await actions.login(VALID_USER);
    // ...
  });
});
```

### Should I use test.describe.serial?

Avoid serial tests when possible. If tests must run in order, consider if they should be one test.

---

## Smart Waits

### When should I use waitForTimeout?

Almost never. Valid cases:
- Waiting for CSS animations (use very short timeout)
- Rate limiting requirements
- Debugging

```typescript
// Only if truly necessary, document why
await page.waitForTimeout(300); // Wait for fade animation
```

### What timeout should I use?

| Scenario | Timeout |
|----------|---------|
| Tooltip, animation | VERY_SHORT (1s) |
| Form validation | SHORT (3s) |
| Form submission | MEDIUM (5s) |
| Page navigation | DEFAULT (10s) |
| File upload | LONG (30s) |

---

## Migration

### Can CDAT coexist with existing POM?

Yes. Migrate feature by feature while old POM continues to work.

### How long does migration take?

- Simple feature: 1-2 hours
- Complex feature: 3-4 hours
- Full project: depends on size

### Should I migrate everything at once?

No. Recommended approach:
1. New features: Use CDAT from start
2. Flaky features: Migrate first
3. High-change areas: Migrate second
4. Stable code: Migrate gradually

---

## Tooling

### Does CDAT work with Playwright UI mode?

Yes. CDAT is just a code organization pattern - all Playwright features work normally.

### Can I use CDAT with component testing?

Yes. The pattern works for component tests too - same layers, different scope.

### Is there a VS Code extension?

Not yet. Use the provided [VS Code snippets](../.vscode/cdat.code-snippets).

---

## Still Have Questions?

- Check the [Examples](../examples/)
- Open an [Issue](https://github.com/dar-kow/cdat-pattern/issues)
- Read the full [Documentation](./ARCHITECTURE.md)

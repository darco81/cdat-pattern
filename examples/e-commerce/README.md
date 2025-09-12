# CDAT E-commerce Example

A comprehensive example demonstrating the CDAT Pattern with multiple e-commerce features.

## Structure

```
e-commerce/
├── features/
│   ├── homepage/            # Homepage feature
│   │   ├── components.ts
│   │   ├── data.ts
│   │   ├── actions.ts
│   │   └── test.ts
│   ├── product/             # Product detail page
│   │   ├── components.ts
│   │   ├── data.ts
│   │   ├── actions.ts
│   │   └── test.ts
│   ├── cart/                # Shopping cart
│   │   ├── components.ts
│   │   ├── data.ts
│   │   ├── actions.ts
│   │   └── test.ts
│   └── checkout/            # Checkout flow
│       ├── components.ts
│       ├── data.ts
│       ├── actions.ts
│       └── test.ts
├── utils/
│   └── Cdat.ts              # Smart wait utilities
├── fixtures/                # Playwright fixtures
├── playwright.config.ts
└── package.json
```

## Quick Start

```bash
npm install
npx playwright install
npm test
```

## Features Demonstrated

### Selector Composition (components.ts)
```typescript
// Base selector
readonly form = this.page.locator('[data-testid="checkout-form"]');

// Composed selectors (scoped to form)
readonly emailField = this.form.locator('[data-testid="email"]');
readonly submitButton = this.form.locator('button[type="submit"]');
```

### Method Composition (actions.ts)
```typescript
// Atomic actions
async fillEmail(email: string) { ... }
async fillAddress(address: Address) { ... }
async submitForm() { ... }

// Composed action (DRY)
async completeCheckoutAsGuest(data: CheckoutData) {
  await this.fillEmail(data.email);
  await this.fillAddress(data.address);
  await this.submitForm();
}
```

### Test Patterns (test.ts)
```typescript
test('TC_CHKOUT_001: Given valid data, When checkout completed, Then success', async () => {
  // Arrange
  const data = VALID_CHECKOUT;

  // Act
  await actions.completeCheckoutAsGuest(data);

  // Assert
  await expect(page).toHaveURL(/confirmation/);
});
```

## Running Specific Features

```bash
# Run only checkout tests
npx playwright test checkout

# Run only on Chrome
npx playwright test --project=chromium

# Run mobile tests
npm run test:mobile
```

## Learn More

See the [CDAT Pattern documentation](../../README.md) for detailed guides.

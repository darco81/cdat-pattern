# The Three Zero Rules

> Principles that make CDAT tests reliable, readable, and maintainable

## Overview

CDAT Pattern enforces three "Zero" rules that eliminate common sources of test failures and technical debt:

1. **Zero `any`** - Strict TypeScript typing
2. **Zero `waitForTimeout`** - Smart waits only
3. **Zero `else`** - Early return pattern

---

## Zero `any`

### The Problem

Using `any` destroys TypeScript's type safety and hides bugs:

```typescript
// ❌ BAD - No type safety
async getProductData(): Promise<any> {
  const data = await this.fetchProduct();
  return data; // What shape is this? Who knows!
}

// Later in test...
const product = await actions.getProductData();
console.log(product.proce); // Typo goes unnoticed!
```

### The Solution

Define explicit interfaces for all data structures:

```typescript
// ✅ GOOD - Full type safety
interface ProductData {
  sku: string;
  name: string;
  price: number;
  inStock: boolean;
}

async getProductData(): Promise<ProductData> {
  const data = await this.fetchProduct();
  return data;
}

// Later in test...
const product = await actions.getProductData();
console.log(product.proce); // TS Error: 'proce' doesn't exist!
```

### Enforcement

Add ESLint rule to your configuration:

```javascript
// eslint.config.js
module.exports = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
```

### Common Patterns

```typescript
// For API responses
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// For function parameters
interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// For state returns
type LocatorState = 'visible' | 'hidden' | 'attached' | 'detached';
```

---

## Zero `waitForTimeout`

### The Problem

Hardcoded timeouts are the #1 cause of flaky tests:

```typescript
// ❌ BAD - Flaky and slow
await page.waitForTimeout(5000);
await button.click();

// Problems:
// 1. Too short? Test fails randomly
// 2. Too long? Tests are slow
// 3. Works locally but fails in CI
```

### The Solution

Use smart waits that wait for actual conditions:

```typescript
// ✅ GOOD - Smart wait
await Cdat.waitAndClick(button);

// Or with Playwright's built-in
await button.waitFor({ state: 'visible' });
await button.click();
```

### The Cdat Utility Class

CDAT provides utility methods that combine waiting with actions:

```typescript
import { Cdat, LocatorState } from './utils/Cdat';

// Wait for visible + click
await Cdat.waitAndClick(submitButton);

// Wait + fill + verify
await Cdat.waitAndFill(emailInput, 'user@example.com');

// Wait for specific state
await Cdat.waitForState(loader, LocatorState.Hidden);

// Non-throwing state check
if (await Cdat.checkState(errorMessage, LocatorState.Visible)) {
  // Handle error case
}

// Wait for text content
const price = await Cdat.waitForText(priceLabel);
```

### Timeout Constants

Use semantic timeout constants:

```typescript
class Cdat {
  static readonly VERY_SHORT_TIMEOUT = 1000;  // Animations, tooltips
  static readonly SHORT_TIMEOUT = 3000;       // Quick state changes
  static readonly MEDIUM_TIMEOUT = 5000;      // Standard operations
  static readonly DEFAULT_TIMEOUT = 10000;    // Most operations
  static readonly LONG_TIMEOUT = 30000;       // File uploads, API calls
}

// Usage
await Cdat.waitAndClick(button, Cdat.LONG_TIMEOUT);
```

### When `waitForTimeout` Might Be Acceptable

In rare cases (animations, rate limiting), use a very short delay:

```typescript
// Only if absolutely necessary, and document why
await page.waitForTimeout(300); // Wait for CSS animation
```

---

## Zero `else`

### The Problem

Nested if-else creates "pyramid of doom" code:

```typescript
// ❌ BAD - Unreadable pyramid
async processCheckout(data: CheckoutData): Promise<boolean> {
  if (data.email) {
    if (data.address) {
      if (data.payment) {
        if (data.payment.cardNumber.length === 16) {
          await this.submitOrder();
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
```

### The Solution

Use early return pattern - check failures first, then proceed:

```typescript
// ✅ GOOD - Flat, readable, debuggable
async processCheckout(data: CheckoutData): Promise<void> {
  if (!data.email) {
    throw new Error('Email is required for checkout');
  }

  if (!data.address) {
    throw new Error('Shipping address is required');
  }

  if (!data.payment) {
    throw new Error('Payment method is required');
  }

  if (data.payment.cardNumber.length !== 16) {
    throw new Error('Invalid card number length');
  }

  // Happy path - flat, clear, easy to follow
  await this.submitOrder();
}
```

### Benefits

1. **Readability** - Linear flow, easy to follow
2. **Debugging** - Clear error messages at each failure point
3. **Maintenance** - Easy to add new validation rules
4. **Testing** - Each condition can be tested independently

### Common Patterns

```typescript
// Pattern 1: Guard clauses with throws
async login(credentials: Credentials): Promise<void> {
  if (!credentials.username) {
    throw new Error('Username is required');
  }
  if (!credentials.password) {
    throw new Error('Password is required');
  }

  await this.performLogin(credentials);
}

// Pattern 2: Early returns for optional behavior
async getProductPrice(productId: string): Promise<number> {
  const product = await this.fetchProduct(productId);

  if (!product) {
    return 0;
  }

  if (product.onSale) {
    return product.salePrice;
  }

  return product.regularPrice;
}

// Pattern 3: Ternary for simple conditions (still no else)
const status = isAvailable ? 'In Stock' : 'Out of Stock';
```

---

## Summary

| Rule | Bad | Good |
|------|-----|------|
| Zero `any` | `Promise<any>` | `Promise<ProductData>` |
| Zero `waitForTimeout` | `waitForTimeout(5000)` | `Cdat.waitAndClick()` |
| Zero `else` | `if-else pyramid` | Early returns |

---

## ESLint Configuration

Enforce all three rules:

```javascript
// eslint.config.js
module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Zero any
    '@typescript-eslint/no-explicit-any': 'error',

    // Zero else (custom rule or manual review)
    // Consider using sonarjs/no-else-after-return

    // Zero waitForTimeout (custom rule)
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.property.name="waitForTimeout"]',
        message: 'Use Cdat smart waits instead of waitForTimeout',
      },
    ],
  },
};
```

---

## Next Steps

- Learn about [Composition Patterns](./COMPOSITION.md)
- Explore the [Cdat Utility Class](./SMART-WAITS.md)
- See rules in action in [Examples](../examples/)

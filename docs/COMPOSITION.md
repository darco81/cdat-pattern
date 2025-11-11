# Composition Patterns

> Build complex test flows from simple, reusable building blocks

## Overview

Composition is a core principle in CDAT Pattern. Instead of duplicating code, we compose:

1. **Selector Composition** - Build complex locators from simpler ones
2. **Method Composition** - Build complex actions from atomic operations

---

## Selector Composition

### The Problem

Without composition, you repeat parent selectors:

```typescript
// ❌ BAD - Repetitive, error-prone
readonly checkoutFormEmail = page.locator('[data-testid="checkout-form"] [data-testid="email"]');
readonly checkoutFormAddress = page.locator('[data-testid="checkout-form"] [data-testid="address"]');
readonly checkoutFormSubmit = page.locator('[data-testid="checkout-form"] button[type="submit"]');
```

### The Solution

Compose selectors hierarchically:

```typescript
// ✅ GOOD - DRY, maintainable
export class CheckoutComponents {
  // Base selector (single source of truth)
  readonly form = this.page.locator('[data-testid="checkout-form"]');

  // Composed selectors (scoped to form)
  readonly emailField = this.form.locator('[data-testid="email"]');
  readonly addressField = this.form.locator('[data-testid="address"]');
  readonly submitButton = this.form.locator('button[type="submit"]');

  // Flow selectors (related to user journey)
  readonly successMessage = this.page.locator('[data-testid="success"]');
  readonly errorMessage = this.page.locator('[data-testid="error"]');

  constructor(private readonly page: Page) {}
}
```

### Benefits

- **DRY** - Parent selector defined once
- **Maintainable** - Change parent selector in one place
- **Scoped** - Child selectors automatically scoped to parent
- **Readable** - Clear hierarchy in code

### Advanced Patterns

```typescript
export class ProductListComponents {
  // Collection selector
  readonly productCards = this.page.locator('[data-testid="product-card"]');

  // Composed from collection
  readonly productNames = this.productCards.locator('[data-testid="name"]');
  readonly productPrices = this.productCards.locator('[data-testid="price"]');
  readonly addToCartButtons = this.productCards.getByRole('button', { name: /add/i });

  // Dynamic composed selector
  getProductCard(index: number): Locator {
    return this.productCards.nth(index);
  }

  // Semantic composed selector
  getProductByName(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }

  constructor(private readonly page: Page) {}
}
```

---

## Method Composition

### The Principle

Build complex flows from simple, single-responsibility actions:

```
Atomic Action + Atomic Action + ... = Composed Action
```

### Atomic Actions

Each atomic action does **one thing**:

```typescript
export class CheckoutActions {
  // ─────────────────────────────────────────────────
  // ATOMIC ACTIONS (Single Responsibility)
  // ─────────────────────────────────────────────────

  async fillEmail(email: string): Promise<void> {
    await Cdat.waitAndFill(this.components.emailField, email);
  }

  async fillFirstName(firstName: string): Promise<void> {
    await Cdat.waitAndFill(this.components.firstNameField, firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await Cdat.waitAndFill(this.components.lastNameField, lastName);
  }

  async fillAddress(address: string): Promise<void> {
    await Cdat.waitAndFill(this.components.addressField, address);
  }

  async fillCity(city: string): Promise<void> {
    await Cdat.waitAndFill(this.components.cityField, city);
  }

  async selectCountry(country: string): Promise<void> {
    await Cdat.waitAndSelect(this.components.countryField, country);
  }

  async submitForm(): Promise<void> {
    await Cdat.waitAndClick(this.components.submitButton);
  }
}
```

### Composed Actions

Combine atomic actions into reusable flows:

```typescript
export class CheckoutActions {
  // ... atomic actions above ...

  // ─────────────────────────────────────────────────
  // COMPOSED ACTIONS (Reusable Flows)
  // ─────────────────────────────────────────────────

  /**
   * Fill contact information section
   */
  async fillContactInfo(contact: ContactInfo): Promise<void> {
    await this.fillEmail(contact.email);
    await this.fillPhone(contact.phone);
  }

  /**
   * Fill shipping address section
   */
  async fillShippingAddress(address: ShippingAddress): Promise<void> {
    await this.fillFirstName(address.firstName);
    await this.fillLastName(address.lastName);
    await this.fillAddress(address.street);
    await this.fillCity(address.city);
    await this.selectCountry(address.country);
  }

  /**
   * Fill payment information section
   */
  async fillPaymentInfo(payment: PaymentInfo): Promise<void> {
    await this.fillCardNumber(payment.cardNumber);
    await this.fillCardExpiry(payment.expiry);
    await this.fillCardCvc(payment.cvc);
  }

  // ─────────────────────────────────────────────────
  // HIGH-LEVEL FLOWS (Business Scenarios)
  // ─────────────────────────────────────────────────

  /**
   * Complete checkout as guest user
   * Composes: contact + shipping + payment + submit
   */
  async completeCheckoutAsGuest(data: GuestCheckoutData): Promise<void> {
    await this.fillContactInfo(data.contact);
    await this.fillShippingAddress(data.shipping);
    await this.fillPaymentInfo(data.payment);
    await this.submitForm();
  }

  /**
   * Complete checkout as logged-in user
   * Skips contact info (pre-filled), composes: shipping + payment + submit
   */
  async completeCheckoutAsUser(data: UserCheckoutData): Promise<void> {
    // Contact info is pre-filled for logged-in users
    await this.fillShippingAddress(data.shipping);
    await this.fillPaymentInfo(data.payment);
    await this.submitForm();
  }

  /**
   * Complete checkout with saved address
   * Composes: just payment + submit
   */
  async completeCheckoutWithSavedAddress(payment: PaymentInfo): Promise<void> {
    // Address is already selected
    await this.fillPaymentInfo(payment);
    await this.submitForm();
  }
}
```

### Usage in Tests

```typescript
test('Guest checkout', async () => {
  // Use high-level composed action
  await actions.completeCheckoutAsGuest(GUEST_CHECKOUT_DATA);
  await expect(page).toHaveURL(/confirmation/);
});

test('Checkout with saved address', async () => {
  // Use simpler composed action
  await actions.completeCheckoutWithSavedAddress(PAYMENT_DATA);
  await expect(page).toHaveURL(/confirmation/);
});

test('Validation error on email', async () => {
  // Use atomic action for specific test
  await actions.fillEmail('invalid-email');
  await actions.submitForm();

  const error = await actions.getFieldError('email');
  expect(error).toContain('valid email');
});
```

---

## Composition Hierarchy

```
┌────────────────────────────────────────────────┐
│          High-Level Flows                       │
│  completeCheckoutAsGuest()                      │
│  completeCheckoutAsUser()                       │
└────────────────────┬───────────────────────────┘
                     │ composed of
                     ▼
┌────────────────────────────────────────────────┐
│          Section Flows                          │
│  fillContactInfo()                              │
│  fillShippingAddress()                          │
│  fillPaymentInfo()                              │
└────────────────────┬───────────────────────────┘
                     │ composed of
                     ▼
┌────────────────────────────────────────────────┐
│          Atomic Actions                         │
│  fillEmail()                                    │
│  fillFirstName()                                │
│  fillCardNumber()                               │
│  submitForm()                                   │
└────────────────────────────────────────────────┘
```

---

## Best Practices

### 1. Single Responsibility

Each atomic action does **one thing**:

```typescript
// ✅ GOOD - Single responsibility
async fillEmail(email: string): Promise<void> {
  await Cdat.waitAndFill(this.components.emailField, email);
}

// ❌ BAD - Multiple responsibilities
async fillEmailAndValidate(email: string): Promise<boolean> {
  await Cdat.waitAndFill(this.components.emailField, email);
  await this.submitForm();
  return await this.checkNoErrors();
}
```

### 2. Meaningful Names

Name composed actions after **user intent**:

```typescript
// ✅ GOOD - Describes user action
async completeCheckoutAsGuest(data) { ... }
async addProductToWishlist(productId) { ... }
async applyDiscountCode(code) { ... }

// ❌ BAD - Technical description
async fillAllFieldsAndSubmit(data) { ... }
async clickButtonAndWait(button) { ... }
```

### 3. Appropriate Granularity

Don't over-compose or under-compose:

```typescript
// ❌ TOO GRANULAR - Every keystroke is an action
async typeFirstCharacterOfEmail(char: string) { ... }

// ❌ TOO COARSE - Too many steps in one action
async doEverything() {
  await this.login();
  await this.addToCart();
  await this.checkout();
  await this.logout();
}

// ✅ JUST RIGHT - Meaningful business operations
async login(credentials) { ... }
async addProductToCart(product, quantity) { ... }
async completeCheckout(checkoutData) { ... }
```

---

## Summary

| Pattern | Level | Example |
|---------|-------|---------|
| Selector Composition | Components | `form.locator('[data-testid="email"]')` |
| Atomic Actions | Actions | `fillEmail(email)` |
| Section Flows | Actions | `fillContactInfo(contact)` |
| High-Level Flows | Actions | `completeCheckoutAsGuest(data)` |

---

## Next Steps

- See composition in action: [E-commerce Example](../examples/e-commerce/)
- Learn about [Smart Waits](./SMART-WAITS.md)
- Read [Best Practices](./BEST-PRACTICES.md)

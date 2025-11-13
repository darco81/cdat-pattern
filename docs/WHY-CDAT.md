# Why CDAT Pattern?

> A modern alternative to Page Object Model for Playwright E2E tests

## The Problem with Classic POM

Page Object Model (POM) has been the de facto standard for test automation for over a decade. However, as projects grow, classic POM shows significant weaknesses:

### 1. God Objects

Page Objects often become bloated classes containing hundreds of locators and methods:

```typescript
// ❌ Classic POM - becomes unmanageable
class CheckoutPage {
  // 50+ locators
  // 30+ methods
  // Mixed responsibilities
  // 1000+ lines of code
}
```

### 2. Mixed Responsibilities

POM classes often mix locators, business logic, assertions, and test data:

```typescript
// ❌ Where does the assertion belong?
class LoginPage {
  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
    await expect(this.dashboard).toBeVisible(); // Assertion in page object?
  }
}
```

### 3. Poor Reusability

When logic is embedded in page objects, it's hard to reuse across different test scenarios:

```typescript
// ❌ Hard to reuse partial flows
class CheckoutPage {
  async completeCheckout(data) {
    // All or nothing - can't reuse just the payment part
  }
}
```

### 4. Maintenance Nightmare

When selectors change, you often need to update multiple places. When logic changes, tests break in unexpected ways.

---

## The Problem with Screenplay Pattern

Screenplay Pattern addresses POM's issues but introduces new problems:

### 1. Excessive Complexity

```typescript
// ❌ Screenplay - too many abstractions
const actor = Actor.named('User');
actor.attemptsTo(
  Navigate.to(LoginPage),
  Enter.theValue('user').into(UsernameField),
  Enter.theValue('pass').into(PasswordField),
  Click.on(SubmitButton),
  Wait.until(Dashboard, isVisible())
);
```

### 2. Steep Learning Curve

- 5+ layers of abstraction (Actors, Abilities, Tasks, Questions, Interactions)
- Requires significant team training
- Overkill for most projects

### 3. Boilerplate Heavy

Every action needs its own class. Simple tests become verbose ceremonies.

---

## Enter CDAT Pattern

CDAT (Components-Data-Actions-Tests) provides a **balanced approach**:

- **Simpler than Screenplay** - only 4 layers
- **More structured than POM** - clear separation of concerns
- **Production-proven** - tested in 9 real-world implementations

### The 4 Layers

```
┌─────────────────┐     ┌─────────────────┐
│   Components    │     │      Data       │
│   (Locators)    │     │  (Test Data)    │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
         ┌─────────────────────┐
         │       Actions       │
         │  (Business Logic)   │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │        Tests        │
         │    (Scenarios)      │
         └─────────────────────┘
```

### Clear Separation

| Layer | Contains | Does NOT Contain |
|-------|----------|------------------|
| **C**omponents | Locators, selectors | Logic, assertions |
| **D**ata | Types, constants, test data | Logic, locators |
| **A**ctions | Business logic, interactions | `expect()` assertions |
| **T**ests | Test scenarios, assertions | Business logic |

---

## Why Now?

### Playwright Dominance

Playwright has become the standard for E2E testing. It needs a modern architecture pattern.

### TypeScript First

CDAT leverages TypeScript's type system with strict typing (zero `any`).

### Smart Waits

CDAT eliminates flaky tests by replacing hardcoded `waitForTimeout` with intelligent waiting methods.

### Flatter Learning Curve

Unlike Screenplay, CDAT can be learned in a day. New team members become productive quickly.

---

## Who Is CDAT For?

- **QA Engineers** looking for structure in their test projects
- **SDETs** building test frameworks from scratch
- **Developers** writing E2E tests alongside their code
- **Teams** migrating from Selenium or Cypress
- **Anyone** tired of maintaining bloated page objects

---

## Next Steps

- Read the [Architecture Guide](./ARCHITECTURE.md)
- Learn the [Three Zero Rules](./ZERO-RULES.md)
- Try the [Basic Example](../examples/basic/)

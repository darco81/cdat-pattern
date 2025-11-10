# Smart Waits (Cdat Utility)

> Eliminate flaky tests with intelligent waiting strategies

## Overview

The `Cdat` utility class provides smart waiting methods that replace unreliable hardcoded timeouts. Every method waits for the element to be in the correct state before performing the action.

## Installation

If using the NPM package:

```bash
npm install @cdat/utils
```

Or copy the utility from `packages/cdat-utils/src/` into your project.

## Basic Usage

```typescript
import { Cdat, LocatorState } from '@cdat/utils';

// Instead of flaky:
await page.waitForTimeout(5000);
await button.click();

// Use smart wait:
await Cdat.waitAndClick(button);
```

---

## Timeout Constants

```typescript
class Cdat {
  static readonly VERY_SHORT_TIMEOUT = 1000;  // 1s - animations, tooltips
  static readonly SHORT_TIMEOUT = 3000;       // 3s - quick state changes
  static readonly MEDIUM_TIMEOUT = 5000;      // 5s - standard operations
  static readonly DEFAULT_TIMEOUT = 10000;    // 10s - most operations
  static readonly LONG_TIMEOUT = 30000;       // 30s - uploads, heavy API
}
```

### Using Timeouts

```typescript
// Use default timeout
await Cdat.waitAndClick(button);

// Override for slow operations
await Cdat.waitAndClick(uploadButton, Cdat.LONG_TIMEOUT);

// Override for fast operations
await Cdat.checkState(tooltip, LocatorState.Visible, Cdat.VERY_SHORT_TIMEOUT);
```

---

## Core Methods

### waitForState

Wait for element to reach a specific state.

```typescript
await Cdat.waitForState(
  locator: Locator,
  state: LocatorState,
  timeout?: number
): Promise<void>
```

**Example:**

```typescript
// Wait for loader to disappear
await Cdat.waitForState(loader, LocatorState.Hidden);

// Wait for element to appear
await Cdat.waitForState(successMessage, LocatorState.Visible);
```

### checkState

Non-throwing state check. Returns boolean instead of throwing.

```typescript
await Cdat.checkState(
  locator: Locator,
  state: LocatorState,
  timeout?: number
): Promise<boolean>
```

**Example:**

```typescript
// Conditional logic based on state
if (await Cdat.checkState(errorMessage, LocatorState.Visible)) {
  const error = await Cdat.waitForText(errorMessage);
  console.log('Error:', error);
}

// Check if element exists without failing
const isLoggedIn = await Cdat.checkState(userMenu, LocatorState.Visible);
```

---

## Interaction Methods

### waitAndClick

Wait for visible, then click.

```typescript
await Cdat.waitAndClick(button);
await Cdat.waitAndClick(link, Cdat.LONG_TIMEOUT);
```

### waitAndFill

Wait for visible, fill value, verify input.

```typescript
await Cdat.waitAndFill(emailInput, 'user@example.com');
```

**Features:**
- Waits for element to be visible
- Clears existing value
- Fills new value
- Blurs field (triggers validation)
- Verifies value was entered correctly

### waitAndClear

Wait and clear input value.

```typescript
await Cdat.waitAndClear(searchInput);
```

### waitAndType

Type character by character (for special input handling).

```typescript
await Cdat.waitAndType(autocomplete, 'search term');
```

### waitAndSelect

Wait and select dropdown option.

```typescript
await Cdat.waitAndSelect(countryDropdown, 'United States');
```

### waitAndCheck / waitAndUncheck

Wait and toggle checkbox/radio.

```typescript
await Cdat.waitAndCheck(termsCheckbox);
await Cdat.waitAndUncheck(newsletterCheckbox);
```

---

## Text Retrieval Methods

### waitForText

Wait and get text content.

```typescript
const price = await Cdat.waitForText(priceLabel);
const message = await Cdat.waitForText(notification);
```

### waitForInnerText

Wait and get visible text only.

```typescript
const visibleText = await Cdat.waitForInnerText(element);
```

### waitForInputValue

Wait and get input value.

```typescript
const currentEmail = await Cdat.waitForInputValue(emailInput);
```

---

## Count Methods

### waitForMinimumCount

Wait for at least N elements.

```typescript
// Wait for at least 3 products to load
const hasProducts = await Cdat.waitForMinimumCount(productCards, 3);
```

### waitForExactCount

Wait for exactly N elements.

```typescript
// Wait for exactly 5 items in cart
const correctCount = await Cdat.waitForExactCount(cartItems, 5);
```

---

## Navigation Methods

### waitForUrlContains

Wait for URL to contain string.

```typescript
await Cdat.waitForUrlContains(page, '/dashboard');
await Cdat.waitForUrlContains(page, '/order-confirmation');
```

### waitForNavigation

Wait for navigation after action.

```typescript
await Cdat.waitForNavigation(page, async () => {
  await Cdat.waitAndClick(submitButton);
});
```

---

## Visibility Helpers

### waitForHidden

Wait for element to become hidden.

```typescript
await Cdat.waitForHidden(loadingSpinner);
```

### waitForLoaderToDisappear

Smart loader handling (checks if visible first).

```typescript
// Only waits if loader is actually present
await Cdat.waitForLoaderToDisappear(spinner);
```

---

## LocatorState Enum

```typescript
enum LocatorState {
  Attached = 'attached',  // Element in DOM
  Detached = 'detached',  // Element removed from DOM
  Visible = 'visible',    // Element visible on screen
  Hidden = 'hidden',      // Element hidden (display:none, etc.)
}
```

---

## Common Patterns

### Form Submission

```typescript
async submitForm(): Promise<void> {
  await Cdat.waitAndClick(this.components.submitButton);
  await Cdat.waitForLoaderToDisappear(this.components.spinner);
}
```

### Error Handling

```typescript
async getErrorMessage(): Promise<string> {
  const hasError = await Cdat.checkState(
    this.components.errorMessage,
    LocatorState.Visible
  );

  if (!hasError) {
    return '';
  }

  return Cdat.waitForText(this.components.errorMessage);
}
```

### Dynamic Content

```typescript
async waitForProductsToLoad(): Promise<void> {
  await Cdat.waitForLoaderToDisappear(this.components.loader);
  await Cdat.waitForMinimumCount(this.components.productCards, 1);
}
```

### Conditional Actions

```typescript
async dismissPopupIfPresent(): Promise<void> {
  const hasPopup = await Cdat.checkState(
    this.components.popup,
    LocatorState.Visible,
    Cdat.SHORT_TIMEOUT
  );

  if (hasPopup) {
    await Cdat.waitAndClick(this.components.closePopupButton);
    await Cdat.waitForHidden(this.components.popup);
  }
}
```

---

## Best Practices

1. **Use semantic timeouts** - Choose timeout constant based on operation type
2. **Verify inputs** - `waitAndFill` automatically verifies, use it
3. **Handle loaders** - Always wait for loaders to disappear before assertions
4. **Check before assert** - Use `checkState` for optional elements
5. **Compose waits** - Build complex waits from simple ones

---

## Migration from waitForTimeout

| Before (Flaky) | After (Stable) |
|----------------|----------------|
| `waitForTimeout(5000); button.click()` | `Cdat.waitAndClick(button)` |
| `waitForTimeout(3000); input.fill(v)` | `Cdat.waitAndFill(input, v)` |
| `waitForTimeout(2000); return el.textContent()` | `Cdat.waitForText(el)` |
| `waitForTimeout(1000); if (el.isVisible())` | `Cdat.checkState(el, Visible)` |

---

## Next Steps

- See [Best Practices](./BEST-PRACTICES.md)
- Read [Migration Guide](./MIGRATION-GUIDE.md)
- Check the [FAQ](./FAQ.md)

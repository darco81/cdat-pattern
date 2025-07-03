# @cdat/utils

Smart wait utilities for [CDAT Pattern](https://github.com/dar-kow/cdat-pattern) - a modern alternative to Page Object Model for Playwright E2E tests.

## Installation

```bash
npm install @cdat/utils
```

## Quick Start

```typescript
import { Cdat, LocatorState } from '@cdat/utils';

// Instead of flaky hardcoded waits:
// await page.waitForTimeout(5000);
// await button.click();

// Use smart waits:
await Cdat.waitAndClick(button);
await Cdat.waitAndFill(emailInput, 'user@example.com');
await Cdat.waitForState(loader, LocatorState.Hidden);
```

## API Reference

### Core Methods

| Method | Description |
|--------|-------------|
| `waitAndClick(locator, timeout?)` | Wait for visible + click |
| `waitAndFill(locator, value, timeout?)` | Wait + fill + verify |
| `waitForState(locator, state, timeout?)` | Wait for specific state |
| `checkState(locator, state, timeout?)` | Non-throwing state check |
| `waitForText(locator, timeout?)` | Wait + get text content |
| `waitForMinimumCount(locator, count, timeout?)` | Wait for element count |

### Timeout Constants

```typescript
Cdat.VERY_SHORT_TIMEOUT  // 1000ms
Cdat.SHORT_TIMEOUT       // 3000ms
Cdat.MEDIUM_TIMEOUT      // 5000ms (default)
Cdat.DEFAULT_TIMEOUT     // 10000ms
Cdat.LONG_TIMEOUT        // 30000ms
```

### LocatorState Enum

```typescript
enum LocatorState {
  Attached = 'attached',
  Detached = 'detached',
  Visible = 'visible',
  Hidden = 'hidden',
}
```

## Zero waitForTimeout Principle

This package implements the "Zero `waitForTimeout`" principle from CDAT Pattern:

```typescript
// ❌ BAD - flaky and slow
await page.waitForTimeout(5000);
await button.click();

// ✅ GOOD - smart wait
await Cdat.waitAndClick(button);
```

## License

MIT

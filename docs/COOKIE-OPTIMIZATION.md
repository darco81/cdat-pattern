# Cookie Consent Optimization

CDAT Pattern includes smart cookie consent handling that can save **60-80% of test execution time**.

## The Problem

Every test that navigates to a new page might trigger a cookie consent banner. Clicking it adds:
- 2-5 seconds per test
- Flaky behavior if banner doesn't appear
- Wasted time on repeated consent

## The Solution

CDAT's global setup:
1. Accepts cookies **once** before all tests
2. Saves browser state to `.auth/cookies-accepted.json`
3. Reuses saved state for **24 hours**
4. Automatically refreshes when stale

## Quick Start

### 1. Add to playwright.config.ts

```typescript
import { cookieConsentSetup } from '@cdat/utils';
import { existsSync } from 'fs';
import path from 'path';

const cookieStateFile = path.join(__dirname, '.auth', 'cookies-accepted.json');

export default defineConfig({
  globalSetup: require.resolve('@cdat/utils/cookie-consent'),

  use: {
    // Load cached cookie state if available
    storageState: existsSync(cookieStateFile) ? cookieStateFile : undefined,
  },
});
```

### 2. Add .auth to .gitignore

```gitignore
# Cookie consent cache
.auth/
```

### 3. Run tests

First run will accept cookies and cache them:
```
[Cookie Consent] No cached cookies found, accepting...
[Cookie Consent] Found banner: #CybotCookiebotDialog
[Cookie Consent] Clicking: button:has-text("Accept all")
[Cookie Consent] ✅ Cookies accepted successfully
[Cookie Consent] 💾 State saved to .auth/cookies-accepted.json
```

Subsequent runs (within 24h):
```
[Cookie Consent] Using cached cookies (3h old, valid for 21h more)
```

## Custom Cookie Banners

If your application uses a custom cookie banner, add selectors:

```typescript
// In your test setup
import { COOKIE_BANNER_SELECTORS, ACCEPT_BUTTON_SELECTORS } from '@cdat/utils';

// Add your custom selectors
COOKIE_BANNER_SELECTORS.push('#my-custom-cookie-banner');
ACCEPT_BUTTON_SELECTORS.push('button.my-accept-button');
```

## Supported Cookie Banners

Out of the box, CDAT supports:
- Cookiebot (`#CybotCookiebotDialog`)
- OneTrust (`#onetrust-consent-sdk`)
- Cookie Consent (`#cookie-banner`, `.cookie-consent`)
- Generic patterns (`[class*="cookie"]`)

## Environment Behavior

| Environment | Cookie Handling |
|-------------|-----------------|
| `local` | Skipped (usually no banners) |
| `stage` | Active (24h cache) |
| `prod` | Active (24h cache) |

## Troubleshooting

### Banner not detected
Add custom selectors or increase wait time in your fork.

### Cookies not persisting
Check that `.auth/` directory is writable.

### Cache not refreshing
Delete `.auth/cookies-accepted.json` to force refresh.
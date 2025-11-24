# Environment Management

CDAT Pattern provides a universal environment loader for managing multiple environments (local, dev, stage, prod).

## Quick Start

### 1. Create environment files

```bash
# Copy the example file
cp .env.example .env.local
cp .env.example .env.stage
cp .env.example .env.prod
```

### 2. Configure each environment

**.env.local**
```env
NODE_ENV=local
BASE_URL=http://localhost:3000
TEST_HEADLESS=false
TEST_USER_EMAIL=dev@example.com
TEST_USER_PASSWORD=devpassword
```

**.env.stage**
```env
NODE_ENV=stage
BASE_URL=https://stage.example.com
TEST_HEADLESS=true
CF_ACCESS_CLIENT_ID=your-client-id
CF_ACCESS_CLIENT_SECRET=your-client-secret
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword
```

### 3. Use in playwright.config.ts

```typescript
import { Environment } from '@cdat/utils';

export default defineConfig({
  use: {
    baseURL: Environment.baseURL,
    actionTimeout: Environment.testConfig.actionTimeout,

    // CloudFlare headers (automatically added if configured)
    ...(Environment.cloudflare && {
      extraHTTPHeaders: {
        'CF-Access-Client-Id': Environment.cloudflare.clientId,
        'CF-Access-Client-Secret': Environment.cloudflare.clientSecret,
      },
    }),
  },
});
```

### 4. Run tests on different environments

```bash
# Local (default)
npx playwright test

# Staging
NODE_ENV=stage npx playwright test

# Production
NODE_ENV=prod npx playwright test
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment name | `local` |
| `BASE_URL` | Application base URL | `http://localhost:3000` |
| `API_URL` | API base URL (optional) | - |
| `API_TIMEOUT` | API timeout in ms | `10000` |
| `CF_ACCESS_CLIENT_ID` | CloudFlare Access ID | - |
| `CF_ACCESS_CLIENT_SECRET` | CloudFlare Access Secret | - |
| `TEST_HEADLESS` | Run in headless mode | `true` |
| `TEST_SLOW_MO` | Slow down actions (ms) | `0` |
| `ACTION_TIMEOUT` | Default action timeout | env-aware |
| `SCREENSHOT_ON_FAILURE` | Take screenshots on failure | `false` |
| `VIDEO_ON_FAILURE` | Record video on failure | `false` |
| `TEST_USER_EMAIL` | Test user email | - |
| `TEST_USER_PASSWORD` | Test user password | - |
| `TEST_USER_NAME` | Test user display name | `Test User` |

## Environment-Aware Timeouts

Timeouts are automatically adjusted based on environment:

| Environment | Default Timeout |
|-------------|-----------------|
| `local` | 10000ms |
| `stage` | 8000ms |
| `prod` | 5000ms |

## CloudFlare Access

For protected staging environments behind CloudFlare Access:

1. Get Service Token credentials from CloudFlare dashboard
2. Add to `.env.stage`:
   ```env
   CF_ACCESS_CLIENT_ID=your-client-id.access
   CF_ACCESS_CLIENT_SECRET=your-client-secret
   ```
3. Headers are automatically added to all requests

## Multiple Test Users

For parallel test execution, configure multiple users:

```env
TEST_USER_EMAIL=user1@example.com
TEST_USER_PASSWORD=password1

TEST_USER_2_EMAIL=user2@example.com
TEST_USER_2_PASSWORD=password2

TEST_USER_3_EMAIL=user3@example.com
TEST_USER_3_PASSWORD=password3
```

Access in tests via `Environment.testUsers` array.
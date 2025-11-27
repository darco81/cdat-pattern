# Advanced Authentication Patterns

> ⚠️ **Advanced Topic** - These patterns are for complex scenarios.
> Start with basic cookie consent and environment management first.

## When to Use Advanced Patterns

| Pattern | Use When |
|---------|----------|
| Token Manager | API-based auth, long-running tokens |
| Multi-Credential Pool | Parallel workers, data isolation |
| Worker Rotation | High parallelism, credential limits |

## Pattern 1: Token Manager (72h Caching)

For applications with API-based authentication:

```typescript
// utils/token-manager.ts
interface CachedToken {
  token: string;
  email: string;
  role?: string;
  createdAt: number;
}

class TokenManager {
  private static instance: TokenManager;
  private tokens: Map<string, CachedToken> = new Map();
  private readonly MAX_TOKEN_AGE_MS = 72 * 60 * 60 * 1000; // 72 hours

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  getToken(email: string): string | null {
    const cached = this.tokens.get(email);

    if (!cached) {
      return null;
    }

    const age = Date.now() - cached.createdAt;
    if (age > this.MAX_TOKEN_AGE_MS) {
      this.tokens.delete(email);
      return null;
    }

    return cached.token;
  }

  setToken(email: string, token: string, role?: string): void {
    this.tokens.set(email, {
      token,
      email,
      role,
      createdAt: Date.now(),
    });
  }
}

export const tokenManager = TokenManager.getInstance();
```

## Pattern 2: Multi-Credential Pool

For parallel test execution with data isolation:

```env
# .env.stage
TEST_USER_EMAIL=user1@example.com
TEST_USER_PASSWORD=password1

TEST_USER_2_EMAIL=user2@example.com
TEST_USER_2_PASSWORD=password2

TEST_USER_3_EMAIL=user3@example.com
TEST_USER_3_PASSWORD=password3

TEST_USER_4_EMAIL=user4@example.com
TEST_USER_4_PASSWORD=password4
```

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';
import { Environment } from '@cdat/utils';

export const test = base.extend({
  userCredentials: [
    async ({}, use, workerInfo) => {
      const users = Environment.testUsers || [Environment.testUser];
      const userIndex = workerInfo.workerIndex % users.length;

      console.log(`[Worker ${workerInfo.workerIndex}] Using: ${users[userIndex].email}`);
      await use(users[userIndex]);
    },
    { scope: 'worker' }
  ],
});
```

## Pattern 3: Pre-Authenticated Fixtures

For tests that need already-logged-in state:

```typescript
// fixtures.ts
export const test = base.extend({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: './auth/user-session.json',
    });
    const page = await context.newPage();

    await use(page);

    await context.close();
  },
});
```

## Decision Matrix

| Scenario | Recommended Pattern |
|----------|---------------------|
| Simple app, single user | Basic cookie consent only |
| Multiple environments | Environment loader + cookies |
| Parallel tests, same data | Multi-credential pool |
| API-heavy app | Token Manager |
| Long test suites | Token Manager + 72h cache |
| CI/CD with workers | Worker rotation |

## Implementation Notes

1. **Start simple** - Basic patterns cover 80% of use cases
2. **Add complexity only when needed** - Premature optimization is evil
3. **Document your choices** - Future maintainers will thank you
4. **Test your auth setup** - Auth issues cause the most flaky tests
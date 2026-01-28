# Testing Guide

## Overview

PaddleFit uses **Vitest** for unit and integration testing, with **React Testing Library** for component tests.

## Running Tests

```bash
# Run tests in watch mode (for development)
npm test

# Run tests once (for CI)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
src/
  lib/
    __tests__/
      affiliateUrls.test.ts       # Unit tests for business logic
  components/
    __tests__/
      Button.test.tsx             # Component tests
  app/
    api/
      __tests__/
        partner-signup.test.ts    # API integration tests
```

## Writing Tests

### Unit Tests (Business Logic)

Test pure functions and utilities:

```typescript
// src/lib/__tests__/affiliateUrls.test.ts
import { describe, it, expect } from 'vitest';
import { buildPartnerAffiliateUrls } from '../affiliateUrls';

describe('buildPartnerAffiliateUrls', () => {
  it('should inject Amazon affiliate ID', () => {
    const result = buildPartnerAffiliateUrls(
      { amazon: 'https://amazon.com/dp/B08XYZ123' },
      { amazonAffiliateId: 'test-20' }
    );

    expect(result.amazon).toContain('tag=test-20');
  });
});
```

### Component Tests

Test React components with user interactions:

```typescript
// src/components/__tests__/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../ui/Button';

describe('Button', () => {
  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click</Button>);

    await user.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### API Integration Tests

Test API routes with mocked Prisma:

```typescript
// src/app/api/__tests__/partner-signup.test.ts
import { describe, it, expect, vi } from 'vitest';

const mockPrisma = {
  partner: {
    create: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

describe('Partner Signup API', () => {
  it('should create partner with free tier', async () => {
    mockPrisma.partner.create.mockResolvedValue({
      id: 'test-id',
      subscriptionTier: 'free',
    });

    const { POST } = await import('../partners/signup/route');

    const request = new Request('http://localhost/api/partners/signup', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', email: 'test@test.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.partnerId).toBe('test-id');
  });
});
```

## What to Test

### ✅ Always Test

1. **Critical Business Logic**
   - Affiliate URL building
   - Revenue calculations
   - Tier limit enforcement
   - Validation functions

2. **User Interactions**
   - Button clicks
   - Form submissions
   - Clipboard operations
   - Navigation

3. **API Endpoints**
   - Partner signup
   - Affiliate ID management
   - Event tracking
   - Recommendation engine

4. **Error Handling**
   - Invalid inputs
   - Missing data
   - API failures
   - Edge cases

### ❌ Don't Test

1. **Third-party libraries** (React, Next.js internals)
2. **Database operations** (use mocks instead)
3. **Styling** (use visual regression testing tools instead)
4. **Implementation details** (test behavior, not internals)

## Coverage Goals

**Target:** 80% code coverage

Current coverage:
```bash
npm run test:coverage
```

### Critical Areas (100% coverage required):
- `src/lib/affiliateUrls.ts`
- `src/app/api/partners/*/route.ts`
- `src/app/api/recommend/route.ts`

### Important Areas (80%+ coverage):
- All API routes
- Utility functions
- Validation logic

### Less Critical (50%+ coverage):
- UI components
- Layout components

## Continuous Integration

Tests run automatically on:
- Every push to `main` or `develop`
- Every pull request
- See `.github/workflows/test.yml`

### CI Requirements

All PRs must:
1. ✅ Pass all tests
2. ✅ Maintain or improve coverage
3. ✅ Pass linting
4. ✅ Build successfully

## Common Patterns

### Mocking Clipboard API

```typescript
it('should copy to clipboard', async () => {
  const mockWriteText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, {
    clipboard: { writeText: mockWriteText },
  });

  // ... test code

  expect(mockWriteText).toHaveBeenCalledWith('expected text');
});
```

### Mocking Prisma

```typescript
const mockPrisma = {
  partner: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));
```

### Testing Async Functions

```typescript
it('should handle async operations', async () => {
  const result = await someAsyncFunction();
  expect(result).toBe('expected');
});
```

### Testing Error Cases

```typescript
it('should throw error on invalid input', () => {
  expect(() => validateInput('invalid')).toThrow('Invalid input');
});

it('should handle async errors', async () => {
  await expect(async () => {
    await fetchData('invalid-id');
  }).rejects.toThrow('Not found');
});
```

## Debugging Tests

### Run Single Test File

```bash
npm test src/lib/__tests__/affiliateUrls.test.ts
```

### Run Single Test

```bash
npm test -t "should inject Amazon affiliate ID"
```

### Debug with UI

```bash
npm run test:ui
```

Opens a browser UI at http://localhost:51204

### VSCode Integration

Add to `.vscode/settings.json`:
```json
{
  "vitest.enable": true,
  "vitest.commandLine": "npm run test"
}
```

Install the "Vitest" VSCode extension for inline test results.

## Best Practices

### 1. Arrange-Act-Assert Pattern

```typescript
it('should do something', () => {
  // Arrange
  const input = 'test';
  const expected = 'TEST';

  // Act
  const result = toUpperCase(input);

  // Assert
  expect(result).toBe(expected);
});
```

### 2. Test One Thing Per Test

❌ Bad:
```typescript
it('should create partner and send email and update analytics', () => {
  // Testing too many things
});
```

✅ Good:
```typescript
it('should create partner with correct subscription tier', () => {
  // Tests one specific behavior
});

it('should send welcome email after signup', () => {
  // Tests another specific behavior
});
```

### 3. Use Descriptive Test Names

❌ Bad:
```typescript
it('works', () => { /* ... */ });
```

✅ Good:
```typescript
it('should inject Amazon affiliate ID into product URLs', () => { /* ... */ });
```

### 4. Clean Up After Tests

```typescript
import { beforeEach, afterEach } from 'vitest';

beforeEach(() => {
  // Setup
});

afterEach(() => {
  // Cleanup
  vi.clearAllMocks();
});
```

### 5. Don't Test Implementation Details

❌ Bad:
```typescript
it('should call setState with correct value', () => {
  // Testing internal state management
});
```

✅ Good:
```typescript
it('should display updated value when button is clicked', async () => {
  // Testing user-visible behavior
});
```

## Troubleshooting

### Tests fail with "Cannot find module '@/...'"

**Solution:** Check `vitest.config.ts` has correct path alias:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Tests fail with Prisma errors

**Solution:** Mock Prisma client:
```typescript
vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));
```

### Clipboard tests fail

**Solution:** Mock navigator.clipboard:
```typescript
Object.assign(navigator, {
  clipboard: { writeText: vi.fn() },
});
```

### Tests timeout

**Solution:** Increase timeout:
```typescript
it('slow test', async () => {
  // ...
}, 10000); // 10 second timeout
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Quick Reference

```bash
# Run all tests
npm test

# Run specific file
npm test affiliateUrls.test.ts

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui

# Run in CI mode
npm run test:run
```

---

*Last Updated: January 28, 2026*

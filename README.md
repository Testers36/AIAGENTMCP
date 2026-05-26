# Playwright E2E Testing Project

A comprehensive end-to-end testing solution using Playwright for automated browser testing across multiple browsers (Chromium, Firefox, and WebKit).

## Overview

This project provides a complete Playwright testing setup with:
- **TypeScript support** for type-safe test development
- **Multi-browser testing** (Chromium, Firefox, WebKit)
- **Organized test structure** with example tests
- **HTML reporting** for test results
- **UI mode** for interactive debugging

## Project Structure

```
├── tests/                    # Test files
│   └── example.spec.ts      # Example test suite
├── playwright.config.ts      # Playwright configuration
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode (interactive debugging)
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Run tests for specific browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

## Test Reports

After running tests, view the HTML report:
```bash
npm run report
```

The report will open in your default browser showing detailed test results, screenshots, and traces.

## Code Generation

Generate test code by recording user interactions:
```bash
npm run codegen
```

## Configuration

### Base URL

By default, tests use `http://localhost:3000` as the base URL. Update this in `playwright.config.ts`:

```typescript
use: {
  baseURL: 'http://your-url.com',
}
```

### Web Server

To automatically start a dev server before running tests, uncomment the `webServer` section in `playwright.config.ts`:

```typescript
webServer: {
  command: 'npm run start',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
}
```

### Retries & Parallelization

- Tests retry 2 times on CI, 0 times locally
- Tests run in parallel by default
- Configure in `playwright.config.ts`

## Writing Tests

Example test structure:
```typescript
import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```

### Common Assertions
- `expect(page).toHaveTitle()`
- `expect(locator).toBeVisible()`
- `expect(locator).toContainText()`
- `expect(page).toHaveURL()`

### Common Actions
- `page.goto(url)`
- `locator.click()`
- `locator.fill(text)`
- `locator.selectOption(value)`

## Documentation

- [Playwright Documentation](https://playwright.dev)
- [Playwright Test Configuration](https://playwright.dev/docs/test-configuration)
- [Locators and Actions](https://playwright.dev/docs/locators)

## License

MIT

# Page Object Model (POM) Architecture

This project implements a **Page Object Model (POM)** architecture for maintainable and reusable Playwright tests.

## Overview

The POM architecture separates test logic from UI interactions by creating page-specific classes that encapsulate all locators and methods for interacting with that page. This makes tests more readable, maintainable, and reduces code duplication.

## Project Structure

```
d:\AiAgentMCP\
├── pages/                          # Page Object Model classes
│   ├── index.ts                   # Export all page objects
│   ├── LoginPage.ts               # Login page interactions
│   ├── ProductPage.ts             # Product/Shop page interactions
│   ├── CheckoutPage.ts            # Checkout page interactions
│   └── OrderConfirmationPage.ts   # Order confirmation page
├── tests/
│   ├── login-and-checkout-pom.spec.ts  # POM-based test suite
│   └── login-and-checkout.spec.ts      # Original test file
└── [other config files]
```

## Page Objects

### 1. LoginPage
**File**: `pages/LoginPage.ts`

Handles all login-related interactions.

#### Key Methods:
- `navigateToLoginPage(url)` - Navigate to login page
- `enterUsername(username)` - Fill username field
- `enterPassword(password)` - Fill password field
- `selectUserRole(role)` - Select admin or user role
- `clickSignIn()` - Click sign in button
- `login(username, password, role)` - Complete login flow
- `isLoginPageVisible()` - Verify login page is displayed

#### Example Usage:
```typescript
const loginPage = new LoginPage(page);
await loginPage.login('rahulshettyacademy', 'Learning@830$3mK2', 'admin');
```

### 2. ProductPage
**File**: `pages/ProductPage.ts`

Handles product listing and add-to-cart functionality.

#### Key Methods:
- `getProductCount()` - Get total number of products
- `findProductByName(productName)` - Find product by name
- `addProductToCartByName(productName)` - Add product to cart
- `isProductVisible(productName)` - Check if product is visible
- `getAddToCartButtonCount()` - Count add-to-cart buttons
- `verifyProductsLoaded()` - Verify products are loaded

#### Example Usage:
```typescript
const productPage = new ProductPage(page);
await productPage.addProductToCartByName('iphone X');
```

### 3. CheckoutPage
**File**: `pages/CheckoutPage.ts`

Handles checkout process and cart verification.

#### Key Methods:
- `goToCheckout()` - Navigate to checkout page
- `isProductInCart(productName)` - Verify product is in cart
- `getCartSummary()` - Get cart summary text
- `getCartItemCount()` - Get number of items in cart
- `isCheckoutPageDisplayed()` - Verify checkout page is active
- `proceedToPlaceOrder()` - Click place order button
- `completeCheckout(productName)` - Complete checkout with verification

#### Example Usage:
```typescript
const checkoutPage = new CheckoutPage(page);
await checkoutPage.goToCheckout();
await checkoutPage.completeCheckout('iphone X');
```

### 4. OrderConfirmationPage
**File**: `pages/OrderConfirmationPage.ts`

Handles order confirmation verification.

#### Key Methods:
- `isOrderPlacedSuccessfully()` - Check for success message
- `getConfirmationText()` - Get confirmation page text
- `isConfirmationPageDisplayed()` - Verify confirmation page
- `getCurrentPageUrl()` - Get current page URL
- `verifyProductInOrder(productName)` - Verify product in order
- `waitForOrderConfirmation(timeout)` - Wait for confirmation

#### Example Usage:
```typescript
const confirmationPage = new OrderConfirmationPage(page);
const isConfirmed = await confirmationPage.isConfirmationPageDisplayed();
```

## Test Suite

**File**: `tests/login-and-checkout-pom.spec.ts`

### Available Tests

1. **Complete E-Commerce Flow** - Full end-to-end test
   - Login → Verify Products → Add to Cart → Checkout → Confirmation

2. **Login and Verify Product** - Test product availability after login

3. **Add Product and Verify Cart** - Test add-to-cart functionality

4. **Complete Checkout and Verify Order** - Test checkout and order confirmation

## Running Tests

### Run all POM tests:
```bash
npm test -- tests/login-and-checkout-pom.spec.ts
```

### Run with UI mode (interactive):
```bash
npm run test:ui -- tests/login-and-checkout-pom.spec.ts
```

### Run with headed browsers (visible):
```bash
npm test -- tests/login-and-checkout-pom.spec.ts --headed
```

### Run specific test:
```bash
npm test -- tests/login-and-checkout-pom.spec.ts -g "Complete E-Commerce Flow"
```

### View test report:
```bash
npm run report
```

## Benefits of POM Architecture

✅ **Reusability**: Page objects can be reused across multiple tests
✅ **Maintainability**: Changes to UI only require updates in page objects
✅ **Readability**: Tests are more readable and easier to understand
✅ **Reduced Duplication**: No duplicate selectors or interaction code
✅ **Scalability**: Easy to add new pages and tests
✅ **Isolation**: Tests are isolated from implementation details

## Best Practices

1. **One Page Object Per Page**: Each logical page gets its own class
2. **Meaningful Method Names**: Method names should clearly describe actions
3. **Encapsulation**: Hide complex interactions within page object methods
4. **No Test Logic in Page Objects**: Page objects should only contain UI interactions
5. **DRY Principle**: Reuse common interactions across methods
6. **Locator Organization**: Group related locators together
7. **Documentation**: Add JSDoc comments for all public methods

## Adding New Page Objects

1. Create a new file in `pages/` directory (e.g., `MyPage.ts`)
2. Extend with locators and methods following the pattern of existing page objects
3. Export from `pages/index.ts`
4. Use in tests

### Template:
```typescript
import { Page, Locator } from '@playwright/test';

export class MyPage {
  readonly page: Page;
  readonly myElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myElement = page.locator('#my-element');
  }

  async myMethod(): Promise<void> {
    // Implementation
  }
}
```

## Troubleshooting

### Tests failing due to selector changes
- Update the locator in the corresponding page object
- No need to update multiple test files

### Need to add new functionality
- Add method to appropriate page object
- Reuse across all tests that need it

### Debugging test failures
- Use `console.log()` statements in page objects
- Run with `--debug` flag: `npm run test:debug`
- Use Playwright Inspector for interactive debugging

## Test Credentials

**Username**: `rahulshettyacademy`
**Password**: `Learning@830$3mK2`

## Test Data

**Product to test**: iPhone X
**Login URL**: https://rahulshettyacademy.com/loginpagePractise/
**Shop URL**: https://rahulshettyacademy.com/angularpractice/shop

# Page Objects Directory

This directory contains all Page Object Model (POM) classes used in the Playwright test suite.

## Files

### LoginPage.ts
Handles all login-related interactions including username/password entry, role selection, and login flow.

**Key Methods**:
- `login(username, password, role)` - Complete login process
- `navigateToLoginPage(url)` - Go to login page
- `selectUserRole(role)` - Choose admin or user role

### ProductPage.ts
Manages product listing page interactions including finding products and adding them to cart.

**Key Methods**:
- `addProductToCartByName(productName)` - Add specific product to cart
- `findProductByName(productName)` - Locate product by name
- `isProductVisible(productName)` - Check if product exists

### CheckoutPage.ts
Handles checkout flow including cart review and order placement.

**Key Methods**:
- `goToCheckout()` - Navigate to checkout
- `completeCheckout(productName)` - Complete checkout flow
- `isProductInCart(productName)` - Verify product in cart

### OrderConfirmationPage.ts
Manages order confirmation page verification and order details retrieval.

**Key Methods**:
- `isConfirmationPageDisplayed()` - Verify order confirmation
- `verifyProductInOrder(productName)` - Check product in order
- `getConfirmationText()` - Get confirmation message

### index.ts
Barrel export file for easy importing of all page objects.

**Usage**:
```typescript
import { LoginPage, ProductPage, CheckoutPage, OrderConfirmationPage } from '../pages';
```

## How to Extend

1. Create a new `.ts` file in this directory
2. Define your page object class with locators and methods
3. Add export statement to `index.ts`
4. Use in your test files

## Naming Conventions

- **File names**: `PageNamePage.ts` (e.g., LoginPage.ts, ProductPage.ts)
- **Class names**: `PageNamePage` (e.g., LoginPage, ProductPage)
- **Methods**: camelCase starting with action verb (e.g., `clickButton`, `fillForm`)
- **Locators**: descriptive names prefixed with element type (e.g., `loginButton`, `usernameField`)

## Import Examples

```typescript
// Import individual page objects
import { LoginPage } from '../pages/LoginPage';

// Or use barrel import (recommended)
import { LoginPage, ProductPage } from '../pages';
```

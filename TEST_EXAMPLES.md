# Test Examples with Page Object Model

This document provides practical examples of how to use the Page Object Model classes in your tests.

## Basic Setup

Every test should initialize the page objects in `beforeEach`:

```typescript
import { test } from '@playwright/test';
import { LoginPage, ProductPage, CheckoutPage, OrderConfirmationPage } from '../pages';

test.describe('My Test Suite', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let checkoutPage: CheckoutPage;
  let orderConfirmationPage: OrderConfirmationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    checkoutPage = new CheckoutPage(page);
    orderConfirmationPage = new OrderConfirmationPage(page);
  });

  test('example test', async () => {
    // Test code here
  });
});
```

## Example 1: Simple Login Test

```typescript
test('User should be able to login', async () => {
  await test.step('Login with valid credentials', async () => {
    await loginPage.login('rahulshettyacademy', 'Learning@830$3mK2', 'admin');
  });

  await test.step('Verify user is on shop page', async () => {
    expect(loginPage.page.url()).toContain('shop');
  });
});
```

## Example 2: Add Product to Cart

```typescript
test('Add product to cart', async () => {
  // Login first
  await loginPage.login('rahulshettyacademy', 'Learning@830$3mK2', 'admin');

  // Add product to cart
  await test.step('Add iPhone X to cart', async () => {
    await productPage.addProductToCartByName('iphone X');
  });

  // Verify product is visible
  const isVisible = await productPage.isProductVisible('iphone X');
  expect(isVisible).toBe(true);
});
```

## Example 3: Complete Checkout Flow

```typescript
test('Complete checkout flow', async () => {
  const testProduct = 'iphone X';

  // Step 1: Login
  await loginPage.login('rahulshettyacademy', 'Learning@830$3mK2', 'admin');

  // Step 2: Add to cart
  await productPage.addProductToCartByName(testProduct);

  // Step 3: Checkout
  await checkoutPage.goToCheckout();
  
  // Step 4: Verify product in cart
  const inCart = await checkoutPage.isProductInCart(testProduct);
  expect(inCart).toBe(true);

  // Step 5: Place order
  await checkoutPage.proceedToPlaceOrder();

  // Step 6: Verify confirmation
  const isConfirmed = await orderConfirmationPage.isConfirmationPageDisplayed();
  expect(isConfirmed).toBe(true);
});
```

## Example 4: Verify Multiple Products

```typescript
test('Verify product availability', async () => {
  await loginPage.login('rahulshettyacademy', 'Learning@830$3mK2', 'admin');

  const products = ['iphone X', 'Samsung Note 8', 'Blackberry'];

  for (const product of products) {
    await test.step(`Verify ${product} is available`, async () => {
      const isVisible = await productPage.isProductVisible(product);
      expect(isVisible).toBe(true);
    });
  }
});
```

## Example 5: Test Different User Roles

```typescript
test('Login with different roles', async () => {
  const credentials = {
    username: 'rahulshettyacademy',
    password: 'Learning@830$3mK2'
  };

  // Test admin role
  await test.step('Login as admin', async () => {
    await loginPage.login(credentials.username, credentials.password, 'admin');
  });

  // Test user role
  // (Note: May need new page instance for new session)
});
```

## Example 6: Test with Data-Driven Approach

```typescript
test.describe('E-commerce operations', () => {
  const testCases = [
    { product: 'iphone X', expectedInStock: true },
    { product: 'Samsung Note 8', expectedInStock: true },
    { product: 'Blackberry', expectedInStock: true },
  ];

  testCases.forEach((testCase) => {
    test(`Add ${testCase.product} to cart`, async () => {
      await loginPage.login('rahulshettyacademy', 'Learning@830$3mK2', 'admin');
      
      const isVisible = await productPage.isProductVisible(testCase.product);
      expect(isVisible).toBe(testCase.expectedInStock);

      if (isVisible) {
        await productPage.addProductToCartByName(testCase.product);
      }
    });
  });
});
```

## Example 7: With Assertions and Custom Steps

```typescript
test('Complete purchase with verification', async () => {
  const productName = 'iphone X';

  // Login step
  await test.step('Authentication', async () => {
    await loginPage.login('rahulshettyacademy', 'Learning@830$3mK2', 'admin');
    const isVisible = await loginPage.page.locator('app-navbar').isVisible();
    expect(isVisible).toBe(true);
  });

  // Product selection step
  await test.step('Product selection', async () => {
    expect(await productPage.verifyProductsLoaded()).toBe(true);
    
    const productIndex = await productPage.findProductByName(productName);
    expect(productIndex).toBeGreaterThanOrEqual(0);
    
    await productPage.addProductToCartByName(productName);
  });

  // Checkout step
  await test.step('Checkout process', async () => {
    await checkoutPage.goToCheckout();
    expect(await checkoutPage.isCheckoutPageDisplayed()).toBe(true);
    
    const isInCart = await checkoutPage.isProductInCart(productName);
    expect(isInCart).toBe(true);
    
    await checkoutPage.proceedToPlaceOrder();
  });

  // Confirmation step
  await test.step('Order confirmation', async () => {
    const currentUrl = await orderConfirmationPage.getCurrentPageUrl();
    expect(currentUrl).not.toContain('checkout');
  });
});
```

## Example 8: Error Handling

```typescript
test('Handle missing product gracefully', async () => {
  await loginPage.login('rahulshettyacademy', 'Learning@830$3mK2', 'admin');

  try {
    await productPage.addProductToCartByName('Non-existent Product');
    expect(true).toBe(false); // Should not reach here
  } catch (error) {
    expect(error.message).toContain('not found');
  }
});
```

## Example 9: With Screenshot Capture

```typescript
test('Complete flow with screenshots', async () => {
  // Login
  await loginPage.login('rahulshettyacademy', 'Learning@830$3mK2', 'admin');
  await loginPage.page.screenshot({ path: 'screenshots/01-logged-in.png' });

  // Add to cart
  await productPage.addProductToCartByName('iphone X');
  await loginPage.page.screenshot({ path: 'screenshots/02-product-added.png' });

  // Checkout
  await checkoutPage.goToCheckout();
  await loginPage.page.screenshot({ path: 'screenshots/03-checkout.png' });
});
```

## Best Practices

1. **Always initialize page objects in beforeEach**
2. **Use test.step() for logical grouping**
3. **Add meaningful console.log statements**
4. **Use expect() for assertions**
5. **Catch and handle expected errors**
6. **Keep tests focused on one scenario**
7. **Use descriptive test names**
8. **Avoid test interdependencies**
9. **Use data-driven testing for multiple scenarios**
10. **Document complex test logic with comments**

## Common Patterns

### Pattern 1: Setup and Verify
```typescript
await loginPage.login(...);
const result = await someOperation();
expect(result).toBe(expectedValue);
```

### Pattern 2: Multiple Steps
```typescript
await test.step('Step 1', async () => { /* ... */ });
await test.step('Step 2', async () => { /* ... */ });
await test.step('Step 3', async () => { /* ... */ });
```

### Pattern 3: Error Handling
```typescript
try {
  await operation();
} catch (error) {
  expect(error.message).toContain('expected text');
}
```

### Pattern 4: Data-Driven
```typescript
for (const data of testDataArray) {
  await test.step(`Test with ${data}`, async () => {
    // Use data
  });
}
```

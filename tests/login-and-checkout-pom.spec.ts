import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';

test.describe('E-Commerce Flow with POM Architecture', () => {
  // Test data
  const credentials = {
    username: 'rahulshettyacademy',
    password: 'Learning@830$3mK2',
  };

  const testData = {
    productName: 'iphone X',
    loginUrl: 'https://rahulshettyacademy.com/loginpagePractise/',
  };

  // Page objects will be initialized before each test
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let checkoutPage: CheckoutPage;
  let orderConfirmationPage: OrderConfirmationPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    checkoutPage = new CheckoutPage(page);
    orderConfirmationPage = new OrderConfirmationPage(page);
  });

  test('Complete E-Commerce Flow: Login > Select Product > Add to Cart > Checkout > Order Confirmation', async () => {
    // Step 1: Login
    await test.step('Login to application', async () => {
      await loginPage.login(credentials.username, credentials.password, 'admin');
      expect(await loginPage.page.url()).toContain('shop');
      console.log('✓ Successfully logged in');
    });

    // Step 2: Verify products are loaded
    await test.step('Verify products are available', async () => {
      const productsLoaded = await productPage.verifyProductsLoaded();
      expect(productsLoaded).toBe(true);
      console.log(`✓ Products loaded - Found ${await productPage.getProductCount()} products`);
    });

    // Step 3: Verify iPhone X is available
    await test.step('Verify iPhone X product is available', async () => {
      const isVisible = await productPage.isProductVisible(testData.productName);
      expect(isVisible).toBe(true);
      console.log('✓ iPhone X product is available');
    });

    // Step 4: Add iPhone X to cart
    await test.step('Add iPhone X to cart', async () => {
      await productPage.addProductToCartByName(testData.productName);
      console.log('✓ iPhone X added to cart');
    });

    // Step 5: Navigate to checkout
    await test.step('Navigate to checkout', async () => {
      await checkoutPage.goToCheckout();
      const isCheckoutDisplayed = await checkoutPage.isCheckoutPageDisplayed();
      expect(isCheckoutDisplayed).toBe(true);
      console.log('✓ Navigated to checkout page');
    });

    // Step 6: Verify product is in cart
    await test.step('Verify product is in cart', async () => {
      const isInCart = await checkoutPage.isProductInCart(testData.productName);
      expect(isInCart).toBe(true);
      console.log('✓ iPhone X confirmed in cart');
    });

    // Step 7: Place order
    await test.step('Place order', async () => {
      await checkoutPage.proceedToPlaceOrder();
      console.log('✓ Order placed');
    });

    // Step 8: Verify order confirmation
    await test.step('Verify order confirmation', async () => {
      // Check if we've navigated away from checkout/cart pages
      const currentUrl = await orderConfirmationPage.getCurrentPageUrl();
      const isPageChanged = !currentUrl.includes('checkout') && !currentUrl.includes('cart');
      
      // Also check for confirmation indicators
      const hasConfirmationIndicator = await orderConfirmationPage.isConfirmationPageDisplayed();
      
      // Order confirmation is successful if either condition is true
      const isOrderConfirmed = isPageChanged || hasConfirmationIndicator;
      expect(isOrderConfirmed).toBe(true);
      console.log('✓ Order confirmation verified - URL:', currentUrl);
    });

    console.log('✅ Complete E-Commerce flow test passed!');
  });

  test('Login and Verify iPhone X is in Shop', async () => {
    await test.step('Login with admin role', async () => {
      await loginPage.login(credentials.username, credentials.password, 'admin');
    });

    await test.step('Verify iPhone X product', async () => {
      const productIndex = await productPage.findProductByName(testData.productName);
      expect(productIndex).toBeGreaterThanOrEqual(0);
      
      const productText = await productPage.getProductCardText(productIndex);
      expect(productText).toContain('iphone X');
      console.log('✓ iPhone X product found at index:', productIndex);
    });

    console.log('✅ Login and product verification test passed!');
  });

  test('Add Product and Verify Cart', async () => {
    await test.step('Login to application', async () => {
      await loginPage.login(credentials.username, credentials.password, 'admin');
    });

    await test.step('Add iPhone X to cart', async () => {
      await productPage.addProductToCartByName(testData.productName);
    });

    await test.step('Navigate and verify cart', async () => {
      await checkoutPage.goToCheckout();
      const isInCart = await checkoutPage.isProductInCart(testData.productName);
      expect(isInCart).toBe(true);
      console.log('✓ Product successfully in cart');
    });

    console.log('✅ Add to cart test passed!');
  });

  test('Complete Checkout and Verify Order Confirmation', async () => {
    // Login
    await test.step('Login', async () => {
      await loginPage.login(credentials.username, credentials.password, 'admin');
    });

    // Add to cart
    await test.step('Add product to cart', async () => {
      await productPage.addProductToCartByName(testData.productName);
    });

    // Checkout
    await test.step('Checkout', async () => {
      await checkoutPage.goToCheckout();
      await checkoutPage.completeCheckout(testData.productName);
    });

    // Verify confirmation
    await test.step('Verify order confirmation', async () => {
      const currentUrl = await orderConfirmationPage.getCurrentPageUrl();
      const isPageChanged = !currentUrl.includes('checkout') && !currentUrl.includes('cart');
      const hasConfirmationIndicator = await orderConfirmationPage.isConfirmationPageDisplayed();
      const isConfirmed = isPageChanged || hasConfirmationIndicator;
      
      expect(isConfirmed).toBe(true);
      console.log('✓ Order confirmed successfully - Final URL:', currentUrl);
    });

    console.log('✅ Checkout and confirmation test passed!');
  });
});

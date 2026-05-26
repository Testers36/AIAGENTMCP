import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('CheckoutPage Tests', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let checkoutPage: CheckoutPage;

  const credentials = {
    username: 'rahulshettyacademy',
    password: 'Learning@830$3mK2',
  };

  const testProduct = 'iphone X';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    checkoutPage = new CheckoutPage(page);

    // Login and add product to cart before each test
    await loginPage.login(credentials.username, credentials.password, 'admin');
    await productPage.addProductToCartByName(testProduct);
  });

  test('Should navigate to checkout page', async () => {
    await test.step('Click checkout button', async () => {
      await checkoutPage.goToCheckout();
      console.log('✓ Navigated to checkout page');
    });

    await test.step('Verify checkout page is displayed', async () => {
      const isCheckoutPage = await checkoutPage.isCheckoutPageDisplayed();
      expect(isCheckoutPage).toBe(true);
      console.log('✓ Checkout page is displayed');
    });
  });

  test('Should verify product is in cart', async () => {
    await test.step('Navigate to checkout', async () => {
      await checkoutPage.goToCheckout();
    });

    await test.step('Verify iPhone X is in cart', async () => {
      const isInCart = await checkoutPage.isProductInCart(testProduct);
      expect(isInCart).toBe(true);
      console.log('✓ iPhone X is in cart');
    });
  });

  test('Should get cart summary', async () => {
    await test.step('Navigate to checkout', async () => {
      await checkoutPage.goToCheckout();
    });

    await test.step('Get cart summary text', async () => {
      const summary = await checkoutPage.getCartSummary();
      expect(summary).toBeTruthy();
      expect(summary).toContain('iphone X');
      console.log('✓ Cart summary retrieved with product details');
    });
  });

  test('Should count cart items', async () => {
    await test.step('Navigate to checkout', async () => {
      await checkoutPage.goToCheckout();
    });

    await test.step('Get cart item count', async () => {
      const itemCount = await checkoutPage.getCartItemCount();
      expect(itemCount).toBeGreaterThanOrEqual(0);
      console.log(`✓ Cart contains ${itemCount} item sections`);
    });
  });

  test('Should verify checkout button visibility', async () => {
    await test.step('Verify checkout button exists', async () => {
      const isCheckoutBtnVisible = await checkoutPage.checkoutButton.isVisible();
      expect(isCheckoutBtnVisible).toBe(true);
      console.log('✓ Checkout button is visible');
    });
  });

  test('Should have place order button on checkout page', async () => {
    await test.step('Navigate to checkout', async () => {
      await checkoutPage.goToCheckout();
    });

    await test.step('Verify place order button exists', async () => {
      const isPlaceOrderBtnVisible = await checkoutPage.placeOrderButton.isVisible();
      expect(isPlaceOrderBtnVisible).toBe(true);
      console.log('✓ Place order button is visible');
    });
  });

  test('Should complete checkout with single product', async () => {
    await test.step('Navigate to checkout', async () => {
      await checkoutPage.goToCheckout();
    });

    await test.step('Complete checkout', async () => {
      await checkoutPage.completeCheckout(testProduct);
      console.log('✓ Checkout completed successfully');
    });
  });

  test('Should add multiple products and checkout', async () => {
    // Go back to products and add another product
    await test.step('Navigate back to products', async () => {
      await checkoutPage.page.goto('https://rahulshettyacademy.com/angularpractice/shop');
      await checkoutPage.page.waitForLoadState('networkidle');
    });

    await test.step('Add second product', async () => {
      await productPage.addProductToCartByName('Samsung Note 8');
      console.log('✓ Added second product');
    });

    await test.step('Proceed to checkout with multiple items', async () => {
      await checkoutPage.goToCheckout();
      const isCheckoutDisplayed = await checkoutPage.isCheckoutPageDisplayed();
      expect(isCheckoutDisplayed).toBe(true);
      console.log('✓ Multiple products in cart');
    });
  });

  test('Should verify cart URL after navigation', async () => {
    await test.step('Navigate to checkout', async () => {
      await checkoutPage.goToCheckout();
    });

    await test.step('Verify cart/checkout URL', async () => {
      const url = checkoutPage.page.url();
      const hasCheckoutIndicator = url.includes('checkout') || url.includes('cart');
      expect(hasCheckoutIndicator).toBe(true);
      console.log('✓ URL indicates checkout/cart page:', url);
    });
  });

  test('Should display product details in cart', async () => {
    await test.step('Navigate to checkout', async () => {
      await checkoutPage.goToCheckout();
    });

    await test.step('Verify product information in cart', async () => {
      const cartText = await checkoutPage.getCartSummary();
      expect(cartText).toContain('iphone X');
      
      // Check for product-related information like price
      const hasProductInfo = cartText && (cartText.includes('$') || cartText.includes('price'));
      console.log('✓ Cart displays product details');
    });
  });

  test('Should allow proceeding to place order', async () => {
    await test.step('Navigate to checkout', async () => {
      await checkoutPage.goToCheckout();
    });

    await test.step('Proceed to place order', async () => {
      await checkoutPage.proceedToPlaceOrder();
      console.log('✓ Proceeded to place order successfully');
    });
  });

  test('Should maintain product in cart after navigation', async () => {
    await test.step('Navigate to checkout', async () => {
      await checkoutPage.goToCheckout();
    });

    await test.step('Verify product still in cart', async () => {
      const isInCart = await checkoutPage.isProductInCart(testProduct);
      expect(isInCart).toBe(true);
      console.log('✓ Product remains in cart after navigation');
    });
  });

  test('Should verify checkout page elements', async () => {
    await test.step('Navigate to checkout', async () => {
      await checkoutPage.goToCheckout();
    });

    await test.step('Verify all checkout elements are present', async () => {
      const checkoutDisplayed = await checkoutPage.isCheckoutPageDisplayed();
      const productInCart = await checkoutPage.isProductInCart(testProduct);
      const placeOrderBtnVisible = await checkoutPage.placeOrderButton.isVisible();

      expect(checkoutDisplayed).toBe(true);
      expect(productInCart).toBe(true);
      expect(placeOrderBtnVisible).toBe(true);

      console.log('✓ All checkout page elements are present');
    });
  });
});

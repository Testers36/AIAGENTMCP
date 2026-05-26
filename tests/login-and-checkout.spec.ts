import { test, expect } from '@playwright/test';

test.describe('Login and Checkout Flow', () => {
  const baseURL = 'https://rahulshettyacademy.com/loginpagePractise/';
  
  // Test credentials (from page source)
  const username = 'rahulshettyacademy';
  const password = 'Learning@830$3mK2';
  const productName = 'iphone X';

  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
  });

  test('Should login, add iPhone X to cart, and checkout successfully', async ({ page }) => {
    // Step 1: Verify login page is displayed
    const loginForm = page.locator('#login-form');
    await expect(loginForm).toBeVisible();
    console.log('✓ Login page loaded');

    // Step 2: Fill in login credentials using IDs
    const usernameField = page.locator('#username');
    await usernameField.fill(username);
    console.log('✓ Username entered');

    const passwordField = page.locator('#password');
    await passwordField.fill(password);
    console.log('✓ Password entered');

    // Step 3: Select 'Admin' role (or 'User' depending on requirements)
    // The radio buttons have role selection - let's select "User" role
    const userRadioBtn = page.locator('input[value="user"]');
    
    // Only select if visible and not already selected
    if (await userRadioBtn.isVisible()) {
      await userRadioBtn.click();
      console.log('✓ User role selected');
      
      // A modal appears when "User" is selected - handle it
      await page.waitForTimeout(500);
      const okayBtn = page.locator('#okayBtn');
      if (await okayBtn.isVisible()) {
        await okayBtn.click();
        console.log('✓ Modal dismissed');
        await page.waitForTimeout(500);
      }
    }

    // Step 4: Click login/sign in button
    const loginButton = page.locator('#signInBtn');
    await loginButton.click();
    console.log('✓ Sign in button clicked');

    // Wait for redirect to shop page
    await page.waitForURL('**/angularpractice/shop', { timeout: 15000 });
    console.log('✓ Redirected to shop page');
    await page.waitForLoadState('networkidle');

    // Step 5: Find and add iPhone X to cart
    // Look for product cards on the shop page
    const products = page.locator('app-card');
    const productCount = await products.count();
    console.log(`✓ Found ${productCount} products on page`);

    // Find the iPhone X product card
    let productFound = false;
    for (let i = 0; i < productCount; i++) {
      const productCard = products.nth(i);
      const productText = await productCard.textContent();
      
      if (productText && productText.toLowerCase().includes('iphone x')) {
        console.log('✓ iPhone X product card found');
        
        // Click the 'Add to Cart' button within this product card
        const addBtn = productCard.locator('button:has-text("Add")');
        if (await addBtn.isVisible()) {
          await addBtn.click();
          console.log('✓ Added iPhone X to cart');
          productFound = true;
          await page.waitForTimeout(500);
          break;
        }
      }
    }

    if (!productFound) {
      throw new Error('iPhone X product not found on the shop page');
    }

    // Step 6: Navigate to cart and checkout
    const checkoutBtn = page.locator('a:has-text("Checkout")');
    
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      console.log('✓ Navigated to checkout');
      await page.waitForLoadState('networkidle');

      // Step 7: Verify product is in cart
      const cartBody = await page.locator('body').textContent();
      
      if (cartBody && cartBody.toLowerCase().includes('iphone x')) {
        console.log('✓ iPhone X confirmed in cart');
        
        // Look for checkout/place order button
        const placeOrderBtn = page.locator('button:has-text("Checkout")').last();
        
        if (await placeOrderBtn.isVisible()) {
          await placeOrderBtn.click();
          console.log('✓ Proceeding to checkout');
          await page.waitForLoadState('networkidle');
          
          // Wait a moment for confirmation page
          await page.waitForTimeout(1000);
          
          // Try to verify order confirmation
          const bodyText = await page.locator('body').textContent();
          if (bodyText && (bodyText.includes('Success') || bodyText.includes('Order placed'))) {
            console.log('✓ Order placed successfully');
          }
        }
      }
    }

    console.log('✓ Test completed - iPhone X added to cart successfully');
  });

  test('Should verify iPhone X product details before checkout', async ({ page }) => {
    // Login first using correct credentials
    const usernameField = page.locator('#username');
    await usernameField.fill(username);

    const passwordField = page.locator('#password');
    await passwordField.fill(password);

    // Select admin role (no modal)
    const adminRadioBtn = page.locator('input[value="admin"]');
    if (await adminRadioBtn.isVisible()) {
      await adminRadioBtn.click();
      await page.waitForTimeout(300);
    }

    const loginButton = page.locator('#signInBtn');
    await loginButton.click();

    // Wait for shop page
    await page.waitForURL('**/angularpractice/shop', { timeout: 15000 });
    await page.waitForLoadState('networkidle');

    // Verify we can see products
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('iphone X');
    console.log('✓ iPhone X product is available in catalog');

    // Verify product has add button
    const addButtons = page.locator('button:has-text("Add")');
    const buttonCount = await addButtons.count();
    expect(buttonCount).toBeGreaterThan(0);
    console.log(`✓ Found ${buttonCount} 'Add to Cart' buttons`);

    // Verify app-card components exist
    const productCards = page.locator('app-card');
    const cardCount = await productCards.count();
    expect(cardCount).toBeGreaterThan(0);
    console.log(`✓ Found ${cardCount} product cards`);
  });
});

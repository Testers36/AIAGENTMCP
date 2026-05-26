import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly placeOrderButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('a:has-text("Checkout")');
    this.placeOrderButton = page.locator('button:has-text("Checkout")').last();
    this.cartItems = page.locator('[class*="cart"], [class*="item"]');
  }

  /**
   * Navigate to checkout page from shop page
   */
  async goToCheckout(): Promise<void> {
    if (!await this.checkoutButton.isVisible()) {
      throw new Error('Checkout button not found');
    }
    
    await this.checkoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify product is in cart
   */
  async isProductInCart(productName: string): Promise<boolean> {
    const cartText = await this.page.locator('body').textContent();
    return cartText ? cartText.toLowerCase().includes(productName.toLowerCase()) : false;
  }

  /**
   * Get cart summary text
   */
  async getCartSummary(): Promise<string | null> {
    return await this.page.locator('body').textContent();
  }

  /**
   * Get number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Verify checkout page is displayed
   */
  async isCheckoutPageDisplayed(): Promise<boolean> {
    // Check if we're on checkout page by looking for cart/checkout specific elements
    const pageText = await this.page.locator('body').textContent();
    return pageText ? (pageText.includes('Cart') || pageText.includes('Checkout')) : false;
  }

  /**
   * Proceed to place order
   */
  async proceedToPlaceOrder(): Promise<void> {
    if (!await this.placeOrderButton.isVisible()) {
      throw new Error('Place Order button not found');
    }
    
    await this.placeOrderButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  /**
   * Complete checkout process
   */
  async completeCheckout(productName: string): Promise<void> {
    // Verify product is in cart
    if (!await this.isProductInCart(productName)) {
      throw new Error(`Product "${productName}" not found in cart`);
    }

    // Proceed to place order
    await this.proceedToPlaceOrder();
  }
}

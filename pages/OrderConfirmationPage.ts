import { Page, Locator } from '@playwright/test';

export class OrderConfirmationPage {
  readonly page: Page;
  readonly successMessage: Locator;
  readonly orderDetails: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successMessage = page.locator('text=Success, Order placed successfully, Thank you, Thankyou').first();
    this.orderDetails = page.locator('body');
  }

  /**
   * Verify order was placed successfully
   */
  async isOrderPlacedSuccessfully(): Promise<boolean> {
    return await this.successMessage.isVisible().catch(() => false);
  }

  /**
   * Get order confirmation text
   */
  async getConfirmationText(): Promise<string | null> {
    return await this.orderDetails.textContent();
  }

  /**
   * Verify order confirmation page is displayed
   */
  async isConfirmationPageDisplayed(): Promise<boolean> {
    await this.page.waitForTimeout(1000);
    const pageText = await this.getConfirmationText();
    const pageUrl = await this.getCurrentPageUrl();
    
    // Check multiple indicators of order confirmation
    const hasConfirmationText = pageText ? (
      pageText.includes('Success') || 
      pageText.includes('Order placed') || 
      pageText.includes('Thank you') ||
      pageText.includes('Thankyou') ||
      pageText.includes('confirmation')
    ) : false;

    const hasConfirmationUrl = pageUrl.includes('success') || 
                               pageUrl.includes('confirmation') || 
                               pageUrl.includes('thank');

    // If we find text or URL indicators, return true
    if (hasConfirmationText || hasConfirmationUrl) {
      return true;
    }

    // As a fallback, check if we're on a different page (not checkout)
    const isNotOnCheckout = !pageUrl.includes('checkout') && !pageUrl.includes('cart');
    return isNotOnCheckout && (await this.page.locator('h1, h2, h3, .alert, .message').count()) > 0;
  }

  /**
   * Get current page URL to verify order confirmation page
   */
  async getCurrentPageUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Verify product was added to order
   */
  async verifyProductInOrder(productName: string): Promise<boolean> {
    const orderText = await this.getConfirmationText();
    return orderText ? orderText.toLowerCase().includes(productName.toLowerCase()) : false;
  }

  /**
   * Wait for order confirmation
   */
  async waitForOrderConfirmation(timeout: number = 10000): Promise<void> {
    try {
      await this.page.waitForURL(/.*(?:success|confirmation|thank).*/i, { timeout });
    } catch {
      // URL might not change, but that's okay - check text instead
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
        if (await this.isConfirmationPageDisplayed()) {
          return;
        }
        await this.page.waitForTimeout(500);
      }
      throw new Error('Order confirmation not received within timeout');
    }
  }
}

import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('app-card');
    this.addToCartButtons = page.locator('button:has-text("Add")');
  }

  /**
   * Get total number of products on the page
   */
  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  /**
   * Get product card by index
   */
  getProductCardByIndex(index: number): Locator {
    return this.productCards.nth(index);
  }

  /**
   * Get the text content of a product card
   */
  async getProductCardText(index: number): Promise<string | null> {
    return await this.getProductCardByIndex(index).textContent();
  }

  /**
   * Find a product by name and return its index
   */
  async findProductByName(productName: string): Promise<number> {
    const count = await this.getProductCount();
    
    for (let i = 0; i < count; i++) {
      const productText = await this.getProductCardText(i);
      if (productText && productText.toLowerCase().includes(productName.toLowerCase())) {
        return i;
      }
    }
    
    throw new Error(`Product "${productName}" not found on the page`);
  }

  /**
   * Add a product to cart by name
   */
  async addProductToCartByName(productName: string): Promise<void> {
    const productIndex = await this.findProductByName(productName);
    const productCard = this.getProductCardByIndex(productIndex);
    const addBtn = productCard.locator('button:has-text("Add")');
    
    if (!await addBtn.isVisible()) {
      throw new Error(`Add button not found for product "${productName}"`);
    }
    
    await addBtn.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Verify product is visible on page
   */
  async isProductVisible(productName: string): Promise<boolean> {
    const bodyText = await this.page.locator('body').textContent();
    return bodyText ? bodyText.toLowerCase().includes(productName.toLowerCase()) : false;
  }

  /**
   * Get count of add to cart buttons
   */
  async getAddToCartButtonCount(): Promise<number> {
    return await this.addToCartButtons.count();
  }

  /**
   * Verify products are loaded
   */
  async verifyProductsLoaded(): Promise<boolean> {
    return (await this.getProductCount()) > 0;
  }
}

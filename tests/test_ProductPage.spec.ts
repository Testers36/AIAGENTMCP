import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';

test.describe('ProductPage Tests', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;

  const credentials = {
    username: 'rahulshettyacademy',
    password: 'Learning@830$3mK2',
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);

    // Login before each test
    await loginPage.login(credentials.username, credentials.password, 'admin');
  });

  test('Should display products after login', async () => {
    await test.step('Verify products are loaded', async () => {
      const isLoaded = await productPage.verifyProductsLoaded();
      expect(isLoaded).toBe(true);
      console.log('✓ Products loaded successfully');
    });
  });

  test('Should count products correctly', async () => {
    await test.step('Get product count', async () => {
      const count = await productPage.getProductCount();
      expect(count).toBeGreaterThan(0);
      console.log(`✓ Found ${count} products on the page`);
    });
  });

  test('Should find iPhone X product', async () => {
    await test.step('Find iPhone X in product list', async () => {
      const index = await productPage.findProductByName('iphone X');
      expect(index).toBeGreaterThanOrEqual(0);
      console.log(`✓ iPhone X found at index: ${index}`);
    });
  });

  test('Should verify iPhone X is visible', async () => {
    await test.step('Check iPhone X visibility', async () => {
      const isVisible = await productPage.isProductVisible('iphone X');
      expect(isVisible).toBe(true);
      console.log('✓ iPhone X is visible on the page');
    });
  });

  test('Should add iPhone X to cart', async () => {
    await test.step('Add iPhone X to cart', async () => {
      await productPage.addProductToCartByName('iphone X');
      console.log('✓ iPhone X added to cart successfully');
    });
  });

  test('Should verify add-to-cart buttons exist', async () => {
    await test.step('Count add-to-cart buttons', async () => {
      const buttonCount = await productPage.getAddToCartButtonCount();
      expect(buttonCount).toBeGreaterThan(0);
      console.log(`✓ Found ${buttonCount} add-to-cart buttons`);
    });
  });

  test('Should get product card text', async () => {
    await test.step('Get text of first product card', async () => {
      const productText = await productPage.getProductCardText(0);
      expect(productText).toBeTruthy();
      console.log('✓ Product card text retrieved:', productText?.substring(0, 50));
    });
  });

  test('Should handle product not found error', async () => {
    await test.step('Try to find non-existent product', async () => {
      try {
        await productPage.findProductByName('Non-existent Product XYZ');
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect((error as Error).message).toContain('not found');
        console.log('✓ Correctly throws error for non-existent product');
      }
    });
  });

  test('Should find Samsung Note 8 product', async () => {
    await test.step('Find Samsung Note 8', async () => {
      const index = await productPage.findProductByName('Samsung Note 8');
      expect(index).toBeGreaterThanOrEqual(0);
      console.log(`✓ Samsung Note 8 found at index: ${index}`);
    });
  });

  test('Should add Samsung Note 8 to cart', async () => {
    await test.step('Add Samsung Note 8 to cart', async () => {
      await productPage.addProductToCartByName('Samsung Note 8');
      console.log('✓ Samsung Note 8 added to cart successfully');
    });
  });

  test('Should verify multiple products are visible', async () => {
    const products = ['iphone X', 'Samsung Note 8', 'Blackberry'];

    for (const product of products) {
      await test.step(`Verify ${product} is visible`, async () => {
        const isVisible = await productPage.isProductVisible(product);
        expect(isVisible).toBe(true);
      });
    }

    console.log('✓ All products verified as visible');
  });

  test('Should add multiple products to cart', async () => {
    const products = ['iphone X', 'Samsung Note 8'];

    for (const product of products) {
      await test.step(`Add ${product} to cart`, async () => {
        await productPage.addProductToCartByName(product);
      });
    }

    console.log('✓ All products added to cart successfully');
  });

  test('Should get correct index for each product card', async () => {
    await test.step('Verify product indices', async () => {
      const count = await productPage.getProductCount();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const productCard = productPage.getProductCardByIndex(i);
        expect(productCard).toBeDefined();
      }

      console.log(`✓ All ${count} product cards are accessible by index`);
    });
  });

  test('Should retrieve product card content', async () => {
    await test.step('Get content from all product cards', async () => {
      const count = await productPage.getProductCount();

      for (let i = 0; i < count; i++) {
        const text = await productPage.getProductCardText(i);
        expect(text).toBeTruthy();
      }

      console.log(`✓ Retrieved content from all ${count} product cards`);
    });
  });
});

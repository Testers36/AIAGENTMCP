import { test, expect } from '@playwright/test';

test.describe('Example Tests', () => {
  test('should navigate to example.com', async ({ page }) => {
    // Navigate to example.com
    await page.goto('https://example.com');
    
    // Verify the page title contains "Example"
    await expect(page).toHaveTitle(/Example/);
  });

  test('should display example heading', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Check if the h1 element exists and contains specific text
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Example Domain');
  });

  test('should verify page content', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Check if the paragraph with content exists
    const paragraph = page.locator('p');
    await expect(paragraph).toBeVisible();
    await expect(paragraph).toContainText(/Example Domain/);
  });
});

test.describe('Navigation Tests', () => {
  test('page URL should be correct', async ({ page }) => {
    await page.goto('https://example.com');
    expect(page.url()).toContain('example.com');
  });

  test('should have correct page structure', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Verify basic structure elements exist
    const html = page.locator('html');
    const body = page.locator('body');
    
    await expect(html).toBeVisible();
    await expect(body).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Shopping Flow', () => {
  test('User can view products on home page', async ({ page }) => {
    await page.goto('/');
    // Checks if main content loads
    await expect(page.locator('main')).toBeVisible();
  });

  test('User can navigate to store', async ({ page }) => {
    await page.goto('/store');
    await expect(page.locator('main')).toBeVisible();
  });
  
  test('User can navigate to cart', async ({ page }) => {
    await page.goto('/cart');
    // Assuming 'Cart' text exists
    await expect(page.locator('text=Cart').first()).toBeVisible();
  });
});

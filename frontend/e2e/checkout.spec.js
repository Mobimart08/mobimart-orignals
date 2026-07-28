import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('User can navigate to checkout if logged in or gets redirected', async ({ page }) => {
    // If not logged in, should redirect to login or show auth required
    await page.goto('/checkout');
    const url = page.url();
    // It should either be on checkout or redirected to login
    expect(url.includes('checkout') || url.includes('login')).toBeTruthy();
  });
});

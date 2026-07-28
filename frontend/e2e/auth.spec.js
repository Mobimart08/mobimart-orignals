import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('User can navigate to login page', async ({ page }) => {
    await page.goto('/');
    // Assuming there is a login link in the header
    const loginLink = page.locator('text=Login');
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/.*login/);
    } else {
      await page.goto('/login');
      await expect(page.locator('form')).toBeVisible();
    }
  });

  test('User can navigate to register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('form')).toBeVisible();
  });
});

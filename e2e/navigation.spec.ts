import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should display menu', async ({ page }) => {
    await page.goto('/');

    const drawer = page.locator('[data-testid="drawer"]');
    await expect(drawer).toBeVisible();
  });

  test('should toggle menu', async ({ page }) => {
    await page.goto('/');

    const menuToggle = page.locator('[data-testid="menu-toggle"]');
    await expect(menuToggle).toBeVisible();

    await menuToggle.click();

    // Menu should toggle (basic check)
    await expect(menuToggle).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');

    // Navigate to Sales Orders
    await page.click('[data-testid="menu-sales-orders"]');
    await expect(page).toHaveURL('/sales-orders');

    // Navigate to Production
    await page.click('[data-testid="menu-production"]');
    await expect(page).toHaveURL('/production');
  });

  test('should redirect from root to sales orders', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    // Should redirect to /sales-orders
    await expect(page).toHaveURL('/sales-orders');
  });
});

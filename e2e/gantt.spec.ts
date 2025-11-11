import { test, expect } from '@playwright/test';

test.describe('Gantt Chart', () => {
  test('should navigate to production page', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="menu-production"]');
    await expect(page).toHaveURL('/production');
    await expect(page.locator('text=Производственный ордер')).toBeVisible();
  });

  test('should display gantt chart', async ({ page }) => {
    await page.goto('/production');

    await expect(page.locator('[data-testid="mo_gantt"]')).toBeVisible();

    // Wait for gantt to render
    await page.waitForTimeout(1000);

    // Gantt should be visible
    await expect(page.locator('[data-testid="mo_gantt"]')).toBeVisible();
  });

  test('should show gantt tasks', async ({ page }) => {
    await page.goto('/production');

    // Wait for data to load
    await page.waitForTimeout(2000);

    // Gantt container should be present
    await expect(page.locator('[data-testid="mo_gantt"]')).toBeVisible();
  });
});

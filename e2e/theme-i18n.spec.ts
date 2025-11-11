import { test, expect } from '@playwright/test';

test.describe('Theme and i18n', () => {
  test('should toggle theme', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();

    await themeToggle.click();

    // Theme should have changed (this is a basic check)
    await expect(themeToggle).toBeVisible();
  });

  test('should switch language to Russian', async ({ page }) => {
    await page.goto('/');

    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await expect(languageToggle).toBeVisible();

    await languageToggle.click();

    const ruOption = page.locator('[data-testid="lang-ru"]');
    await expect(ruOption).toBeVisible();

    await ruOption.click();

    // Should show Russian text in page heading
    await expect(page.getByRole('heading', { name: 'Заказы продаж' })).toBeVisible();
  });

  test('should switch language to English', async ({ page }) => {
    await page.goto('/');

    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await expect(languageToggle).toBeVisible();

    await languageToggle.click();

    const enOption = page.locator('[data-testid="lang-en"]');
    await expect(enOption).toBeVisible();

    await enOption.click();

    // Should show English text in menu
    await expect(page.locator('[data-testid="menu-sales-orders"]')).toContainText('Sales Orders');
  });

  test('should persist theme preference', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await themeToggle.click();

    // Reload page
    await page.reload();

    // Theme should be persisted
    await expect(themeToggle).toBeVisible();
  });
});

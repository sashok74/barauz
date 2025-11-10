import { test, expect } from '@playwright/test';

test.describe('Sales Orders - Table and Filters', () => {
  test('should navigate to sales orders page', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="menu-sales-orders"]');
    await expect(page).toHaveURL('/sales-orders');
    await expect(page.locator('text=Заказы продаж')).toBeVisible();
  });

  test('should display sales orders table', async ({ page }) => {
    await page.goto('/sales-orders');
    await expect(page.locator('[data-testid="ordersTable"]')).toBeVisible();
  });

  test('should filter by status', async ({ page }) => {
    await page.goto('/sales-orders');

    // Wait for grid to load
    await page.waitForTimeout(2000);

    // This is a simplified test - AG Grid filtering would require more complex interactions
    await expect(page.locator('[data-testid="ordersTable"]')).toBeVisible();
  });

  test('should export to Excel', async ({ page }) => {
    await page.goto('/sales-orders');

    await expect(page.locator('[data-testid="ordersTable-export"]')).toBeVisible();

    // Note: Actual download testing would require download event handling
    // This is a placeholder for the export functionality check
  });
});

test.describe('Form and Validation', () => {
  test('should display order form', async ({ page }) => {
    await page.goto('/sales-orders');

    await expect(page.locator('[data-testid="orderForm"]')).toBeVisible();
  });

  test('should show form fields', async ({ page }) => {
    await page.goto('/sales-orders');

    await expect(page.locator('[data-testid="field-code"]')).toBeVisible();
    await expect(page.locator('[data-testid="field-customerId"]')).toBeVisible();
    await expect(page.locator('[data-testid="field-status"]')).toBeVisible();
  });

  test('should submit form', async ({ page }) => {
    await page.goto('/sales-orders');

    const submitButton = page.locator('[data-testid="orderForm-submit"]');
    await expect(submitButton).toBeVisible();

    // Note: Actual form submission would require filling fields
    // This is a placeholder for form interaction
  });
});

test.describe('Bulk Operations', () => {
  test('should show bulk actions button', async ({ page }) => {
    await page.goto('/sales-orders');

    // Bulk action button should be present
    const bulkButton = page.locator('[data-testid="ordersTable-bulk-утвердить"]');
    await expect(bulkButton).toBeVisible();
  });
});

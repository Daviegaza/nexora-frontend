import { test, expect } from '@playwright/test';

test('home loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/NEXORA/);
});

test('mobile nav drawer opens', async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) >= 1024, 'desktop has permanent sidebar');
  await page.goto('/');
  await page.getByRole('button', { name: /open navigation menu/i }).click();
  await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
});

import { test, expect } from '@playwright/test';

test.describe('EmpowerChain Loan Cycle', () => {
  test('should navigate to landing page and check for presence of key sections', async ({ page }) => {
    await page.goto('/');
    
    // Check for Hero Section Title
    await expect(page.locator('h1')).toContainText('Fair loans for');
    
    // Check for "Get Started" button
    const getStartedBtn = page.getByRole('link', { name: /Get Started/i });
    await expect(getStartedBtn).toBeVisible();
  });

  test('should navigate to Dashboard and prompt for wallet connection', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should see "Dashboard" or "Welcome"
    await expect(page.locator('h1')).toBeVisible();
    
    // Should see wallet connection prompt
    await expect(page.getByRole('heading', { name: /Connect your wallet/i }).first()).toBeVisible();
  });

  test('should navigate to Learn page and show modules', async ({ page }) => {
    await page.goto('/learn');
    
    // Check for "Financial Literacy Hub"
    await expect(page.getByText(/Financial Literacy Hub/i)).toBeVisible();
    
    // Check for modules
    const modules = page.locator('.rounded-xl');
    await expect(modules.first()).toBeVisible();
  });
});

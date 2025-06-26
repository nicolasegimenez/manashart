const { test, expect } = require('@playwright/test');

test.describe('Manashart User Journey', () => {
  
  test.beforeEach(async ({ page }) => {
    // Start with a fresh session
    await page.goto('http://localhost:8080');
  });

  test('Complete user onboarding flow', async ({ page }) => {
    // 1. User arrives at landing page
    await expect(page.locator('text=Bienvenido al Universo MANASHART')).toBeVisible();
    await expect(page.locator('text=Iniciar Viaje')).toBeVisible();

    // 2. User clicks to connect identity
    await page.click('text=Iniciar Viaje');
    
    // Note: In a real test, this would navigate to Internet Identity
    // For local testing, we'll mock this step
    await page.evaluate(() => {
      // Mock successful authentication
      window.localStorage.setItem('ic-identity', 'mock-identity');
      window.location.reload();
    });

    // 3. User should see the universe view with sacred geometry
    await expect(page.locator('text=Tu Mandala Personal')).toBeVisible();
    
    // 4. Check that SOUL module is unlocked by default
    await expect(page.locator('[data-testid="module-soul"]')).toHaveClass(/unlocked/);
    
    // 5. User navigates to Soul module
    await page.click('text=Soul');
    
    // 6. User should see profile creation form
    await expect(page.locator('text=Create Your Soul Profile')).toBeVisible();
    
    // 7. User creates profile
    await page.fill('input[placeholder="Enter username"]', 'TestUser123');
    await page.click('text=Create Profile');
    
    // 8. User should see their profile
    await expect(page.locator('text=Soul Profile')).toBeVisible();
    await expect(page.locator('text=TestUser123')).toBeVisible();
    await expect(page.locator('text=50/100')).toBeVisible(); // Initial vibration
  });

  test('Project creation workflow', async ({ page }) => {
    // Setup: Mock authenticated user with profile
    await page.evaluate(() => {
      window.localStorage.setItem('ic-identity', 'mock-identity');
      window.localStorage.setItem('user-profile', JSON.stringify({
        username: 'TestUser',
        vibration: 65,
        modules: [
          { name: 'SOUL', enabled: true },
          { name: 'FLOW', enabled: true }
        ]
      }));
    });
    
    await page.reload();

    // 1. Navigate to Flow module
    await page.click('text=Flow');
    
    // 2. Should see project manager
    await expect(page.locator('text=FLOW - Project Manager')).toBeVisible();
    
    // 3. Click to create new project
    await page.click('text=New Project');
    
    // 4. Fill out project form
    await page.fill('input[placeholder="Project Title"]', 'My Music Album');
    await page.fill('textarea[placeholder="Project Description"]', 'An innovative Web3 music album');
    await page.check('input[type="checkbox"]'); // Tokenize project
    
    // 5. Create project
    await page.click('text=Create Project');
    
    // 6. Should see project in list
    await expect(page.locator('text=My Music Album')).toBeVisible();
    await expect(page.locator('text=An innovative Web3 music album')).toBeVisible();
    await expect(page.locator('text=Yes')).toBeVisible(); // Tokenized status
  });

  test('Module unlocking progression', async ({ page }) => {
    // Setup: Mock user with specific vibration level
    await page.evaluate(() => {
      window.localStorage.setItem('ic-identity', 'mock-identity');
      window.localStorage.setItem('user-profile', JSON.stringify({
        username: 'TestUser',
        vibration: 65,
        modules: [
          { name: 'SOUL', enabled: true },
          { name: 'FLOW', enabled: false },
          { name: 'WALLET', enabled: false }
        ]
      }));
    });
    
    await page.reload();

    // 1. Check initial state - FLOW should be unlockable
    await expect(page.locator('[data-testid="module-flow"]')).toHaveClass(/can-unlock/);
    
    // 2. Try to unlock FLOW module (requires 60 Hz, user has 65)
    await page.click('[data-testid="unlock-flow"]');
    
    // 3. Should see success message
    await expect(page.locator('text=FLOW unlocked!')).toBeVisible();
    
    // 4. WALLET should still be locked (requires 65 Hz, user has exactly 65)
    await expect(page.locator('[data-testid="module-wallet"]')).toHaveClass(/can-unlock/);
    
    // 5. Navigate to universe to see updated mandala
    await page.click('text=Universe');
    await expect(page.locator('[data-testid="mandala-flow"]')).toHaveClass(/connected/);
  });

  test('Responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 1. Check that mobile menu works
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    await page.click('[data-testid="mobile-menu-button"]');
    
    // 2. Sidebar should slide in
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    
    // 3. Navigation should work on mobile
    await page.click('text=Soul');
    await expect(page.locator('text=Soul Profile')).toBeVisible();
    
    // 4. Sacred geometry should scale properly
    await page.click('text=Universe');
    const mandala = page.locator('[data-testid="sacred-geometry"]');
    await expect(mandala).toBeVisible();
    
    const boundingBox = await mandala.boundingBox();
    expect(boundingBox.width).toBeLessThan(375); // Should fit in mobile width
  });

  test('Error handling and edge cases', async ({ page }) => {
    // 1. Test without authentication
    await expect(page.locator('text=Conectar')).toBeVisible();
    
    // 2. Test with network errors (mock offline)
    await page.route('**/api/**', route => {
      route.abort();
    });
    
    // Try to connect
    await page.click('text=Conectar');
    
    // Should show error state
    await expect(page.locator('text=Error')).toBeVisible();
    
    // 3. Test form validation
    await page.evaluate(() => {
      window.localStorage.setItem('ic-identity', 'mock-identity');
    });
    await page.reload();
    
    await page.click('text=Soul');
    
    // Try to create profile with empty username
    await page.click('text=Create Profile');
    
    // Should not proceed (form validation)
    await expect(page.locator('text=Create Your Soul Profile')).toBeVisible();
  });

  test('Performance and loading states', async ({ page }) => {
    // 1. Check initial load time
    const startTime = Date.now();
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    
    // 2. Check that loading states are shown
    await page.click('text=Soul');
    
    // Should briefly show loading
    await expect(page.locator('text=Loading')).toBeVisible({ timeout: 1000 });
    
    // 3. Check smooth animations
    await page.click('text=Universe');
    
    // Sacred geometry should be animated
    const mandala = page.locator('[data-testid="sacred-geometry"] circle');
    await expect(mandala).toHaveClass(/animate-pulse/);
  });
});
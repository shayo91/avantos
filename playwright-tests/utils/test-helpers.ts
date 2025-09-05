import { Page, expect } from '@playwright/test';

export class TestHelpers {
  // E2E UI Testing helpers

  static async waitForNetworkIdle(page: Page, timeout = 5000) {
    await page.waitForLoadState('networkidle', { timeout });
  }


  static async verifyNoConsoleErrors(page: Page) {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    return {
      hasErrors: () => errors.length > 0,
      getErrors: () => errors,
    };
  }

  static async measurePageLoadTime(page: Page, url: string): Promise<number> {
    const startTime = Date.now();
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();
    return endTime - startTime;
  }

  static async handleWebkitGraphRendering(page: Page) {
    // Check if we're running in webkit (Safari)
    const browserName = page.context().browser()?.browserType().name();
    
    if (browserName === 'webkit') {
      // Wait for initial load
      await page.waitForLoadState('networkidle');
      
      // Reload the page to fix webkit graph rendering issues
      await page.reload();
      await page.waitForLoadState('networkidle');
    }
  }

}

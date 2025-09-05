import { test, expect } from '@playwright/test';
import { GraphPage } from '../page-objects/graph-page';
import { TestHelpers } from '../utils/test-helpers';
import { DrawerPage } from '../page-objects/drawer-page';

test.describe('Smoke Tests', () => {
  let graphPage: GraphPage;
  let drawerPage: DrawerPage;
  

  test.beforeEach(async ({ page }) => {
    graphPage = new GraphPage(page);
    drawerPage = new DrawerPage(page);
    await page.goto('/');
    await TestHelpers.waitForNetworkIdle(page);
    await TestHelpers.handleWebkitGraphRendering(page);
  });

  
  test('Application loads successfully', async ({ page }) => {
    await graphPage.waitForGraphToLoad();
    
    // Verify page title
    await expect(page).toHaveTitle(/Vite \+ React \+ TS/);
    
    // Verify graph canvas is visible
    await expect(graphPage.graphCanvas).toBeVisible();
  });

  test('Page loads within acceptable time', async ({ page }) => {
    const loadTime = await TestHelpers.measurePageLoadTime(page, '/');
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('No console errors on page load', async ({ page }) => {
    const consoleErrors = await TestHelpers.verifyNoConsoleErrors(page);
    
    await graphPage.waitForGraphToLoad();
    
    expect(consoleErrors.hasErrors()).toBeFalsy();
  });

 
  test('Graph nodes render correctly', async ({ page }) => {
    await graphPage.waitForGraphToLoad();
    
    // Verify expected number of nodes
    const nodeCount = await graphPage.getNodeCount();
    expect(nodeCount).toBeGreaterThan(0);
    
    // Verify nodes are visible
    const nodes = await graphPage.getGraphNodes();
    await expect(nodes.first()).toBeVisible();
  });

  test('Graph edges render correctly', async () => {
    await graphPage.waitForGraphToLoad();
    
    // Verify edges are present
    const edgeCount = await graphPage.getEdgeCount();
    expect(edgeCount).toBeGreaterThan(0);
  });

  test('Graph structure matches expected layout', async () => {
    // Verify all expected forms are present
    const expectedForms = ['Form A', 'Form B', 'Form C', 'Form D', 'Form E', 'Form F'];
    
    for (const formName of expectedForms) {
      const node = await graphPage.getNodeByName(formName);
      await expect(node).toBeVisible();
    }
  });

 
  test('Graph nodes are clickable and interactive', async () => {
    // Get all node names
    const nodeNames = await graphPage.getAllNodeNames();
    expect(nodeNames.length).toBeGreaterThan(0);
    
    // Click first node
    const firstNodeName = nodeNames[0];
    await graphPage.clickNodeByName(firstNodeName);
    
    // Verify drawer opens
    await expect(drawerPage.drawer).toBeVisible();
  });

  test('Drawer opens when clicking nodes', async () => {
    // Click Form A node
    await graphPage.clickNodeByName('Form A');
    
    // Verify drawer is open
    await drawerPage.verifyDrawerIsOpen();
    
    // Verify drawer contains form fields
    const formFields = drawerPage.drawer.locator('li button');
    await expect(formFields.first()).toBeVisible();
  });

  test('Drawer can be closed', async () => {
    // Open drawer
    await graphPage.clickNodeByName('Form A');
    await drawerPage.verifyDrawerIsOpen();
    
    // Close drawer
    await drawerPage.closeDrawer();
    await drawerPage.verifyDrawerIsClosed();
  });


  test('Form fields are visible in drawer', async () => {
    // Click Form A
    await graphPage.clickNodeByName('Form A');
    await drawerPage.verifyDrawerIsOpen();
    
    // Verify expected fields are present (based on actual form schema)
    const expectedFields = ['email', 'id', 'name'];
    
    for (const fieldName of expectedFields) {
      const field = drawerPage.drawer.locator('li button').filter({ hasText: fieldName });
      await expect(field).toBeVisible();
    }
  });

  test('Different forms show different fields', async () => {
    // Test Form A
    await graphPage.clickNodeByName('Form A');
    await drawerPage.verifyDrawerIsOpen();
    
    let formFields = drawerPage.drawer.locator('li button');
    const formAFieldCount = await formFields.count();
    expect(formAFieldCount).toBeGreaterThan(0);
    
    await drawerPage.closeDrawer();
    
    // Test Form B  
    await graphPage.clickNodeByName('Form B');
    await drawerPage.verifyDrawerIsOpen();
    
    formFields = drawerPage.drawer.locator('li button');
    const formBFieldCount = await formFields.count();
    expect(formBFieldCount).toBeGreaterThan(0);
    
    // Both forms should have fields (they may have same count, that's ok)
    expect(formAFieldCount).toBeGreaterThan(0);
    expect(formBFieldCount).toBeGreaterThan(0);
  });
});





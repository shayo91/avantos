import { test, expect } from '@playwright/test';
import { GraphPage } from '../page-objects/graph-page';
import { DrawerPage } from '../page-objects/drawer-page';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Field Mapping Tests', () => {
  let graphPage: GraphPage;
  let drawerPage: DrawerPage;

  test.beforeEach(async ({ page }) => {
    graphPage = new GraphPage(page);
    drawerPage = new DrawerPage(page);
    await graphPage.goto();
    await TestHelpers.handleWebkitGraphRendering(page);
    await graphPage.waitForGraphToLoad();
  });


  test('Can view form fields in drawer', async ({ page }) => {
    // Open Form D which has multiple fields
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    // Verify drawer shows correct form title
    await drawerPage.verifyDrawerContent('Form D', [
      'dynamic_checkbox_group',
      'dynamic_object', 
      'email',
      'id',
      'name'
    ]);
  });

  test('Field mapping configuration shows correct field types', async ({ page }) => {
    // Open Form D drawer
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    // Verify different field types are displayed correctly
    await drawerPage.verifyFieldExists('dynamic_checkbox_group');
    await drawerPage.verifyFieldExists('dynamic_object');
    await drawerPage.verifyFieldExists('email');
    await drawerPage.verifyFieldExists('id');
    await drawerPage.verifyFieldExists('name');
  });

  test('Field mapping modal opens and closes correctly', async ({ page }) => {
    // Open Form D drawer
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    // Click on a field to open mapping modal
    await drawerPage.clickFormField('email');
    await drawerPage.waitForMappingModal();
    
    // Close modal
    await drawerPage.closeMappingModal();
  });

  test('Opens modal for fields without configuration', async ({ page }) => {
    // Open Form D drawer
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    // Click on a field that has no configuration
    await drawerPage.clickFormField('email');
    
    // Verify mapping modal opens
    await drawerPage.waitForMappingModal();
    
    // Verify modal shows available data sources
    await expect(drawerPage.mappingModal.getByText('Form B')).toBeVisible(); // Direct dependency
    await expect(drawerPage.mappingModal.getByText('Form A')).toBeVisible(); // Transitive dependency
    await expect(drawerPage.mappingModal.getByText('Global Node 1')).toBeVisible(); // Global data
  });

 
  test('Can create field mapping from global data', async ({ page }) => {
    // Open Form A drawer
    await graphPage.clickNodeByName('Form A');
    await drawerPage.waitForDrawerToOpen();
    
    // Create mapping from global data
    await drawerPage.createFieldMapping('email', 'Global Node 1', 'email');
    
    // Verify mapping was created
    await drawerPage.verifyFieldHasMapping('email', 'Global Node 1', 'email');
  });

  test('Can create field mapping from direct predecessor', async ({ page }) => {
  
    // Open Form D drawer
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    // Create mapping for email field from Form B (direct predecessor)
    await drawerPage.createFieldMapping('email', 'Form B', 'email');
    
    // Verify mapping was created
    await drawerPage.verifyFieldHasMapping('email', 'Form B', 'email');
  });

  test('Can create transitive dependency mapping (Form A to Form D)', async ({ page }) => {
    // Open Form D drawer
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    // Create mapping from Form A (transitive dependency through Form B)
    await drawerPage.createFieldMapping('email', 'Form A', 'email');
    
    // Verify transitive mapping was created
    await drawerPage.verifyFieldHasMapping('email', 'Form A', 'email');
  });

  test('Can remove field mapping', async ({ page }) => {
    // Open Form D drawer
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    // Create a mapping first
    await drawerPage.createFieldMapping('email', 'Form A', 'email');
    await drawerPage.verifyFieldHasMapping('email', 'Form A', 'email');
    
    // Remove the mapping
    await drawerPage.removeFieldMappingAndVerify('email', 'Form A', 'email');
  });

  test('Can clear field configuration with X button', async ({ page }) => {
    // Open Form D drawer
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    // Create a mapping first
    await drawerPage.createFieldMapping('email', 'Form A', 'email');
    await drawerPage.verifyFieldHasMapping('email', 'Form A', 'email');
    
    // Clear the mapping using X button (same as remove functionality)
    await drawerPage.removeFieldMappingAndVerify('email', 'Form A', 'email');
  });

 
  test('Can configure multiple field mappings', async ({ page }) => {
    // Open Form D drawer
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    // Create multiple mappings
    await drawerPage.createFieldMapping('email', 'Form A', 'email');
    await drawerPage.createFieldMapping('dynamic_object', 'Global Node 1', 'email');
    
    // Verify both mappings exist
    await drawerPage.verifyFieldHasMapping('email', 'Form A', 'email');
    await drawerPage.verifyFieldHasMapping('dynamic_object', 'Global Node 1', 'email');
  });

  test('Can distinguish between three data source types', async ({ page }) => {
    // Open Form D drawer (has access to all 3 data source types)
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    // Test direct dependency (Form B)
    await drawerPage.createFieldMapping('email', 'Form B', 'email');
    await drawerPage.verifyFieldHasMapping('email', 'Form B', 'email');
    
    // Test transitive dependency (Form A)
    await drawerPage.createFieldMapping('id', 'Form A', 'id');
    await drawerPage.verifyFieldHasMapping('id', 'Form A', 'id');
    
    // Test global data
    await drawerPage.createFieldMapping('name', 'Global Node 1', 'name');
    await drawerPage.verifyFieldHasMapping('name', 'Global Node 1', 'name');
  });

  test('Can navigate between different data source types', async ({ page }) => {
    // Open Form D drawer (has both direct and transitive predecessors)
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    // Test selecting from different source types
    await drawerPage.createFieldMapping('email', 'Form B', 'email'); // From Form B
    await drawerPage.verifyFieldHasMapping('email', 'Form B', 'email');

    await drawerPage.createFieldMapping('name', 'Global Node 1', 'name'); // From Global Node 1
    await drawerPage.verifyFieldHasMapping('name', 'Global Node 1', 'name');

    await drawerPage.createFieldMapping('id', 'Form A', 'id'); // From Form A
    await drawerPage.verifyFieldHasMapping('id', 'Form A', 'id');
  });

  test('Mapping persists across drawer sessions', async ({ page }) => {
    // Open Form D drawer and create mapping
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    await drawerPage.createFieldMapping('email', 'Form A', 'email');
    
    // Close drawer
    await drawerPage.closeDrawer();
    
    // Reopen drawer
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    // Verify mapping still exists
    await drawerPage.verifyFieldHasMapping('email', 'Form A', 'email');
  });


  test('Supports multiple data source combinations', async ({ page }) => {
    // Open Form D drawer
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    // Create mappings from all three data source types simultaneously
    await drawerPage.createFieldMapping('email', 'Form B', 'email'); // Direct
    await drawerPage.createFieldMapping('id', 'Form A', 'id'); // Transitive
    await drawerPage.createFieldMapping('name', 'Global Node 1', 'name'); // Global
    
    // Verify all mappings coexist
    await drawerPage.verifyFieldHasMapping('email', 'Form B', 'email');
    await drawerPage.verifyFieldHasMapping('id', 'Form A', 'id');
    await drawerPage.verifyFieldHasMapping('name', 'Global Node 1', 'name');
  });

  test('Validates traversal for dependencies', async ({ page }) => {
    // Test that Form C can access Form A fields (transitive through Form B)
    await graphPage.clickNodeByName('Form E');
    await drawerPage.waitForDrawerToOpen();
    
    // Should be able to map from Form A (transitive dependency)
    await drawerPage.createFieldMapping('email', 'Form A', 'email');
    await drawerPage.verifyFieldHasMapping('email', 'Form A', 'email');
    
    // Should be able to map from Form B (direct dependency)
    await drawerPage.createFieldMapping('name', 'Form C', 'name');
    await drawerPage.verifyFieldHasMapping('name', 'Form C', 'name');
  });

  test('Handles complex structure correctly', async ({ page }) => {
    // Test that it correctly identifies all available data sources
   
    
    // Form A should only have global data available (no predecessors)
    await graphPage.clickNodeByName('Form A');
    await drawerPage.waitForDrawerToOpen();
    
    await drawerPage.clickFormField('email');
    await drawerPage.waitForMappingModal();
    
    // Should see global data but not other forms
    let fieldNames = await drawerPage.getAllFormFieldNames();
    expect(fieldNames).toContain('Global Node 1');
    expect(fieldNames).toContain('Global Node 2');
    expect(fieldNames).not.toContain('Form A');
    expect(fieldNames).not.toContain('Form B');
    
    await drawerPage.closeMappingModal();
    
    // Form D should have access to Form A, Form B, and Global data
    await graphPage.clickNodeByName('Form D');
    await drawerPage.waitForDrawerToOpen();
    
    await drawerPage.clickFormField('email');
    await drawerPage.waitForMappingModal();
    
    // Should see all available data sources
    fieldNames = await drawerPage.getAllFormFieldNames();
    expect(fieldNames).toContain('Form A'); // Transitive
    expect(fieldNames).toContain('Form B'); // Direct
    expect(fieldNames).toContain('Global Node 1'); // Global
  });

});

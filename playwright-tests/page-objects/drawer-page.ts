import { Page, Locator, expect } from '@playwright/test';

export class DrawerPage {
  readonly page: Page;
  readonly drawer: Locator;
  readonly drawerTitle: Locator;
  readonly drawerCloseButton: Locator;
  readonly formFields: Locator;
  readonly mappingModal: Locator;
  readonly mappingModalFields: Locator;

  constructor(page: Page) {
    this.page = page;
    this.drawer = page.locator('div[id="#«rm»"], [role="dialog"][aria-modal="true"]'); //[role="dialog"]
    this.drawerCloseButton = page.getByLabel('Close');
    this.drawerTitle = page.locator('[role="dialog"] heading');
    this.formFields = page.locator('[role="dialog"] li button');
    this.mappingModal = this.drawer.filter({ hasText: 'Select mapping for' });
    this.mappingModalFields = this.mappingModal.locator('span[data-slot="title"]');
  }

  async waitForDrawerToOpen() {
    await expect(this.drawer).toBeVisible();
  }

  async closeDrawer() {
    await this.drawerCloseButton.click();
    await expect(this.drawer).not.toBeVisible();
  }

  async getFormFields() {
    return this.formFields.all();
  }

  async getAllFormFieldNames(): Promise<string[]> {
    const fields = await this.mappingModalFields.all();
    const fieldNames = await Promise.all(
      fields.map(async field => {
        const text = await field.textContent();
        return text?.trim() || '';
      })
    );
    return fieldNames.filter(name => name.length > 0);
  }

  async clickFormField(fieldName: string) {
    // Find form field button by its text content
    const field = this.page.getByRole('button', { name: fieldName });
    await expect(field).toBeVisible();
    await field.click();
  }

  async verifyFieldExists(fieldName: string) {
    const field = this.formFields.filter({ hasText: fieldName });
    await expect(field).toBeVisible();
  }

  async verifyDrawerContent(expectedTitle: string, expectedFields: string[]) {
    // Verify drawer is open
    await expect(this.drawer).toBeVisible();
    
    // Verify expected fields are present by checking button text
    for (const fieldName of expectedFields) {
      const field = this.formFields.filter({ hasText: fieldName });
      await expect(field).toBeVisible();
    }
  }

  async verifyDrawerIsOpen() {
    await expect(this.drawer).toBeVisible();
  }

  async verifyDrawerIsClosed() {
    await expect(this.drawer).not.toBeVisible();
  }

  // Field mapping methods
  async createFieldMapping(fieldName: string, sourceNode: string, targetField: string) {
    // Click on the field to open mapping modal
    await this.clickFormField(fieldName);
    await this.mappingModal.waitFor();
    
    // Select the source node
    await this.clickFormField(sourceNode);
    
    // Select the target field
    await this.clickFormField(targetField);
    
    // Add the mapping
    await this.addMapping();
  }

  async waitForMappingModal() {
    await this.mappingModal.waitFor();
  }

  async closeMappingModal() {
    await this.drawerCloseButton.click();
    await expect(this.drawer).not.toBeVisible();
  }

 

  async addMapping() {
    // Click the Select button to confirm the mapping
    const selectButton = this.page.getByRole('button', { name: 'Select', exact: true });
    await expect(selectButton).toBeEnabled();
    await selectButton.click();
    
  }

  async verifyFieldHasMapping(fieldName: string, sourceNode: string, targetField: string) {
    // Verify the exact mapping text format
    const expectedMappingText = `${fieldName}: ${sourceNode}.${targetField}`;
    await expect(this.page.getByText(expectedMappingText)).toBeVisible();
  }

  async removeFieldMappingAndVerify(fieldName: string, sourceNode: string, targetField: string) {
    // Click on the field that has a mapping (identified by the mapping text)
    const expectedMappingText = `${fieldName}: ${sourceNode}.${targetField}`;
    const fieldWithMapping = this.page.getByRole('listitem').filter({ hasText: expectedMappingText });
    await expect(fieldWithMapping).toBeVisible();
   
    
    // Wait for mapping modal
    await this.drawer.waitFor();
    
    // Look for and click remove/clear button
    const removeButton = fieldWithMapping.getByRole('button').first();
    await removeButton.click();
    
    // Verify mapping is removed (field should no longer be visible)
    await expect(fieldWithMapping).not.toBeVisible();
  }
}

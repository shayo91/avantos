import { test, expect } from '@playwright/test';

test.describe('Frontend Server API Tests', () => {
  const mockServerUrl = 'http://localhost:3000';

  test.describe('Direct Mock Server API Tests', () => {
   
    test('Mock server returns valid graph data structure', async ({ request }) => {
      const response = await request.get(`${mockServerUrl}/api/v1/test-tenant/actions/blueprints/test-blueprint/graph`);
      
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
      expect(response.headers()['access-control-allow-origin']).toBe('*');
      
      const data = await response.json();
      
      // Verify response structure
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('tenant_id');
      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('nodes');
      expect(data).toHaveProperty('edges');
      expect(data).toHaveProperty('forms');
      expect(Array.isArray(data.nodes)).toBeTruthy();
      expect(Array.isArray(data.edges)).toBeTruthy();
      expect(Array.isArray(data.forms)).toBeTruthy();
    });

    test('Mock server returns 404 for invalid endpoints', async ({ request }) => {
      const response = await request.get(`${mockServerUrl}/invalid/endpoint`);
      
      expect(response.status()).toBe(404);
      expect(response.headers()['content-type']).toContain('application/json');
      
      const data = await response.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Resource not found!');
    });

    test('Mock server only accepts GET requests', async ({ request }) => {
      const endpoint = `${mockServerUrl}/api/v1/test-tenant/actions/blueprints/test-blueprint/graph`;
      
      // Test POST request
      const postResponse = await request.post(endpoint);
      expect(postResponse.status()).toBe(404);
      
      // Test PUT request  
      const putResponse = await request.put(endpoint);
      expect(putResponse.status()).toBe(404);
      
      // Test DELETE request
      const deleteResponse = await request.delete(endpoint);
      expect(deleteResponse.status()).toBe(404);
    });

  
    test('Graph data contains expected node structure', async ({ request }) => {
      const response = await request.get(`${mockServerUrl}/api/v1/test-tenant/actions/blueprints/test-blueprint/graph`);
      const data = await response.json();
      
      // Should have at least one node
      expect(data.nodes.length).toBeGreaterThan(0);
      
      // Verify each node has required properties
      data.nodes.forEach((node: any) => {
        expect(node).toHaveProperty('id');
        expect(node).toHaveProperty('type');
        expect(node).toHaveProperty('position');
        expect(node).toHaveProperty('data');
        expect(node.data).toHaveProperty('name');
        expect(node.data).toHaveProperty('component_type');
        expect(node.data).toHaveProperty('prerequisites');
      });
    });

    test('Forms data contains expected structure', async ({ request }) => {
      const response = await request.get(`${mockServerUrl}/api/v1/test-tenant/actions/blueprints/test-blueprint/graph`);
      const data = await response.json();
      
      // Should have at least one form
      expect(data.forms.length).toBeGreaterThan(0);
      
      // Verify each form has required properties
      data.forms.forEach((form: any) => {
        expect(form).toHaveProperty('id');
        expect(form).toHaveProperty('name');
        expect(form).toHaveProperty('field_schema');
        expect(form).toHaveProperty('ui_schema');
        expect(form.field_schema).toHaveProperty('properties');
        
        // Verify field schema has expected fields
        const properties = form.field_schema.properties;
        expect(properties).toHaveProperty('email');
        expect(properties).toHaveProperty('id');
        expect(properties).toHaveProperty('name');
      });
    });
  });
});
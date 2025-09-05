import { Page, Locator, expect } from '@playwright/test';

export class GraphPage {
  readonly page: Page;
  readonly graphCanvas: Locator;
  readonly loader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.graphCanvas = page.locator('[data-testid="rf__wrapper"], .react-flow');
    this.loader = page.locator('[data-testid="loader"]'); // There is a loader but it has some generic class. This is an example. The tedid should be added to loader
  }

  async goto() {
    await this.page.goto('/');
  }

  async waitForGraphToLoad() {
    await expect(this.graphCanvas).toBeVisible();
    await expect(this.loader).not.toBeVisible();
  }

  async getGraphNodes() {
    return this.page.locator('.react-flow__node');
  }


  async getGraphEdges() {
    return this.page.locator('.react-flow__edge');
  }


  async getNodeCount() {
    const nodes = await this.getGraphNodes();
    return nodes.count();
  }

  async getEdgeCount() {
    const edges = await this.getGraphEdges();
    return edges.count();
  }



 
  async getNodeByName(nodeName: string) {
    // Find node by its displayed name in the node content
    return this.page.locator('.react-flow__node').filter({ hasText: nodeName }).first();
  }

  async clickNodeByName(nodeName: string) {
    const node = await this.getNodeByName(nodeName);
    await expect(node).toBeVisible();
    await node.scrollIntoViewIfNeeded();
    await node.click({ force: true });
  }

  async getAllNodeNames(): Promise<string[]> {
    const nodes = this.page.locator('.react-flow__node');
    const count = await nodes.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await nodes.nth(i).textContent();
      if (text) names.push(text.trim());
    }
    return names;
  }


}

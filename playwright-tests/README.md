# Playwright Test Suite

This test suite provides comprehensive end-to-end testing for the React graph visualization application using Playwright with the Page Object Model pattern.

## 🚀 How to Run Tests

### Prerequisites
Before running tests, you need to start both the application and the mock server:

1. **Start the React application in development mode:**
   ```bash
   npm run dev
   ```

2. **Start the frontend challenge server (mock API):**
   ```bash
   npm run mock-server
   ```
   
   *Note: The frontend mock server project has been cloned into the avantos project directory (`/frontendchallengeserver`) to keep all components in one place for easier development and testing.*

### Running Tests
Once both services are running, execute the tests:

```bash
# Run all tests
npm run test:e2e

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# View test report
npm run test:e2e:report
```

## 🛠️ Framework & Architecture

### Technology Stack
- **Playwright**: Modern end-to-end testing framework
- **Page Object Model (POM)**: Organized test structure with reusable page components
- **Test Helpers**: Utility functions for common testing operations

### Configuration
Test settings can be customized in `playwright.config.ts`:
- **Workers**: Adjust parallel test execution
- **Projects**: Configure different browsers (Chromium, Firefox, Safari)
- **Timeouts**: Set global and test-specific timeouts
- **Base URL**: Configure application URL
- **Screenshots & Videos**: Control capture settings

**Note**: When running tests with WebKit (Safari), graph nodes may render incorrectly on initial load. The test suite includes an automatic `page.reload()` fix in the `handleWebkitGraphRendering()` helper function to resolve this browser-specific rendering issue. Also some rendering issues are present on Safari when clicking the node.

### Project Structure
```
playwright-tests/
├── page-objects/          # Page Object Model classes
│   ├── drawer-page.ts     # Drawer/modal interactions
│   └── graph-page.ts      # Graph canvas interactions
├── tests/                 # Test specifications
│   ├── api.spec.ts        # API endpoint tests
│   ├── basic-smoke.spec.ts # Core functionality tests
│   └── field-mapping.spec.ts # Field mapping feature tests
├── utils/                 # Test utilities
│   └── test-helpers.ts    # Common helper functions
└── README.md             # This file
```

## 📋 Test Categories

### 1. API Tests (`api.spec.ts`)
- **Basic API Connectivity**: Validates mock server responses and headers
- **Data Structure Validation**: Ensures correct graph data format and schema compliance
- Tests endpoints: `/api/v1/test-tenant/actions/blueprints/test-blueprint/graph`

### 2. Smoke Tests (`basic-smoke.spec.ts`)
- **Basic Application Tests**: Page loading, performance, and console error validation
- **Graph Rendering Tests**: Node and edge visualization, layout verification
- **Basic Interaction Tests**: Node clicking, drawer opening/closing
- **Form Field Tests**: Field visibility and form-specific content validation

### 3. Field Mapping Tests (`field-mapping.spec.ts`)
Testing of the field mapping functionality:
- Form field display and modal interactions
- Field type validation and UI responsiveness

- Global data mapping
- Direct predecessor mapping
- Transitive dependency mapping
- Field mapping removal and clearing

- Multiple field mappings
- Data source type differentiation
- Cross-session mapping persistence

- Complex DAG structure handling
- Multi-source data combinations
- Dependency traversal validation

## 📊 Reporting & Debugging

### HTML Reporter
The test suite includes a comprehensive HTML reporter with:
- **Test Results**: Pass/fail status with execution times
- **Screenshots**: Automatic capture on test failures
- **Videos**: Full test execution recordings on failures
- **Trace Files**: Detailed execution traces for debugging
- **Console Logs**: Browser console output capture

### Viewing Reports
```bash
npm run test:e2e:report
```
This opens an interactive HTML report at `http://localhost:9323` with:
- Test execution timeline
- Failure screenshots and videos
- Detailed error messages and stack traces
- Network activity logs

## 🔧 Maintenance

- **Page Objects**: Update selectors and methods when UI changes
- **Test Data**: Modify test scenarios in individual spec files
- **Configuration**: Adjust settings in `playwright.config.ts`
- **Utilities**: Extend helper functions in `test-helpers.ts`

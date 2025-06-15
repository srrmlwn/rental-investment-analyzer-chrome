# Rental Investment Analyzer - Technical Architecture

## Overview
The Rental Investment Analyzer is a Chrome extension that helps real estate investors analyze rental properties directly on Zillow listings. The extension provides real-time investment metrics and allows users to customize their analysis parameters.

## Core Components

### 1. Content Script (`content.tsx`)
- Injects the React application into Zillow listing pages
- Handles page navigation and reinjection
- Manages the extension's lifecycle on the page
- Uses MutationObserver to detect SPA navigation
- Extracts property data using DataExtractionService

### 2. Investment Analysis Panel (`investment-analysis-panel.tsx`)
- Main component for displaying investment analysis
- Layout Structure:
  1. Key Metrics (sticky at top)
     - Stays visible while scrolling
     - Transitions to compact view when scrolled
     - Monthly Cash Flow (green/red)
     - Cap Rate (blue)
     - Cash-on-Cash Return (purple)
     - Annual Cash Flow (green/red)
  2. Scrollable Content
     - Property Information
       - Expandable section
       - Property details
       - Rental estimates
     - Investment Parameters
       - Quick adjustments
       - Advanced settings
- Features:
  - Sticky metrics with smooth transitions
  - Independent scrollable content
  - Responsive grid layout
  - Real-time updates
  - Error handling
- State Management:
  - Property data
  - Calculation inputs
  - Calculated metrics
  - Compact view state
  - Property info expansion state

### 3. Config Panel (`config-panel.tsx`)
- Displays and manages user input fields
- Two sections:
  1. Quick Adjustments
     - Purchase Price
     - Down Payment
     - Interest Rate
     - Loan Term
     - Property Management
  2. Advanced Settings
     - Closing Costs
     - Rehab Costs
     - After Repair Value
     - Vacancy Rate
     - Other Income
     - Maintenance Rate
     - Insurance Rate
- Uses UserParams for parameter management
- Real-time validation and updates

## Data Model

### 1. Property Data (`src/types/propertyData.ts`)
```typescript
interface PropertyData {
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  zipCode: string;
  rentZestimate?: number;
  propertyTaxes?: number;
  hoaFees?: number;
}
```

### 2. Calculation Inputs (`src/types/calculationInputs.ts`)
```typescript
interface CalculationInputs {
  // Purchase Parameters
  purchasePrice: number;
  closingCosts: number;
  rehabCosts: number;
  afterRepairValue: number;
  
  // Loan Parameters
  downPaymentPercentage: number;
  interestRate: number;
  loanTerm: number;
  
  // Operating Expenses
  managementRate: number;
  maintenanceRate: number;
  insuranceRate: number;
  propertyTaxes: number;
  hoaFees: number;
  vacancyRate: number;
  
  // Income Parameters
  rentEstimate: number;
  otherIncome: number;
}
```

### 3. Config Parameter (`src/types/configTypes.ts`)
```typescript
type ConfigParameterType = 'percentage' | 'currency' | 'number';
type ConfigCategory = 'Purchase' | 'Loan' | 'Income' | 'Operating';

interface ConfigParameter {
  id: string;
  label: string;
  category: ConfigCategory;
  type: ConfigParameterType;
  description: string;
  step?: number;
  unit?: string;
  isAdvanced?: boolean;
  useSlider: boolean;
  getMin: () => number;
  getMax: () => number;
}
```

## Data Flow & State Management

### Content Script Architecture
The content script (`src/content/content.tsx`) manages the extension's lifecycle and state:

1. **Initialization**: Injects React components into Zillow pages
2. **SPA Navigation Detection**: Monitors navigation using multiple strategies:
   - URL change detection with listing ID extraction
   - MutationObserver for DOM changes
   - History API interception (pushState/replaceState)
   - Popstate event handling for browser back/forward
3. **Forced Page Reload**: When navigating to new listings, forces a full page reload to get fresh `__NEXT_DATA__`
4. **State Synchronization**: Uses custom events to notify components of state changes

### SPA Navigation Handling
Due to Zillow's SPA architecture, the `__NEXT_DATA__` script tag doesn't update when navigating between listings. The extension implements a forced reload strategy:

1. **Navigation Detection**: When URL changes, extract listing ID and compare with previous
2. **Reload Trigger**: If listing ID changes, force a full page reload with `ria_force_reload=1` parameter
3. **Auto-Open Sidebar**: If sidebar was open, add `ria_auto_open=1` parameter to reopen after reload
4. **URL Cleanup**: Remove parameters after reload to prevent infinite loops

### Timing & Performance
- **Debounce**: 500ms debounce prevents excessive processing during rapid navigation
- **Auto-Open Delay**: 1 second delay ensures page is fully loaded before opening sidebar
- **Event-Driven**: No polling - uses MutationObserver and History API for real-time detection

## Key Features

### 1. Real-time Analysis
- Instant metric updates as users adjust inputs
- Color-coded metrics for quick interpretation
- Responsive layout for all screen sizes

### 2. Parameter Management
- Dynamic min/max values based on property data
- Categorized parameters (basic/advanced)
- Input validation with user feedback
- Automatic reset on new listings

### 3. Error Handling
- Graceful handling of missing property data
- Input validation with user feedback
- Fallback UI states for loading/errors

## Technical Decisions

### 1. React + TypeScript
- Type safety for data models
- Component-based architecture
- Efficient state management

### 2. Tailwind CSS + Shadcn UI
- Utility-first styling
- Responsive design
- Consistent visual language
- Accessible components

### 3. Chrome Extension Architecture
- Content script injection
- SPA navigation handling
- Cross-origin communication

## Project Structure
```
rental-investment-analyzer/
├── src/
│   ├── manifest.json           # Chrome extension manifest
│   ├── content/               # Content scripts
│   │   ├── content.tsx        # Main content script
│   │   └── styles.css         # Content styles
│   ├── components/            # React components
│   │   ├── investment/        # Investment analysis
│   │   │   ├── config-panel.tsx
│   │   │   └── investment-analysis-panel.tsx
│   │   ├── ui/               # Shared UI components
│   │   │   ├── slider.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   └── sidebar/          # Sidebar components
│   ├── constants/            # Constants and configs
│   │   └── userParams.ts     # Parameter definitions
│   ├── types/               # TypeScript types
│   │   ├── propertyData.ts
│   │   ├── calculationInputs.ts
│   │   └── configTypes.ts
│   └── services/            # Business logic
│       ├── calculator.ts     # Investment calculations
│       └── dataExtractionService.ts  # Zillow page parsing
```

## Component Architecture

### 1. Content Script Layer
```javascript
// content.js
class ZillowContentScript {
    constructor() {
        this.sidebar = new SidebarManager();
        this.dataExtractionService = new DataExtractionService();
        this.propertyAnalyzer = new PropertyAnalyzer();
    }

    async initialize() {
        // Inject sidebar
        // Extract property data
        // Perform initial analysis
    }
}
```

### 2. Data Extraction Layer
```javascript
// dataExtractionService.js
class DataExtractionService {
    async extractPropertyData() {
        return {
            price: this.extractPrice(),
            bedrooms: this.extractBedrooms(),
            bathrooms: this.extractBathrooms(),
            propertyType: this.extractPropertyType(),
            // ... other properties
        };
    }

    async getRentalEstimate() {
        // Try Zestimate first
        // Fallback to HUD data
    }
}
```

### 3. Business Logic Layer
```javascript
// propertyAnalyzer.js
class PropertyAnalyzer {
    calculateCashFlow(propertyData, config) {
        const monthlyRent = this.getMonthlyRent(propertyData);
        const monthlyExpenses = this.calculateMonthlyExpenses(propertyData, config);
        const monthlyMortgage = this.calculateMortgage(propertyData, config);
        
        return {
            monthly: monthlyRent - monthlyExpenses - monthlyMortgage,
            annual: (monthlyRent - monthlyExpenses - monthlyMortgage) * 12
        };
    }
}
```

### 4. Configuration Management
```javascript
// configManager.js
class ConfigManager {
    async getDefaultConfig() {
        return chrome.storage.sync.get('defaultConfig');
    }

    async saveDefaultConfig(config) {
        return chrome.storage.sync.set({ defaultConfig: config });
    }
}
```

## Data Management

### 1. HUD Data Integration
- **Data Format**: JSON (processed from CSV/Excel)
- **Storage**: Bundled with extension
- **Structure**:
  ```javascript
  {
    "zip_codes": {
      "12345": {
        "average_rent": 2000,
        "bedroom_breakdown": {
          "1": 1500,
          "2": 2000,
          "3": 2500,
          "4": 3000
        },
        "last_updated": "2024-03-01"
      }
      // ... other zip codes
    }
  }
  ```
- **Processing**:
  - CSV/Excel data will be pre-processed into optimized JSON
  - Data will be indexed by zip code for fast lookups
  - Include bedroom-specific rental data where available
  - Include last updated date for data freshness

### 2. Data Flow Updates
```
Get Rental Estimate
→ Try Zestimate
→ If Unavailable → Lookup HUD Data by Zip Code
→ Update UI with Source
```

### 3. Performance Optimizations
- Pre-process HUD data into optimized JSON format
- Index data by zip code for O(1) lookups
- Load data lazily when needed
- Cache frequently accessed zip codes

## Data Flow

1. **Page Load**
   ```
   Zillow Page Load
   → Content Script Initializes
   → Inject Sidebar
   → Extract Property Data
   → Get Rental Estimate
   → Calculate Cash Flow
   → Update UI
   ```

2. **Configuration Update**
   ```
   User Updates Config
   → Update Local State
   → Recalculate Cash Flow
   → Update UI
   → (If Save as Default) → Save to Chrome Storage
   ```

3. **Rental Estimate Flow**
   ```
   Get Rental Estimate
   → Try Zestimate
   → If Unavailable → Lookup HUD Data by Zip Code
   → Update UI with Source
   ```

## API Integration

### 1. Chrome Storage API
- Used for: Default configurations
- Scope: Sync storage for user preferences
- Structure:
  ```javascript
  {
    defaultConfig: {
      downPayment: 20,
      mortgageRate: 6.5,
      propertyManagement: 10,
      maintenance: 1,
      vacancyRate: 10
    }
  }
  ```

## Security Considerations

1. **Data Handling**
   - No sensitive data storage
   - All calculations done client-side
   - Minimal data persistence (only user preferences)

2. **API Security**
   - API keys stored in extension
   - Rate limiting implemented
   - Error handling for API failures

3. **Content Security**
   - Strict CSP in manifest
   - Sanitized DOM manipulation
   - Isolated storage

## Performance Considerations

1. **Optimizations**
   - Lazy loading of sidebar
   - Debounced calculations
   - Cached API responses
   - Efficient DOM updates

2. **Resource Usage**
   - Minimal memory footprint
   - Efficient event listeners
   - Cleanup on page unload

## Testing Strategy

1. **Unit Tests**
   - Business logic
   - Data extraction
   - Configuration management
   - Utility functions

2. **Integration Tests**
   - End-to-end flows
   - API integration
   - Storage operations

3. **UI Tests**
   - Sidebar rendering
   - User interactions
   - Responsive design

## Development Workflow

1. **Local Development**
   - Chrome extension development mode
   - Hot reloading
   - DevTools debugging

2. **Build Process**
   - Webpack for bundling
   - Babel for transpilation
   - ESLint for code quality
   - Jest for testing

3. **Deployment**
   - Chrome Web Store submission
   - Version management
   - Update process

## Next Steps

1. **Immediate**
   - Set up project structure
   - Create manifest.json
   - Implement basic sidebar
   - Set up build process
   - Process HUD data into JSON format

2. **After Sample HTML**
   - Implement data extraction
   - Create selectors
   - Test parsing logic
   - Implement HUD data lookup
   - Refine architecture if needed

3. **Following**
   - Implement business logic
   - Add configuration management
   - Set up testing
   - Prepare for deployment 
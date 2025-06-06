# Rental Investment Analyzer - Technical Architecture

## Overview
The Rental Investment Analyzer is a Chrome extension that helps real estate investors analyze rental properties directly on Zillow listings. The extension provides real-time investment metrics and allows users to customize their analysis parameters.

## Core Components

### 1. Content Script (`content.ts`)
- Injects the React application into Zillow listing pages
- Handles communication between the extension and the webpage
- Manages the extension's lifecycle on the page

### 2. App Component (`app.tsx`)
- Root component that renders the main UI
- Manages the extension's state and routing
- Handles communication with the content script

### 3. Investment Analysis Panel (`investment-analysis-panel.tsx`)
- Main component for displaying investment analysis
- Layout Structure:
  1. Key Metrics (top)
     - Monthly Cash Flow (green/red)
     - Cap Rate (blue)
     - Cash-on-Cash Return (purple)
     - Annual Cash Flow (green/red)
  2. Investment Summary
     - Monthly Mortgage
     - Effective Rent
     - Property Details
  3. User Inputs Panel (bottom)
- Manages state for:
  - Property data
  - User calculation inputs
  - Calculated metrics
- Subscribes to ConfigManager for real-time updates

### 4. User Inputs Panel (`config-panel.tsx`)
- Displays and manages user input fields
- Organized by categories:
  - Purchase Parameters
  - Loan Parameters
  - Operating Expenses
  - Growth Assumptions
- Uses ConfigManager for persistence

## Data Model

### 1. Property Data (`src/types/propertyData.ts`)
```typescript
interface PropertyData {
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
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

### 3. Calculated Metrics (`src/types/calculatedMetrics.ts`)
```typescript
interface CalculatedMetrics {
  // Basic Metrics
  monthlyMortgage: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;

  // Advanced Metrics
  totalInvestment: number;
  netOperatingIncome: number;
  debtServiceCoverageRatio: number;
  returnOnInvestment: number;
  breakEvenYears: number;
  effectiveGrossIncome: number;
  operatingExpenseRatio: number;
}
```

### 4. Configuration Types (`src/types/configTypes.ts`)
```typescript
interface ConfigParameter {
  id: string;
  label: string;
  type: 'currency' | 'percentage' | 'number';
  min: number;
  max: number;
  step: number;
  unit: string;
  default: number;
  advanced: boolean;
  slider: boolean;
  description: string;
}

interface ConfigCategory {
  id: string;
  label: string;
  parameters: ConfigParameter[];
}

interface ConfigValidation {
  isValid: boolean;
  message: string;
}
```

## Data Flow

1. **Property Data Extraction**
   ```
   Zillow Page → DataExtractor → PropertyData
   ```
   - DataExtractor scrapes listing data
   - Maps to PropertyData interface
   - Updates InvestmentAnalysisPanel state

2. **User Input Management**
   ```
   User Inputs Panel → ConfigManager → UserCalculationInputs
   ```
   - ConfigManager persists user preferences
   - Provides real-time updates via subscription
   - Validates input values

3. **Metrics Calculation**
   ```
   PropertyData + UserCalculationInputs → Calculator → CalculatedMetrics
   ```
   - Calculator combines property data and user inputs
   - Computes investment metrics
   - Updates UI in real-time

## State Management

### 1. ConfigManager
- Singleton service for managing user preferences
- Handles persistence using Chrome Storage
- Provides subscription mechanism for real-time updates
- Validates input values against constraints

### 2. Component State
- InvestmentAnalysisPanel manages:
  - Property data (from DataExtractor)
  - User inputs (from ConfigManager)
  - Calculated metrics (from Calculator)
- Updates trigger re-renders with new calculations

## Key Features

### 1. Real-time Analysis
- Instant metric updates as users adjust inputs
- Color-coded metrics for quick interpretation
- Responsive layout for all screen sizes

### 2. Data Persistence
- User preferences saved across sessions
- Automatic loading of last used settings
- Validation to ensure data integrity

### 3. Error Handling
- Graceful handling of missing property data
- Input validation with user feedback
- Fallback UI states for loading/errors

## Technical Decisions

### 1. React + TypeScript
- Type safety for data models
- Component-based architecture
- Efficient state management

### 2. Tailwind CSS
- Utility-first styling
- Responsive design
- Consistent visual language

### 3. Chrome Extension Architecture
- Content script injection
- Secure storage
- Cross-origin communication

## Future Considerations

### 1. Performance
- Memoization of calculations
- Lazy loading of components
- Optimized re-renders

### 2. Features
- Advanced metrics (IRR, DSCR)
- Historical data analysis
- Market comparison tools

### 3. Integration
- Export functionality
- API integration
- Multi-platform support

## Project Structure
```
rental-investment-analyzer/
├── src/
│   ├── manifest.json           # Chrome extension manifest
│   ├── popup/                  # Extension popup (if needed)
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   ├── content/               # Content scripts that run on Zillow
│   │   ├── content.js         # Main content script
│   │   ├── sidebar.js         # Sidebar UI management
│   │   └── styles.css         # Sidebar styles
│   ├── background/            # Background scripts
│   │   └── background.js      # Handles storage and data loading
│   ├── services/             # Business logic and services
│   │   ├── calculator.ts      # Investment calculations
│   │   ├── dataExtractor.ts   # Zillow page parsing
│   │   └── configManager.ts   # Configuration management
│   ├── types/                # TypeScript type definitions
│   │   ├── propertyData.ts    # Property data interface
│   │   ├── calculationInputs.ts # Calculation inputs interface
│   │   ├── calculatedMetrics.ts # Calculated metrics interface
│   │   └── configTypes.ts     # Configuration type definitions
│   ├── components/           # React components
│   │   ├── investment-analysis-panel.tsx
│   │   └── investment/
│   │       └── config-panel.tsx
│   ├── utils/                # Utility functions
│   │   ├── domUtils.ts       # DOM manipulation helpers
│   │   ├── numberUtils.ts    # Number formatting, calculations
│   │   └── storageUtils.ts   # Chrome storage helpers
│   └── constants/            # Constants and configurations
│       ├── selectors.ts      # Zillow page selectors
│       ├── userParams.ts     # User configuration parameters and validation
│       └── ... other constants
├── public/                   # Static assets
│   ├── icons/               # Extension icons
│   └── images/              # Other images
├── tests/                   # Test files
│   ├── unit/
│   └── integration/
├── docs/                    # Documentation
│   ├── architecture/        # Technical architecture docs
│   ├── specs/              # Product specifications
│   └── tasks/              # Development tasks
├── package.json
└── README.md
```

## Component Architecture

### 1. Content Script Layer
```javascript
// content.js
class ZillowContentScript {
    constructor() {
        this.sidebar = new SidebarManager();
        this.dataExtractor = new DataExtractor();
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
// dataExtractor.js
class DataExtractor {
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
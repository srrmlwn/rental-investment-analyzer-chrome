# Rental Investment Analyzer - Technical Architecture

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
│   │   ├── propertyAnalyzer.js    # Cash flow calculations
│   │   ├── dataExtractor.js       # Zillow page parsing
│   │   ├── rentalEstimator.js     # Rental estimate logic
│   │   └── configManager.js       # Configuration management
│   ├── data/                 # Local data files
│   │   ├── hud_rental_data.json   # Processed HUD data
│   │   └── zip_code_map.json      # Zip code to HUD data mapping
│   ├── utils/                # Utility functions
│   │   ├── domUtils.js       # DOM manipulation helpers
│   │   ├── numberUtils.js    # Number formatting, calculations
│   │   ├── storageUtils.js   # Chrome storage helpers
│   │   └── dataUtils.js      # HUD data processing helpers
│   └── constants/            # Constants and configurations
│       ├── selectors.js      # Zillow page selectors
│       └── defaults.js       # Default configuration values
├── public/                   # Static assets
│   ├── icons/               # Extension icons
│   └── images/              # Other images
├── tests/                   # Test files
│   ├── unit/
│   └── integration/
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
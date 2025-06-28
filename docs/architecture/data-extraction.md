# DealWise - Data Extraction Architecture

## Overview
DealWise extracts property data from Zillow listing pages using a sophisticated multi-layered approach. The system employs a strategy pattern with abstract base classes to ensure robust data extraction with comprehensive fallback mechanisms.

## Architecture Pattern

### Strategy Pattern Implementation
The data extraction system uses a strategy pattern with abstract base classes for extensibility and maintainability:

```typescript
abstract class PropertyDataExtractor<T> {
  abstract extract(): T | null;
  abstract getFallbackValue(): T;
  
  extractWithFallback(): T {
    const result = this.extract();
    return result ?? this.getFallbackValue();
  }
}
```

### Extractor Hierarchy
```
PropertyDataExtractor (Abstract Base)
├── PropertyJsonExtractor (Primary)
├── PriceExtractor
├── BedBathExtractor
├── PropertyTypeExtractor
├── RentZestimateExtractor
├── PropertyTaxExtractor
├── HoaFeesExtractor
├── ZipCodeExtractor
└── UnitsExtractor
```

## Data Extraction Methods

### 1. Primary Extraction: JSON Parsing
**Target**: `__NEXT_DATA__` script tag in Zillow pages

**Process**:
1. Locate the `__NEXT_DATA__` script tag
2. Parse JSON content to access property information
3. Navigate nested object structure to extract specific fields
4. Handle different data formats and structures

**Advantages**:
- Most reliable data source
- Structured JSON format
- Complete property information
- Fast extraction

**Fallback**: DOM parsing if JSON unavailable

### 2. Secondary Extraction: DOM Parsing
**Target**: Specific CSS selectors for property elements

**Selectors Used**:
- Price: `[data-testid="price"]`, `.price`, `.list-price`
- Bedrooms/Bathrooms: `.bed-bath-beyond`, `.property-info`
- Property Type: `.property-type`, `.home-type`
- Location: `.address`, `.zip-code`
- Taxes: `.property-tax`, `.tax-info`
- HOA: `.hoa-fees`, `.association-fee`

**Advantages**:
- Works when JSON data unavailable
- Handles page structure changes
- Robust error handling

**Fallback**: Default values

### 3. Tertiary Fallback: Default Values
**Purpose**: Ensure system always provides usable data

**Default Values**:
- Price: $0 (requires user input)
- Bedrooms: 3
- Bathrooms: 2
- Property Type: "Single Family"
- Zip Code: "00000"
- Property Tax Rate: 1.2%
- HOA Fees: $0

## Extracted Property Data

### Core Property Information
```typescript
interface PropertyData {
  price: number;                    // Listing price (required)
  propertyType: string;             // Property type (e.g., 'Single Family')
  bedrooms?: number;                // Number of bedrooms
  bathrooms?: number;               // Number of bathrooms
  units?: number;                   // Number of units (multi-family)
  zipCode?: string;                 // Property zip code
  rentZestimate?: number;           // Zillow's rent estimate
  hudRentEstimate?: number;         // HUD data fallback estimate
  propertyTaxRate?: number;         // Annual property tax rate (%)
  hoaFees?: number;                 // Monthly HOA fees
}
```

### Data Validation
Each extracted field undergoes validation:
- **Type Checking**: Ensure correct data types
- **Range Validation**: Verify reasonable value ranges
- **Format Validation**: Check data format consistency
- **Null Handling**: Provide fallback values for missing data

## Rental Estimate System

### Multi-Source Approach
1. **Primary Source**: Zillow Zestimate
   - Extracted from property JSON data
   - Most accurate for current market conditions
   - Updated regularly by Zillow

2. **Fallback Source**: HUD Rental Data
   - Pre-processed JSON data by zip code
   - Bedroom-specific rental estimates
   - Historical data with confidence indicators

### HUD Data Integration
```typescript
interface HudRentalData {
  zip_codes: {
    [zipCode: string]: {
      average_rent: number;
      bedroom_breakdown: {
        [bedrooms: string]: number;
      };
      last_updated: string;
    };
  };
}
```

### Rental Estimate Logic
```typescript
async function getRentalEstimate(propertyData: PropertyData): Promise<number> {
  // Try Zestimate first
  if (propertyData.rentZestimate) {
    return propertyData.rentZestimate;
  }
  
  // Fallback to HUD data
  if (propertyData.zipCode && propertyData.bedrooms) {
    const hudData = await getHudRentalData(propertyData.zipCode);
    return hudData?.bedroom_breakdown[propertyData.bedrooms] || 0;
  }
  
  // Final fallback
  return 0;
}
```

## Error Handling & Resilience

### Graceful Degradation
1. **JSON Extraction Failure**: Fall back to DOM parsing
2. **DOM Parsing Failure**: Use default values
3. **Partial Data**: Continue with available information
4. **Complete Failure**: Show error state with manual input option

### Error Recovery
- **Retry Logic**: Multiple attempts for critical data
- **Timeout Handling**: Prevent infinite waiting
- **User Feedback**: Clear error messages and suggestions
- **Manual Override**: Allow users to input missing data

### Logging & Debugging
- **Structured Logging**: Detailed extraction process logs
- **Error Context**: Capture failure reasons and data state
- **Performance Metrics**: Track extraction timing and success rates
- **Debug Mode**: Enhanced logging for development

## Performance Optimization

### Caching Strategy
- **Extracted Data**: Cache property data for current session
- **HUD Data**: Pre-load and cache frequently accessed zip codes
- **Selectors**: Cache compiled CSS selectors
- **JSON Parsing**: Cache parsed JSON structure

### Memory Management
- **Lazy Loading**: Load extractors only when needed
- **Cleanup**: Proper disposal of DOM references
- **Efficient Parsing**: Streamlined JSON navigation
- **Resource Limits**: Prevent memory leaks

### Timing Optimization
- **Parallel Extraction**: Extract multiple fields simultaneously
- **Priority Loading**: Load critical data first
- **Debounced Updates**: Prevent excessive re-extraction
- **Background Processing**: Non-blocking data extraction

## SPA Navigation Handling

### Challenge
Zillow uses a Single Page Application (SPA) architecture where the `__NEXT_DATA__` script tag doesn't update when navigating between listings.

### Solution: Forced Reload Strategy
1. **Navigation Detection**: Monitor URL changes and extract listing IDs
2. **State Preservation**: Save current sidebar state
3. **Forced Reload**: Trigger page reload with special parameters
4. **State Restoration**: Restore sidebar state after reload

### Implementation Details
```typescript
// Navigation detection
const currentListingId = extractListingId(window.location.href);
if (currentListingId !== previousListingId) {
  // Save sidebar state
  const sidebarOpen = getSidebarState();
  
  // Force reload with parameters
  const reloadUrl = new URL(window.location.href);
  reloadUrl.searchParams.set('ria_force_reload', '1');
  if (sidebarOpen) {
    reloadUrl.searchParams.set('ria_auto_open', '1');
  }
  
  window.location.href = reloadUrl.toString();
}
```

## Testing Strategy

### Test Data
- **HTML Fixtures**: Real Zillow page HTML for testing
- **JSON Samples**: Extracted JSON data for validation
- **Edge Cases**: Missing data, malformed content, various property types
- **Performance Tests**: Large datasets and timing validation

### Test Coverage
- **Unit Tests**: Individual extractor testing
- **Integration Tests**: End-to-end extraction flow
- **Error Scenarios**: Failure mode testing
- **Performance Tests**: Timing and memory usage validation

### Mock Strategy
- **Chrome APIs**: Mocked for testing environment
- **DOM Manipulation**: JSDOM for server-side testing
- **Network Requests**: Mocked HUD data responses
- **Error Conditions**: Simulated failure scenarios

## Future Enhancements

### Advanced Extraction
- **Machine Learning**: AI-powered data extraction
- **Image Recognition**: Extract data from property images
- **Natural Language Processing**: Parse property descriptions
- **Market Data Integration**: Real-time market statistics

### Platform Expansion
- **Multi-Site Support**: Extract from other real estate sites
- **API Integration**: Direct API access where available
- **Data Aggregation**: Combine data from multiple sources
- **Historical Data**: Track property data over time

### Performance Improvements
- **Web Workers**: Background processing for heavy extraction
- **Service Workers**: Offline data caching
- **Progressive Loading**: Incremental data extraction
- **Predictive Caching**: Pre-load likely data

---

*Last Updated: December 2024*
*Architecture Version: 2.0* 
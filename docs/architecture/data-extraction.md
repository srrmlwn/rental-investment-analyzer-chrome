## Data Extraction via Script Tag

The DataExtractionService extracts property data from Zillow listing pages by parsing the page content and extracting relevant information. The service is designed to handle various listing formats and provides fallback mechanisms for missing data.

### Extracted Property Data

The service extracts the following fields:

```typescript
interface PropertyData {
    price: number;              // Listing price
    bedrooms?: number;          // Number of bedrooms
    bathrooms?: number;         // Number of bathrooms
    propertyType?: string;      // Type of property (e.g., 'Condo', 'Single Family')
    zipCode?: string;          // Property zip code
    rentZestimate?: number;    // Zillow's rent estimate
    monthlyPropertyTaxes?: number;  // Monthly property tax amount
    propertyTaxRate?: number;   // Annual property tax rate as percentage
    hoaFees?: number;          // Monthly HOA fees
    units?: number;            // Number of units (for multi-family properties)
}
```

### Implementation Details

The DataExtractionService uses a combination of methods to extract data:

1. **Script Tag Parsing**
   - Extracts data from the `__NEXT_DATA__` script tag
   - Parses the JSON data to access property information
   - Handles different data structures and formats

2. **DOM Element Selection**
   - Falls back to DOM element selection when script data is unavailable
   - Uses specific selectors for each data point
   - Implements error handling for missing elements

3. **Data Validation**
   - Validates extracted data types
   - Handles missing or undefined values
   - Provides default values when necessary

### Example Usage

```typescript
const service = new DataExtractionService();
const propertyData = await service.extractPropertyData();

// Example output:
{
    price: 419900,
    bedrooms: 4,
    bathrooms: 2,
    propertyType: 'Condo',
    zipCode: '43205',
    rentZestimate: undefined,
    monthlyPropertyTaxes: undefined,
    propertyTaxRate: 1.37,
    hoaFees: undefined,
    units: 2
}
```

### Error Handling

The service implements robust error handling:
- Graceful fallbacks for missing data
- Type validation for extracted values
- Clear error messages for debugging
- Cache management for performance

### Testing

The service is thoroughly tested with various listing formats:
- Standard single-family listings
- Multi-family properties
- Listings with missing data
- Different property types
- Various price ranges and locations

Test cases are available in `tests/services/dataExtraction/index.test.ts` and use sample HTML files from `tests/resources/` to verify extraction accuracy. 
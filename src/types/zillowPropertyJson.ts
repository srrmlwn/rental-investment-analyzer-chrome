// Raw property data from Zillow's JSON response
export interface ZillowPropertyJson {
    // Core property fields
    zpid: number;
    price: number;
    bedrooms: number;
    bathrooms: number;
    yearBuilt: number;
    homeType: string;
    lotSize: number;
    livingArea: number;
    propertyTaxRate: number;
    lastSoldPrice: number;
    latitude: number;
    longitude: number;
    units?: number;  // Number of units for multi-family properties
    description?: string;  // Property description
    rentZestimate?: number;
    monthlyHoaFee?: number;
    zestimate?: number;

    // Address object structure
    address: {
        streetAddress: string;
        city: string;
        state: string;
        zipcode: string;
        neighborhood?: string | null;
        community?: string | null;
        subdivision?: string | null;
    };

    // Complex objects that need to be accessed carefully
    resoFacts: {
        bedrooms?: number;
        bathrooms?: number;
        livingArea?: number;
        lotSize?: number;
        yearBuilt?: number;
        homeType?: string;
        units?: number;  // Number of units in resoFacts
    };
    multiFamilyUnits?: {
        totalUnits?: number;  // Total number of units for multi-family properties
    };

    // Additional fields that might be present
    [key: string]: any; 
} 
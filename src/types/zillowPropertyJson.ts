// Raw property data from Zillow's JSON response
export interface ZillowPropertyJson {
    // Core property fields
    zpid: number;
    price: number;
    streetAddress: string;
    city: string;
    state: string;
    zipcode: string;
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

    // Complex objects that need to be accessed carefully
    rentZestimate: {
        value?: number;
        // Add other fields if needed
    };
    monthlyHoaFee: {
        value?: number;
        // Add other fields if needed
    };
    zestimate: {
        value?: number;
        // Add other fields if needed
    };
    resoFacts: {
        bedrooms?: number;
        bathrooms?: number;
        livingArea?: number;
        lotSize?: number;
        yearBuilt?: number;
        homeType?: string;
    };

    // Additional fields that might be present
    [key: string]: any;
} 
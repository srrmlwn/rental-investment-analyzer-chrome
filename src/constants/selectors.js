// Zillow Listing Page Selectors

export const SELECTORS = {
    // Price
    PRICE: '[data-testid="price"]',
    
    // Bedrooms & Bathrooms
    BED_BATH_SECTION: '.styles__StyledFactCategory-fshdp-8-106-0__sc-1i5yjpk-0',
    BEDROOMS: 'li:has(span:contains("Bedrooms:")) span',
    BATHROOMS: 'li:has(span:contains("Bathrooms:")) span',
    
    // Property Details
    PROPERTY_TYPE: 'meta[property="og:description"]', // Extract from meta description
    SQUARE_FEET: 'li:has(span:contains("sqft")) span',
    
    // Rental Estimate
    RENT_ZESTIMATE: '[data-testid="rent-zestimate"]',
    
    // Address (for zip code lookup)
    ADDRESS: 'meta[property="og:title"]', // Extract from meta title
};

// JSON Data Paths (for extracting from page's JSON data)
export const JSON_PATHS = {
    PRICE: 'price',
    BEDROOMS: 'bedrooms',
    BATHROOMS: 'bathrooms',
    PROPERTY_TYPE: 'architecturalStyle',
    SQUARE_FEET: 'livingArea',
    ZIP_CODE: 'zipcode',
};

// Regular Expressions for Data Extraction
export const REGEX = {
    // Extract numbers from strings like "Bedrooms: 4"
    BEDROOMS: /Bedrooms:\s*(\d+)/,
    BATHROOMS: /Bathrooms:\s*(\d+)/,
    SQUARE_FEET: /(\d+)\s*sqft/,
    
    // Extract zip code from address
    ZIP_CODE: /\b\d{5}\b/,
    
    // Extract price from string like "$250,000"
    PRICE: /\$([\d,]+)/,
};

// Error Messages
export const ERROR_MESSAGES = {
    MISSING_PRICE: 'Unable to find property price',
    MISSING_BEDROOMS: 'Unable to find number of bedrooms',
    MISSING_BATHROOMS: 'Unable to find number of bathrooms',
    MISSING_PROPERTY_TYPE: 'Unable to determine property type',
    MISSING_SQUARE_FEET: 'Unable to find square footage',
    MISSING_ZIP_CODE: 'Unable to find zip code for rental estimate',
    INVALID_LISTING: 'This listing appears to be incomplete. Required information is missing.',
}; 
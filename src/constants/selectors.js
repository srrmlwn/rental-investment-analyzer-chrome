// Zillow Listing Page Selectors

const SELECTORS = {
    // Price
    PRICE: '[data-testid="price"]',
    
    // Bedrooms & Bathrooms
    BED_BATH_SECTION: '.styles__StyledFactCategory-fshdp-8-106-0__sc-1i5yjpk-0',
    BEDROOMS: 'li:has(span:contains("Bedrooms:")) span',
    BATHROOMS: 'li:has(span:contains("Bathrooms:")) span',
    
    // Property Details
    PROPERTY_TYPE: 'meta[property="og:description"]', // Extract from meta description
    SQUARE_FEET: '[data-testid="bed-bath-sqft-facts"] [data-testid="bed-bath-sqft-fact-container"] span:first-child',
    SQUARE_FEET_CONTAINER: '[data-testid="bed-bath-sqft-facts"] [data-testid="bed-bath-sqft-fact-container"]',
    
    // Rental Estimate
    RENT_ZESTIMATE: '[data-testid="rent-zestimate"]',
    
    // Property Taxes
    PROPERTY_TAXES: '#label-property-tax .hNuOht', // Monthly property taxes
    
    // HOA Fees
    HOA_FEES: '#label-hoa .hNuOht', // Monthly HOA fees
    HOA_FEES_SECTION: '#label-hoa', // HOA section for additional info
    
    // Address (for zip code lookup)
    ADDRESS: 'meta[property="og:title"]', // Extract from meta title
};

// JSON Data Paths (for extracting from page's JSON data)
const JSON_PATHS = {
    PRICE: 'price',
    BEDROOMS: 'bedrooms',
    BATHROOMS: 'bathrooms',
    PROPERTY_TYPE: 'architecturalStyle',
    SQUARE_FEET: 'livingArea',
    ZIP_CODE: 'zipcode',
    RENT_ZESTIMATE: 'rentZestimate',
    PROPERTY_TAXES: 'propertyTaxes', // Annual property taxes
    HOA_FEES: 'hoaFee', // Monthly HOA fees
};

// Regular Expressions for Data Extraction
const REGEX = {
    // Extract numbers from strings like "Bedrooms: 4"
    BEDROOMS: /Bedrooms:\s*(\d+)/,
    BATHROOMS: /Bathrooms:\s*(\d+)/,
    SQUARE_FEET: /(\d+)\s*sqft/,
    
    // Extract zip code from address
    ZIP_CODE: /\b\d{5}\b/,
    
    // Extract price from string like "$250,000"
    PRICE: /\$([\d,]+)/,
    
    // Extract rent from string like "$1,901/mo"
    RENT: /\$([\d,]+)\/mo/,

    // Extract property taxes from string like "$308"
    PROPERTY_TAXES: /\$([\d,]+)/,

    // Extract HOA fees from string like "$250/mo"
    HOA_FEES: /\$([\d,]+)\/mo/,
};

// Error Messages
const ERROR_MESSAGES = {
    MISSING_PRICE: 'Unable to find property price',
    MISSING_BEDROOMS: 'Unable to find number of bedrooms',
    MISSING_BATHROOMS: 'Unable to find number of bathrooms',
    MISSING_PROPERTY_TYPE: 'Unable to determine property type',
    MISSING_SQUARE_FEET: 'Unable to find square footage',
    MISSING_ZIP_CODE: 'Unable to find zip code for rental estimate',
    MISSING_RENTAL_ESTIMATE: 'Unable to get rental estimate. Neither Zestimate nor HUD data is available for this property.',
    MISSING_PROPERTY_TAXES: 'Unable to find property taxes',
    MISSING_HOA_FEES: 'Unable to find HOA fees', // Not critical, will default to 0
    INVALID_LISTING: 'This listing appears to be incomplete. Required information is missing.',
};

module.exports = {
    SELECTORS,
    JSON_PATHS,
    REGEX,
    ERROR_MESSAGES
}; 
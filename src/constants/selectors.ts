export const ERROR_MESSAGES = {
    MISSING_PRICE: 'Unable to find property price',
    MISSING_BEDROOMS: 'Unable to find number of bedrooms',
    MISSING_BATHROOMS: 'Unable to find number of bathrooms',
    MISSING_PROPERTY_TYPE: 'Unable to determine property type',
    MISSING_SQUARE_FEET: 'Unable to find square footage',
    MISSING_ZIP_CODE: 'Unable to find zip code for rental estimate',
    MISSING_RENTAL_ESTIMATE: 'Unable to get rental estimate. Neither Zestimate nor HUD data is available for this property.',
    MISSING_PROPERTY_TAXES: 'Unable to find property taxes',
    MISSING_HOA_FEES: 'Unable to find HOA fees',
    MISSING_UNITS: 'Unable to find number of units',
    INVALID_LISTING: 'This listing appears to be incomplete. Required information is missing.',
} as const; 
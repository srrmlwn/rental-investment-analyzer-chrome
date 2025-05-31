const { SELECTORS, JSON_PATHS, REGEX, ERROR_MESSAGES } = require('../constants/selectors');

class DataExtractor {
    constructor() {
        this.jsonData = null;
    }

    /**
     * Initialize the extractor by finding and parsing the page's JSON data
     */
    async initialize() {
        // Find the JSON data in the page
        const jsonScript = document.querySelector('script[type="application/json"]');
        if (jsonScript) {
            try {
                // Trim whitespace before parsing JSON
                const jsonContent = jsonScript.textContent.trim();
                console.log('Found JSON content:', jsonContent);
                
                if (jsonContent) {
                    this.jsonData = JSON.parse(jsonContent);
                    console.log('Parsed JSON data:', this.jsonData);
                }
            } catch (e) {
                console.warn('Failed to parse JSON data:', e);
                this.jsonData = null;
            }
        } else {
            console.log('No JSON script found in the page');
        }
    }

    /**
     * Extract all property data
     */
    async extractPropertyData() {
        console.log('Starting property data extraction. JSON data available:', !!this.jsonData);
        
        const data = {
            price: await this.extractPrice(),
            bedrooms: await this.extractBedrooms(),
            bathrooms: await this.extractBathrooms(),
            propertyType: await this.extractPropertyType(),
            squareFeet: await this.extractSquareFeet(),
            zipCode: await this.extractZipCode(),
        };

        // Validate required fields
        this.validateRequiredData(data);

        return data;
    }

    /**
     * Extract price from the listing
     */
    async extractPrice() {
        // Try JSON data first
        if (this.jsonData?.price) {
            console.log('Extracting price from JSON:', this.jsonData.price);
            return this.jsonData.price;
        }

        // Fallback to DOM
        const priceElement = document.querySelector(SELECTORS.PRICE);
        if (priceElement) {
            console.log('Found price element:', priceElement.textContent);
            const match = priceElement.textContent.match(REGEX.PRICE);
            if (match) {
                const price = parseInt(match[1].replace(/,/g, ''));
                console.log('Extracted price from DOM:', price);
                return price;
            }
        }

        console.log('Failed to extract price from both JSON and DOM');
        throw new Error(ERROR_MESSAGES.MISSING_PRICE);
    }

    /**
     * Extract number of bedrooms
     */
    async extractBedrooms() {
        // Try JSON data first
        if (this.jsonData?.bedrooms) {
            return this.jsonData.bedrooms;
        }

        // Fallback to DOM
        const bedBathSection = document.querySelector(SELECTORS.BED_BATH_SECTION);
        if (bedBathSection) {
            const bedroomsText = bedBathSection.textContent;
            const match = bedroomsText.match(REGEX.BEDROOMS);
            if (match) {
                return parseInt(match[1]);
            }
        }

        throw new Error(ERROR_MESSAGES.MISSING_BEDROOMS);
    }

    /**
     * Extract number of bathrooms
     */
    async extractBathrooms() {
        // Try JSON data first
        if (this.jsonData?.bathrooms) {
            return this.jsonData.bathrooms;
        }

        // Fallback to DOM
        const bedBathSection = document.querySelector(SELECTORS.BED_BATH_SECTION);
        if (bedBathSection) {
            const bathroomsText = bedBathSection.textContent;
            const match = bathroomsText.match(REGEX.BATHROOMS);
            if (match) {
                return parseInt(match[1]);
            }
        }

        throw new Error(ERROR_MESSAGES.MISSING_BATHROOMS);
    }

    /**
     * Extract property type
     */
    async extractPropertyType() {
        // Try JSON data first
        if (this.jsonData?.architecturalStyle) {
            return this.jsonData.architecturalStyle;
        }

        // Fallback to meta description
        const metaDesc = document.querySelector(SELECTORS.PROPERTY_TYPE);
        if (metaDesc) {
            const content = metaDesc.getAttribute('content');
            if (content.includes('Single Family')) return 'Single Family';
            if (content.includes('Condo')) return 'Condo';
            if (content.includes('Multi Family')) return 'Multi Family';
        }

        throw new Error(ERROR_MESSAGES.MISSING_PROPERTY_TYPE);
    }

    /**
     * Extract square footage
     */
    async extractSquareFeet() {
        // Try JSON data first
        if (this.jsonData?.livingArea) {
            return this.jsonData.livingArea;
        }

        // Fallback to DOM
        const sqftElement = document.querySelector(SELECTORS.SQUARE_FEET);
        if (sqftElement) {
            const match = sqftElement.textContent.match(REGEX.SQUARE_FEET);
            if (match) {
                return parseInt(match[1]);
            }
        }

        throw new Error(ERROR_MESSAGES.MISSING_SQUARE_FEET);
    }

    /**
     * Extract zip code from address
     */
    async extractZipCode() {
        // Try JSON data first
        if (this.jsonData?.zipcode) {
            return this.jsonData.zipcode;
        }

        // Fallback to meta title
        const addressMeta = document.querySelector(SELECTORS.ADDRESS);
        if (addressMeta) {
            const content = addressMeta.getAttribute('content');
            const match = content.match(REGEX.ZIP_CODE);
            if (match) {
                return match[0];
            }
        }

        throw new Error(ERROR_MESSAGES.MISSING_ZIP_CODE);
    }

    /**
     * Validate that all required data is present
     */
    validateRequiredData(data) {
        const requiredFields = ['price', 'bedrooms', 'bathrooms', 'propertyType', 'zipCode'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            throw new Error(ERROR_MESSAGES.INVALID_LISTING);
        }
    }
}

module.exports = { DataExtractor }; 
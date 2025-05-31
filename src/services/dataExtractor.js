import { SELECTORS, JSON_PATHS, REGEX, ERROR_MESSAGES } from '../constants/selectors';

export class DataExtractor {
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
                this.jsonData = JSON.parse(jsonScript.textContent);
            } catch (e) {
                console.warn('Failed to parse JSON data:', e);
            }
        }
    }

    /**
     * Extract all property data
     */
    async extractPropertyData() {
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
            return this.jsonData.price;
        }

        // Fallback to DOM
        const priceElement = document.querySelector(SELECTORS.PRICE);
        if (priceElement) {
            const match = priceElement.textContent.match(REGEX.PRICE);
            if (match) {
                return parseInt(match[1].replace(/,/g, ''));
            }
        }

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
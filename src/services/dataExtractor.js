import { SELECTORS, JSON_PATHS, REGEX, ERROR_MESSAGES } from '../constants/selectors.js';

class DataExtractor {
    constructor() {
        this.jsonData = null;
        this.findJsonData();
    }

    /**
     * Find and parse JSON data from the page
     */
    findJsonData() {
        console.log('🔍 Looking for JSON data in page...');
        const scripts = document.querySelectorAll('script[type="application/json"]');
        scripts.forEach(script => {
            try {
                const data = JSON.parse(script.textContent);
                if (data?.props?.pageProps?.componentProps?.gdpClientCache) {
                    console.log('📦 Found Zillow JSON data');
                    this.jsonData = data.props.pageProps.componentProps.gdpClientCache;
                }
            } catch (error) {
                // Ignore parsing errors for non-matching scripts
            }
        });
    }

    /**
     * Extract all property data
     */
    async extractPropertyData() {
        console.log('🏠 Starting property data extraction...');
        
        const data = {
            price: await this.extractPrice(),
            bedrooms: await this.extractBedrooms(),
            bathrooms: await this.extractBathrooms(),
            propertyType: await this.extractPropertyType(),
            squareFeet: await this.extractSquareFeet(),
            zipCode: await this.extractZipCode(),
            rentZestimate: await this.extractRentZestimate(),
            propertyTaxes: await this.extractPropertyTaxes(),
        };

        console.log('📝 Extracted data:', {
            price: `$${data.price.toLocaleString()}`,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            propertyType: data.propertyType,
            squareFeet: `${data.squareFeet.toLocaleString()} sqft`,
            zipCode: data.zipCode,
            rentZestimate: data.rentZestimate ? `$${data.rentZestimate.toLocaleString()}/mo` : 'Not available',
            propertyTaxes: data.propertyTaxes ? `$${data.propertyTaxes.toLocaleString()}/yr` : 'Not available'
        });

        // Validate required fields
        this.validateRequiredData(data);

        return data;
    }

    /**
     * Extract price from the listing
     */
    async extractPrice() {
        console.log('💰 Extracting price...');
        
        // Try JSON data first
        if (this.jsonData?.price) {
            console.log('✅ Found price in JSON:', this.jsonData.price);
            return this.jsonData.price;
        }

        // Fallback to DOM
        const priceElement = document.querySelector(SELECTORS.PRICE);
        if (priceElement) {
            console.log('🔍 Found price element:', priceElement.textContent);
            const match = priceElement.textContent.match(REGEX.PRICE);
            if (match) {
                const price = parseInt(match[1].replace(/,/g, ''));
                console.log('✅ Extracted price from DOM:', price);
                return price;
            }
        }

        console.error('❌ Failed to extract price from both JSON and DOM');
        throw new Error(ERROR_MESSAGES.MISSING_PRICE);
    }

    /**
     * Extract number of bedrooms
     */
    async extractBedrooms() {
        console.log('🛏️ Extracting bedrooms...');
        
        // Try JSON data first
        if (this.jsonData?.bedrooms) {
            console.log('✅ Found bedrooms in JSON:', this.jsonData.bedrooms);
            return this.jsonData.bedrooms;
        }

        // Fallback to DOM
        const bedBathSection = document.querySelector(SELECTORS.BED_BATH_SECTION);
        if (bedBathSection) {
            const bedroomsText = bedBathSection.textContent;
            console.log('🔍 Found bed/bath section:', bedroomsText);
            const match = bedroomsText.match(REGEX.BEDROOMS);
            if (match) {
                const bedrooms = parseInt(match[1]);
                console.log('✅ Extracted bedrooms from DOM:', bedrooms);
                return bedrooms;
            }
        }

        console.error('❌ Failed to extract bedrooms from both JSON and DOM');
        throw new Error(ERROR_MESSAGES.MISSING_BEDROOMS);
    }

    /**
     * Extract number of bathrooms
     */
    async extractBathrooms() {
        console.log('🚿 Extracting bathrooms...');
        
        // Try JSON data first
        if (this.jsonData?.bathrooms) {
            console.log('✅ Found bathrooms in JSON:', this.jsonData.bathrooms);
            return this.jsonData.bathrooms;
        }

        // Fallback to DOM
        const bedBathSection = document.querySelector(SELECTORS.BED_BATH_SECTION);
        if (bedBathSection) {
            const bathroomsText = bedBathSection.textContent;
            console.log('🔍 Found bed/bath section:', bathroomsText);
            const match = bathroomsText.match(REGEX.BATHROOMS);
            if (match) {
                const bathrooms = parseInt(match[1]);
                console.log('✅ Extracted bathrooms from DOM:', bathrooms);
                return bathrooms;
            }
        }

        console.error('❌ Failed to extract bathrooms from both JSON and DOM');
        throw new Error(ERROR_MESSAGES.MISSING_BATHROOMS);
    }

    /**
     * Extract property type
     */
    async extractPropertyType() {
        console.log('🏘️ Extracting property type...');
        
        // Try JSON data first
        if (this.jsonData?.architecturalStyle) {
            console.log('✅ Found property type in JSON:', this.jsonData.architecturalStyle);
            return this.jsonData.architecturalStyle;
        }

        // Fallback to meta description
        const metaDesc = document.querySelector(SELECTORS.PROPERTY_TYPE);
        if (metaDesc) {
            const content = metaDesc.getAttribute('content');
            console.log('🔍 Found meta description:', content);
            if (content.includes('Single Family')) {
                console.log('✅ Extracted property type: Single Family');
                return 'Single Family';
            }
            if (content.includes('Condo')) {
                console.log('✅ Extracted property type: Condo');
                return 'Condo';
            }
            if (content.includes('Multi Family')) {
                console.log('✅ Extracted property type: Multi Family');
                return 'Multi Family';
            }
        }

        console.error('❌ Failed to extract property type from both JSON and DOM');
        throw new Error(ERROR_MESSAGES.MISSING_PROPERTY_TYPE);
    }

    /**
     * Extract square footage
     */
    async extractSquareFeet() {
        console.log('📏 Extracting square footage...');
        
        // Try JSON data first
        if (this.jsonData?.livingArea) {
            console.log('✅ Found square footage in JSON:', this.jsonData.livingArea);
            return this.jsonData.livingArea;
        }

        // Fallback to DOM
        const containers = document.querySelectorAll(SELECTORS.SQUARE_FEET_CONTAINER);
        for (const container of containers) {
            const descriptionText = container.querySelector('span:last-child')?.textContent;
            if (descriptionText === 'sqft') {
                const valueText = container.querySelector('span:first-child')?.textContent;
                if (valueText) {
                    const sqft = parseInt(valueText.replace(/,/g, ''));
                    if (!isNaN(sqft)) {
                        console.log('✅ Extracted square footage from DOM:', sqft);
                        return sqft;
                    }
                }
            }
        }

        console.error('❌ Failed to extract square footage from both JSON and DOM');
        throw new Error(ERROR_MESSAGES.MISSING_SQUARE_FEET);
    }

    /**
     * Extract zip code
     */
    async extractZipCode() {
        console.log('📍 Extracting zip code...');
        
        // Try JSON data first
        if (this.jsonData?.zipcode) {
            console.log('✅ Found zip code in JSON:', this.jsonData.zipcode);
            return this.jsonData.zipcode;
        }

        // Fallback to meta title
        const metaTitle = document.querySelector(SELECTORS.ADDRESS);
        if (metaTitle) {
            const content = metaTitle.getAttribute('content');
            console.log('🔍 Found meta title:', content);
            const match = content.match(REGEX.ZIP_CODE);
            if (match) {
                const zipCode = match[0];
                console.log('✅ Extracted zip code from DOM:', zipCode);
                return zipCode;
            }
        }

        console.error('❌ Failed to extract zip code from both JSON and DOM');
        throw new Error(ERROR_MESSAGES.MISSING_ZIP_CODE);
    }

    /**
     * Extract Rent Zestimate
     * Returns null if not available (will fall back to HUD data)
     */
    async extractRentZestimate() {
        console.log('💰 Extracting Rent Zestimate...');
        
        // Try JSON data first
        if (this.jsonData?.rentZestimate) {
            console.log('✅ Found Rent Zestimate in JSON:', this.jsonData.rentZestimate);
            return this.jsonData.rentZestimate;
        }

        // Fallback to DOM
        const rentElement = document.querySelector(SELECTORS.RENT_ZESTIMATE);
        if (rentElement) {
            console.log('🔍 Found Rent Zestimate element:', rentElement.textContent);
            const match = rentElement.textContent.match(REGEX.RENT);
            if (match) {
                const rent = parseInt(match[1].replace(/,/g, ''));
                console.log('✅ Extracted Rent Zestimate from DOM:', rent);
                return rent;
            }
        }

        console.log('ℹ️ No Rent Zestimate available - will fall back to HUD data');
        return null;
    }

    /**
     * Extract property taxes from the listing
     * Returns null if not available (will fall back to default rate)
     */
    async extractPropertyTaxes() {
        console.log('💰 Extracting property taxes...');
        
        // Try JSON data first
        if (this.jsonData?.propertyTaxes) {
            console.log('✅ Found property taxes in JSON:', this.jsonData.propertyTaxes);
            return this.jsonData.propertyTaxes;
        }

        // Fallback to DOM
        const taxElement = document.querySelector(SELECTORS.PROPERTY_TAXES);
        if (taxElement) {
            console.log('🔍 Found property taxes element:', taxElement.textContent);
            const match = taxElement.textContent.match(REGEX.PROPERTY_TAXES);
            if (match) {
                // Convert monthly to annual
                const monthlyTax = parseInt(match[1].replace(/,/g, ''));
                const annualTax = monthlyTax * 12;
                console.log('✅ Extracted annual property taxes from DOM:', annualTax);
                return annualTax;
            }
        }

        console.log('ℹ️ No property taxes available - will use default rate');
        return null;
    }

    /**
     * Validate that all required data is present
     */
    validateRequiredData(data) {
        console.log('🔍 Validating required data...');
        // Note: rentZestimate is not required as we can fall back to HUD data
        const requiredFields = ['price', 'bedrooms', 'bathrooms', 'propertyType', 'zipCode'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            console.error('❌ Missing required fields:', missingFields);
            throw new Error(ERROR_MESSAGES.INVALID_LISTING);
        }
        console.log('✅ All required data is present');
    }
}

export { DataExtractor }; 
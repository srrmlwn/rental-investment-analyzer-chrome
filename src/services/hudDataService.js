/**
 * Service for handling HUD rental data lookups and caching
 */
class HudDataService {
    constructor() {
        this.hudData = null;
        this.cache = new Map(); // Cache for frequently accessed zip codes
        this.cacheSize = 100; // Maximum number of zip codes to cache
        this.initialized = false;
    }

    /**
     * Initialize the service by loading HUD data
     */
    async initialize() {
        if (this.initialized) return;

        try {
            // Load HUD data from the bundled JSON file
            const response = await fetch(chrome.runtime.getURL('data/hud_rental_data.json'));
            this.hudData = await response.json();
            this.initialized = true;
            console.log('HUD data service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize HUD data service:', error);
            throw new Error('Failed to load HUD rental data');
        }
    }

    /**
     * Get rental data for a specific zip code
     * @param {string} zipCode - 5-digit zip code
     * @param {number} bedrooms - Number of bedrooms (0-4)
     * @returns {Object|null} Rental data or null if not found
     */
    async getRentalData(zipCode, bedrooms) {
        if (!this.initialized) {
            await this.initialize();
        }

        // Normalize zip code to 5 digits with leading zeros
        const normalizedZip = zipCode.toString().padStart(5, '0');
        
        // Check cache first
        const cacheKey = `${normalizedZip}-${bedrooms}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Get data from HUD dataset
        const zipData = this.hudData?.data?.zip_codes?.[normalizedZip];
        if (!zipData) {
            return null;
        }

        // Get the appropriate rent value based on bedrooms
        const bedroomKey = `${bedrooms}BR`;
        const rent = zipData.rents[bedroomKey];

        if (!rent) {
            return null;
        }

        const rentalData = {
            rent,
            areaName: zipData.area_name,
            areaCode: zipData.area_code,
            source: 'HUD',
            lastUpdated: this.hudData.metadata.lastUpdated
        };

        // Update cache
        this.updateCache(cacheKey, rentalData);

        return rentalData;
    }

    /**
     * Update the cache with new data, maintaining the cache size limit
     * @param {string} key - Cache key
     * @param {Object} data - Data to cache
     */
    updateCache(key, data) {
        // If cache is full, remove oldest entry
        if (this.cache.size >= this.cacheSize) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
        this.cache.set(key, data);
    }

    /**
     * Clear the cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get metadata about the HUD dataset
     * @returns {Object} Dataset metadata
     */
    getMetadata() {
        return this.hudData?.metadata || null;
    }
}

// Export a singleton instance
const hudDataService = new HudDataService();
export default hudDataService; 
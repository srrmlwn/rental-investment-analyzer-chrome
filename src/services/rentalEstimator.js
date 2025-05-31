import { SELECTORS, ERROR_MESSAGES } from '../constants/selectors.js';

/**
 * Service for estimating rental income using Zestimate and HUD data
 */
class RentalEstimator {
    constructor() {
        this.jsonData = null;
    }

    /**
     * Set JSON data from Zillow page
     * @param {Object} data - JSON data from Zillow page
     */
    setJsonData(data) {
        this.jsonData = data;
    }

    /**
     * Get rental estimate for a property
     * @param {Object} propertyData - Property data including zipCode and bedrooms
     * @returns {Promise<Object>} Rental estimate data
     */
    async getRentalEstimate(propertyData) {
        const { zipCode, bedrooms } = propertyData;

        // Try Zestimate first
        const zestimateData = await this.getZestimate();
        if (zestimateData) {
            return {
                ...zestimateData,
                source: 'Zestimate'
            };
        }

        // Fallback to HUD data
        try {
            const hudData = await this.getHudData(zipCode, bedrooms);
            if (hudData) {
                return {
                    ...hudData,
                    source: 'HUD'
                };
            }
        } catch (error) {
            console.error('Error getting HUD data:', error);
        }

        // If both sources fail, throw error
        throw new Error(ERROR_MESSAGES.MISSING_RENTAL_ESTIMATE);
    }

    /**
     * Get rental estimate from Zestimate
     * @returns {Promise<Object|null>} Zestimate data or null if not available
     */
    async getZestimate() {
        // Try JSON data first
        if (this.jsonData?.rentZestimate) {
            return {
                rent: this.jsonData.rentZestimate,
                lastUpdated: this.jsonData.lastUpdated
            };
        }

        // Fallback to DOM
        const zestimateElement = document.querySelector(SELECTORS.RENT_ZESTIMATE);
        if (zestimateElement) {
            const match = zestimateElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                return {
                    rent: parseInt(match[1].replace(/,/g, '')),
                    lastUpdated: new Date().toISOString().split('T')[0]
                };
            }
        }

        return null;
    }

    /**
     * Get rental data from HUD dataset
     * @param {string} zipCode - Property zip code
     * @param {number} bedrooms - Number of bedrooms
     * @returns {Promise<Object|null>} HUD rental data or null if not available
     */
    async getHudData(zipCode, bedrooms) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    type: 'GET_HUD_DATA',
                    data: { zipCode, bedrooms }
                },
                response => {
                    if (response.status === 'success') {
                        resolve(response.data);
                    } else {
                        reject(new Error(response.error));
                    }
                }
            );
        });
    }
}

// Export a singleton instance
const rentalEstimator = new RentalEstimator();
export default rentalEstimator; 
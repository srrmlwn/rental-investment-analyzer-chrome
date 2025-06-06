import { BaseExtractor } from '../base/BaseExtractor';
import { RENT_SELECTORS } from '../selectors/rentSelectors';

export class RentZestimateExtractor extends BaseExtractor {
    async extract(): Promise<number | null> {
        this.logExtractionStart('Rent Zestimate');
        
        // Try Rent Zestimate first
        const rentElement = document.querySelector(RENT_SELECTORS.ZESTIMATE);
        if (rentElement?.textContent) {
            const match = rentElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                const rent = this.safeParseInt(match[1]);
                if (rent !== null) {
                    this.logExtractionSuccess('Rent Zestimate', rent);
                    return rent;
                }
            }
        }

        // Try alternative rent estimate
        const altRentElement = document.querySelector(RENT_SELECTORS.RENT_ESTIMATE);
        if (altRentElement?.textContent) {
            const match = altRentElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                const rent = this.safeParseInt(match[1]);
                if (rent !== null) {
                    this.logExtractionSuccess('alternative rent estimate', rent);
                    return rent;
                }
            }
        }

        this.logExtractionError('Rent Zestimate', 'No rent estimate available');
        return null;
    }
} 
import { PropertyDataExtractor } from '../base/PropertyDataExtractor';
import { RENT_SELECTORS } from '../selectors/rentSelectors';
import { ERROR_MESSAGES } from '@/constants/selectors';
import { ZillowPropertyJson } from '@/types/zillowPropertyJson';

export class RentZestimateExtractor extends PropertyDataExtractor<number> {
    protected extractFromJson(property: ZillowPropertyJson): number | null {
        if (property.rentZestimate !== undefined) {
            this.logExtractionSuccess('JSON', property.rentZestimate);
            return property.rentZestimate;
        }
        return null;
    }

    protected async extractFromDOM(): Promise<number | null> {
        this.logExtractionStart('rent zestimate');
        
        // Try Rent Zestimate first
        const rentElement = document.querySelector(RENT_SELECTORS.ZESTIMATE);
        if (rentElement?.textContent) {
            const match = rentElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                const rentZestimate = this.safeParseInt(match[1]);
                if (rentZestimate !== null) {
                    this.logExtractionSuccess('DOM (zestimate)', rentZestimate);
                    return rentZestimate;
                }
            }
        }

        // Try alternative rent estimate
        const altRentElement = document.querySelector(RENT_SELECTORS.RENT_ESTIMATE);
        if (altRentElement?.textContent) {
            const match = altRentElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                const rentZestimate = this.safeParseInt(match[1]);
                if (rentZestimate !== null) {
                    this.logExtractionSuccess('DOM (alternative)', rentZestimate);
                    return rentZestimate;
                }
            }
        }

        this.logExtractionError('rent zestimate', ERROR_MESSAGES.MISSING_RENTAL_ESTIMATE);
        return null;
    }
} 
import { BaseExtractor } from '../base/BaseExtractor';
import { BED_BATH_SELECTORS } from '../selectors/bedBathSelectors';
import { ERROR_MESSAGES } from '@/constants/selectors';

export interface BedBathData {
    bedrooms: number | null;
    bathrooms: number | null;
}

export class BedBathExtractor extends BaseExtractor {
    async extract(): Promise<BedBathData> {
        const bedrooms = await this.extractBedrooms();
        const bathrooms = await this.extractBathrooms();
        return { bedrooms, bathrooms };
    }

    async extractBedrooms(): Promise<number | null> {
        this.logExtractionStart('bedrooms');
        
        const bedBathSection = document.querySelector(BED_BATH_SELECTORS.SECTION);
        if (bedBathSection?.textContent) {
            const match = bedBathSection.textContent.match(/(\d+)\s*beds?/i);
            if (match) {
                const bedrooms = this.safeParseInt(match[1]);
                if (bedrooms !== null) {
                    this.logExtractionSuccess('bedrooms', bedrooms);
                    return bedrooms;
                }
            }
        }

        this.logExtractionError('bedrooms', ERROR_MESSAGES.MISSING_BEDROOMS);
        return null;
    }

    async extractBathrooms(): Promise<number | null> {
        this.logExtractionStart('bathrooms');
        
        const bedBathSection = document.querySelector(BED_BATH_SELECTORS.SECTION);
        if (bedBathSection?.textContent) {
            const match = bedBathSection.textContent.match(/(\d+(?:\.\d+)?)\s*baths?/i);
            if (match) {
                const bathrooms = this.safeParseFloat(match[1]);
                if (bathrooms !== null) {
                    this.logExtractionSuccess('bathrooms', bathrooms);
                    return bathrooms;
                }
            }
        }

        this.logExtractionError('bathrooms', ERROR_MESSAGES.MISSING_BATHROOMS);
        return null;
    }
} 
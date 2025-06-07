import { PropertyDataExtractor } from '../base/PropertyDataExtractor';
import { BED_BATH_SELECTORS } from '../selectors/bedBathSelectors';
import { ERROR_MESSAGES } from '@/constants/selectors';
import { ZillowPropertyJson } from '@/types/zillowPropertyJson';

export interface BedBathData {
    bedrooms: number | null;
    bathrooms: number | null;
}

export class BedBathExtractor extends PropertyDataExtractor<BedBathData> {
    protected extractFromJson(property: ZillowPropertyJson): BedBathData | null {
        const bedrooms = property.bedrooms ?? property.resoFacts?.bedrooms;
        const bathrooms = property.bathrooms ?? property.resoFacts?.bathrooms;
        
        if (typeof bedrooms === 'number' || typeof bathrooms === 'number') {
            return {
                bedrooms: typeof bedrooms === 'number' ? bedrooms : null,
                bathrooms: typeof bathrooms === 'number' ? bathrooms : null
            };
        }
        return null;
    }

    protected async extractFromDOM(): Promise<BedBathData | null> {
        this.logExtractionStart('bed/bath');
        
        const bedBathSection = document.querySelector(BED_BATH_SELECTORS.SECTION);
        if (!bedBathSection?.textContent) {
            this.logExtractionError('bed/bath', ERROR_MESSAGES.MISSING_BEDROOMS);
            return { bedrooms: null, bathrooms: null };
        }

        const bedrooms = await this.extractBedrooms(bedBathSection);
        const bathrooms = await this.extractBathrooms(bedBathSection);

        return { bedrooms, bathrooms };
    }

    private async extractBedrooms(section: Element): Promise<number | null> {
        const match = section.textContent?.match(/(\d+)\s*beds?/i);
        if (match) {
            const bedrooms = this.safeParseInt(match[1]);
            if (bedrooms !== null) {
                this.logExtractionSuccess('DOM (bedrooms)', bedrooms);
                return bedrooms;
            }
        }
        this.logExtractionError('bedrooms', ERROR_MESSAGES.MISSING_BEDROOMS);
        return null;
    }

    private async extractBathrooms(section: Element): Promise<number | null> {
        const match = section.textContent?.match(/(\d+(?:\.\d+)?)\s*baths?/i);
        if (match) {
            const bathrooms = this.safeParseFloat(match[1]);
            if (bathrooms !== null) {
                this.logExtractionSuccess('DOM (bathrooms)', bathrooms);
                return bathrooms;
            }
        }
        this.logExtractionError('bathrooms', ERROR_MESSAGES.MISSING_BATHROOMS);
        return null;
    }
} 
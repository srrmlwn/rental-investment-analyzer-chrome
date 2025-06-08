import { PropertyDataExtractor } from '../base/PropertyDataExtractor';
import { BED_BATH_SELECTORS } from '../selectors/bedBathSelectors';
import { ERROR_MESSAGES } from '@/constants/selectors';
import { ZillowPropertyJson } from '@/types/zillowPropertyJson';
import { extractNumberFromText } from '@/utils/numberUtils';

export interface BedBathData {
    bedrooms: number | null;
    bathrooms: number | null;
}

export class BedBathExtractor extends PropertyDataExtractor<BedBathData> {
    protected extractFromJson(property: ZillowPropertyJson): BedBathData | null {
        // First try to get data from direct fields
        const bedrooms = property.bedrooms ?? property.resoFacts?.bedrooms;
        const bathrooms = property.bathrooms ?? property.resoFacts?.bathrooms;
        
        // Check if we have valid numbers (not 0 or null/undefined)
        const hasValidBedrooms = typeof bedrooms === 'number' && bedrooms > 0;
        const hasValidBathrooms = typeof bathrooms === 'number' && bathrooms > 0;
        
        // If we have at least one valid number, return what we have
        if (hasValidBedrooms || hasValidBathrooms) {
            return {
                bedrooms: hasValidBedrooms ? bedrooms : null,
                bathrooms: hasValidBathrooms ? bathrooms : null
            };
        }

        // If we have 0 or null values, or if we don't have any valid numbers,
        // try to extract from description
        if (property.description) {
            const descData = this.extractFromDescription(property.description);
            if (descData.bedrooms !== null || descData.bathrooms !== null) {
                this.logExtractionSuccess('JSON (description)', descData);
                return descData;
            }
        }

        // If we couldn't extract from description either, return null
        return null;
    }

    private extractFromDescription(description: string): BedBathData {
        let bedrooms: number | null = null;
        let bathrooms: number | null = null;

        // Try to find patterns like "2bed 1bath", "2 bed, 1 bath", "2 beds, 1 baths", "2Bed 1Bath", etc.
        // First try numeric patterns
        const numericBedBathPattern = /(\d+)(?:\s*bed|bed|beds?)(?:\s*[,/]?\s*|\s+)(\d+(?:\.\d+)?)(?:\s*bath|bath|baths?)/i;
        const numericMatch = description.match(numericBedBathPattern);
        
        if (numericMatch) {
            bedrooms = this.safeParseInt(numericMatch[1]);
            bathrooms = this.safeParseFloat(numericMatch[2]);
        } else {
            // Try written number patterns
            const writtenBedBathPattern = /(?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|single|double|triple|quadruple)(?:\s*bed|bed|beds?)(?:\s*[,/]?\s*|\s+)(?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|single|double|triple|quadruple)(?:\s*bath|bath|baths?)/i;
            const writtenMatch = description.match(writtenBedBathPattern);
            
            if (writtenMatch) {
                const parts = writtenMatch[0].split(/(?:\s*bed|bed|beds?)\s*/i);
                if (parts.length >= 2) {
                    bedrooms = extractNumberFromText(parts[0]);
                    bathrooms = extractNumberFromText(parts[1]);
                }
            } else {
                // Try to find bed and bath separately
                const bedMatch = description.match(/(?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|single|double|triple|quadruple)(?:\s*bed|bed|beds?)\b/i);
                if (bedMatch) {
                    bedrooms = extractNumberFromText(bedMatch[0]);
                }

                const bathMatch = description.match(/(?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|single|double|triple|quadruple)(?:\s*bath|bath|baths?)\b/i);
                if (bathMatch) {
                    bathrooms = extractNumberFromText(bathMatch[0]);
                }
            }
        }

        return { bedrooms, bathrooms };
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
        // Try numeric pattern first
        const numericMatch = section.textContent?.match(/(\d+)(?:\s*bed|bed|beds?)/i);
        if (numericMatch) {
            const bedrooms = this.safeParseInt(numericMatch[1]);
            if (bedrooms !== null) {
                this.logExtractionSuccess('DOM (bedrooms)', bedrooms);
                return bedrooms;
            }
        }

        // Try written numbers
        const writtenMatch = section.textContent?.match(/(?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|single|double|triple|quadruple)(?:\s*bed|bed|beds?)\b/i);
        if (writtenMatch) {
            const bedrooms = extractNumberFromText(writtenMatch[0]);
            if (bedrooms !== null) {
                this.logExtractionSuccess('DOM (bedrooms - written)', bedrooms);
                return bedrooms;
            }
        }

        this.logExtractionError('bedrooms', ERROR_MESSAGES.MISSING_BEDROOMS);
        return null;
    }

    private async extractBathrooms(section: Element): Promise<number | null> {
        // Try numeric pattern first
        const numericMatch = section.textContent?.match(/(\d+(?:\.\d+)?)(?:\s*bath|bath|baths?)/i);
        if (numericMatch) {
            const bathrooms = this.safeParseFloat(numericMatch[1]);
            if (bathrooms !== null) {
                this.logExtractionSuccess('DOM (bathrooms)', bathrooms);
                return bathrooms;
            }
        }

        // Try written numbers
        const writtenMatch = section.textContent?.match(/(?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|single|double|triple|quadruple)(?:\s*bath|bath|baths?)\b/i);
        if (writtenMatch) {
            const bathrooms = extractNumberFromText(writtenMatch[0]);
            if (bathrooms !== null) {
                this.logExtractionSuccess('DOM (bathrooms - written)', bathrooms);
                return bathrooms;
            }
        }

        this.logExtractionError('bathrooms', ERROR_MESSAGES.MISSING_BATHROOMS);
        return null;
    }
} 
import { PropertyDataExtractor } from '../base/PropertyDataExtractor';
import { UNITS_SELECTORS } from '../selectors/unitsSelectors';
import { ERROR_MESSAGES } from '@/constants/selectors';
import { ZillowPropertyJson } from '@/types/zillowPropertyJson';
import { extractNumberFromText } from '@/utils/numberUtils';

export class UnitsExtractor extends PropertyDataExtractor<number> {
    protected extractFromJson(property: ZillowPropertyJson): number | null {
        // Try to get units from various possible JSON fields
        const units = property.units ?? 
                     property.resoFacts?.units ?? 
                     property.multiFamilyUnits?.totalUnits;
        
        if (typeof units === 'number' && units > 0) {
            return units;
        }

        // For multi-family properties, try to infer units from description
        if (property.description) {
            // Try numeric patterns first
            const numericMatch = property.description.match(/(\d+)\s*(?:unit|units)/i);
            if (numericMatch) {
                const inferredUnits = parseInt(numericMatch[1]);
                if (!isNaN(inferredUnits) && inferredUnits > 0) {
                    return inferredUnits;
                }
            }

            // Try written numbers
            const writtenMatch = property.description.match(/(?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|single|double|triple|quadruple)\s*(?:unit|units)/i);
            if (writtenMatch) {
                const inferredUnits = extractNumberFromText(writtenMatch[0]);
                if (inferredUnits !== null && inferredUnits > 0) {
                    return inferredUnits;
                }
            }

            // Try to find units in phrases like "duplex" (2 units), "triplex" (3 units)
            const unitTypeMatch = property.description.match(/(?:duplex|triplex|quadplex|fourplex|fiveplex|sixplex)/i);
            if (unitTypeMatch) {
                const unitType = unitTypeMatch[0].toLowerCase();
                const unitTypeMap: Record<string, number> = {
                    'duplex': 2,
                    'triplex': 3,
                    'quadplex': 4,
                    'fourplex': 4,
                    'fiveplex': 5,
                    'sixplex': 6
                };
                return unitTypeMap[unitType] || null;
            }
        }

        return null;
    }

    protected async extractFromDOM(): Promise<number | null> {
        this.logExtractionStart('units');
        
        // Try dedicated units element first
        const unitsElement = document.querySelector(UNITS_SELECTORS.UNITS);
        if (unitsElement?.textContent) {
            // Try numeric pattern
            const numericMatch = unitsElement.textContent.match(/(\d+)\s*(?:unit|units)/i);
            if (numericMatch) {
                const units = this.safeParseInt(numericMatch[1]);
                if (units !== null && units > 0) {
                    this.logExtractionSuccess('DOM (units element)', units);
                    return units;
                }
            }

            // Try written numbers
            const writtenMatch = unitsElement.textContent.match(/(?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|single|double|triple|quadruple)\s*(?:unit|units)/i);
            if (writtenMatch) {
                const units = extractNumberFromText(writtenMatch[0]);
                if (units !== null && units > 0) {
                    this.logExtractionSuccess('DOM (units element - written)', units);
                    return units;
                }
            }
        }

        // Try property description
        const descElement = document.querySelector(UNITS_SELECTORS.DESCRIPTION);
        if (descElement?.textContent) {
            const units = this.extractUnitsFromText(descElement.textContent);
            if (units !== null) {
                this.logExtractionSuccess('DOM (description)', units);
                return units;
            }
        }

        // Try property details section
        const detailsElement = document.querySelector(UNITS_SELECTORS.DETAILS);
        if (detailsElement?.textContent) {
            const units = this.extractUnitsFromText(detailsElement.textContent);
            if (units !== null) {
                this.logExtractionSuccess('DOM (details)', units);
                return units;
            }
        }

        this.logExtractionError('units', ERROR_MESSAGES.MISSING_UNITS);
        return null;
    }

    private extractUnitsFromText(text: string): number | null {
        // Try numeric pattern
        const numericMatch = text.match(/(\d+)\s*(?:unit|units)/i);
        if (numericMatch) {
            const units = this.safeParseInt(numericMatch[1]);
            if (units !== null && units > 0) {
                return units;
            }
        }

        // Try written numbers
        const writtenMatch = text.match(/(?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|single|double|triple|quadruple)\s*(?:unit|units)/i);
        if (writtenMatch) {
            const units = extractNumberFromText(writtenMatch[0]);
            if (units !== null && units > 0) {
                return units;
            }
        }

        // Try to find units in phrases like "duplex" (2 units), "triplex" (3 units)
        const unitTypeMatch = text.match(/(?:duplex|triplex|quadplex|fourplex|fiveplex|sixplex)/i);
        if (unitTypeMatch) {
            const unitType = unitTypeMatch[0].toLowerCase();
            const unitTypeMap: Record<string, number> = {
                'duplex': 2,
                'triplex': 3,
                'quadplex': 4,
                'fourplex': 4,
                'fiveplex': 5,
                'sixplex': 6
            };
            return unitTypeMap[unitType] || null;
        }

        return null;
    }
} 
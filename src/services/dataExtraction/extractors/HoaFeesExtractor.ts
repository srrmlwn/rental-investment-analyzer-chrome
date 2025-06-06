import { BaseExtractor } from '../base/BaseExtractor';
import { HOA_SELECTORS } from '../selectors/hoaSelectors';

export class HoaFeesExtractor extends BaseExtractor {
    async extract(): Promise<number | null> {
        this.logExtractionStart('HOA fees');
        
        // Try primary HOA fees element
        const hoaElement = document.querySelector(HOA_SELECTORS.FEES);
        if (hoaElement?.textContent) {
            const match = hoaElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                const hoaFees = this.safeParseInt(match[1]);
                if (hoaFees !== null) {
                    this.logExtractionSuccess('HOA fees', hoaFees);
                    return hoaFees;
                }
            }
        }

        // Try monthly HOA element
        const monthlyElement = document.querySelector(HOA_SELECTORS.MONTHLY);
        if (monthlyElement?.textContent) {
            const match = monthlyElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                const hoaFees = this.safeParseInt(match[1]);
                if (hoaFees !== null) {
                    this.logExtractionSuccess('monthly HOA fees', hoaFees);
                    return hoaFees;
                }
            }
        }

        this.logExtractionError('HOA fees', 'No HOA fees available');
        return null;  // Return null to be consistent with other extractors
    }
} 
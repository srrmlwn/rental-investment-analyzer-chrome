import { PropertyDataExtractor } from '../base/PropertyDataExtractor';
import { HOA_SELECTORS } from '../selectors/hoaSelectors';
import { ERROR_MESSAGES } from '@/constants/selectors';
import { ZillowPropertyJson } from '@/types/zillowPropertyJson';

export class HoaFeesExtractor extends PropertyDataExtractor<number> {
    protected extractFromJson(property: ZillowPropertyJson): number | null {
        if (property.monthlyHoaFee?.value !== undefined) {
            this.logExtractionSuccess('JSON', property.monthlyHoaFee.value);
            return property.monthlyHoaFee.value;
        }
        return null;
    }

    protected async extractFromDOM(): Promise<number | null> {
        this.logExtractionStart('HOA fees');
        
        // Try primary HOA fees element
        const hoaElement = document.querySelector(HOA_SELECTORS.FEES);
        if (hoaElement?.textContent) {
            const match = hoaElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                const hoaFees = this.safeParseInt(match[1]);
                if (hoaFees !== null) {
                    this.logExtractionSuccess('DOM (primary)', hoaFees);
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
                    this.logExtractionSuccess('DOM (monthly)', hoaFees);
                    return hoaFees;
                }
            }
        }

        this.logExtractionError('HOA fees', ERROR_MESSAGES.MISSING_HOA_FEES);
        return null;
    }
} 
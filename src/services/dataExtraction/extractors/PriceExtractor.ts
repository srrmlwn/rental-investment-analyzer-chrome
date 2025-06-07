import { PropertyDataExtractor } from '../base/PropertyDataExtractor';
import { PRICE_SELECTORS } from '../selectors/priceSelectors';
import { ERROR_MESSAGES } from '@/constants/selectors';
import { ZillowPropertyJson } from '@/types/zillowPropertyJson';

export class PriceExtractor extends PropertyDataExtractor<number> {
    protected extractFromJson(property: ZillowPropertyJson): number | null {
        if (typeof property.price === 'number') {
            return property.price;
        }
        return null;
    }

    protected async extractFromDOM(): Promise<number | null> {
        this.logExtractionStart('price');
        
        // Try primary price selector first
        const priceElement = document.querySelector(PRICE_SELECTORS.PRIMARY);
        if (priceElement?.textContent) {
            const match = priceElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                const price = this.safeParseInt(match[1]);
                if (price) {
                    this.logExtractionSuccess('DOM (primary)', price);
                    return price;
                }
            }
        }

        // Try alternative price selector
        const altPriceElement = document.querySelector(PRICE_SELECTORS.ALTERNATIVE);
        if (altPriceElement?.textContent) {
            const match = altPriceElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                const price = this.safeParseInt(match[1]);
                if (price) {
                    this.logExtractionSuccess('DOM (alternative)', price);
                    return price;
                }
            }
        }

        this.logExtractionError('price', ERROR_MESSAGES.MISSING_PRICE);
        return null;
    }
} 
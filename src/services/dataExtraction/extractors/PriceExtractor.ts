import { BaseExtractor } from '../base/BaseExtractor';
import { PRICE_SELECTORS } from '../selectors/priceSelectors';
import { ERROR_MESSAGES } from '@/constants/selectors';

export class PriceExtractor extends BaseExtractor {
    async extract(): Promise<number | null> {
        this.logExtractionStart('price');
        
        // Try primary price selector first
        const priceElement = document.querySelector(PRICE_SELECTORS.PRIMARY);
        if (priceElement?.textContent) {
            const match = priceElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                const price = this.safeParseInt(match[1]);
                if (price) {
                    this.logExtractionSuccess('price from primary selector', price);
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
                    this.logExtractionSuccess('price from alternative selector', price);
                    return price;
                }
            }
        }

        this.logExtractionError('price', ERROR_MESSAGES.MISSING_PRICE);
        return null;
    }
} 
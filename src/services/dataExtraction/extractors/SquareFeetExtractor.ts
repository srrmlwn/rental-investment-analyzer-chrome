import { BaseExtractor } from '../base/BaseExtractor';
import { SQUARE_FEET_SELECTORS } from '../selectors/squareFeetSelectors';
import { ERROR_MESSAGES } from '@/constants/selectors';

export class SquareFeetExtractor extends BaseExtractor {
    async extract(): Promise<number | null> {
        this.logExtractionStart('square footage');
        
        const containers = document.querySelectorAll(SQUARE_FEET_SELECTORS.CONTAINER);
        for (const container of containers) {
            const descriptionText = container.querySelector(SQUARE_FEET_SELECTORS.DESCRIPTION)?.textContent;
            if (descriptionText === 'sqft') {
                const valueText = container.querySelector(SQUARE_FEET_SELECTORS.VALUE)?.textContent;
                if (valueText) {
                    const sqft = this.safeParseInt(valueText);
                    if (sqft !== null) {
                        this.logExtractionSuccess('square footage', sqft);
                        return sqft;
                    }
                }
            }
        }

        this.logExtractionError('square footage', ERROR_MESSAGES.MISSING_SQUARE_FEET);
        return null;
    }
} 
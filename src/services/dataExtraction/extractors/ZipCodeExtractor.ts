import { BaseExtractor } from '../base/BaseExtractor';
import { ZIP_CODE_SELECTORS } from '../selectors/zipCodeSelectors';
import { ERROR_MESSAGES } from '@/constants/selectors';

export class ZipCodeExtractor extends BaseExtractor {
    async extract(): Promise<string | null> {
        this.logExtractionStart('zip code');
        
        // Try meta title first
        const metaTitle = document.querySelector(ZIP_CODE_SELECTORS.ADDRESS);
        if (metaTitle) {
            const content = this.getElementAttribute(metaTitle, 'content');
            if (content) {
                const match = content.match(/\b\d{5}\b/);
                if (match) {
                    const zipCode = match[0];
                    this.logExtractionSuccess('zip code from meta', zipCode);
                    return zipCode;
                }
            }
        }

        // Try dedicated zip code element
        const zipElement = document.querySelector(ZIP_CODE_SELECTORS.ZIP_CODE);
        if (zipElement?.textContent) {
            const match = zipElement.textContent.match(/\b\d{5}\b/);
            if (match) {
                const zipCode = match[0];
                this.logExtractionSuccess('zip code from element', zipCode);
                return zipCode;
            }
        }

        this.logExtractionError('zip code', ERROR_MESSAGES.MISSING_ZIP_CODE);
        return null;
    }
} 
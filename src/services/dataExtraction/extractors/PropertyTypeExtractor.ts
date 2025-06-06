import { BaseExtractor } from '../base/BaseExtractor';
import { PROPERTY_TYPE_SELECTORS } from '../selectors/propertyTypeSelectors';
import { ERROR_MESSAGES } from '@/constants/selectors';

export type PropertyType = 'Single Family' | 'Condo' | 'Multi Family';

export class PropertyTypeExtractor extends BaseExtractor {
    async extract(): Promise<PropertyType | null> {
        this.logExtractionStart('property type');
        
        // Try meta description first
        const metaDesc = document.querySelector(PROPERTY_TYPE_SELECTORS.META_DESC);
        if (metaDesc) {
            const content = this.getElementAttribute(metaDesc, 'content');
            if (content) {
                const type = this.extractTypeFromContent(content);
                if (type) {
                    this.logExtractionSuccess('property type from meta', type);
                    return type;
                }
            }
        }

        // Try dedicated property type element
        const typeElement = document.querySelector(PROPERTY_TYPE_SELECTORS.PROPERTY_TYPE);
        if (typeElement?.textContent) {
            const type = this.extractTypeFromContent(typeElement.textContent);
            if (type) {
                this.logExtractionSuccess('property type from element', type);
                return type;
            }
        }

        this.logExtractionError('property type', ERROR_MESSAGES.MISSING_PROPERTY_TYPE);
        return null;
    }

    private extractTypeFromContent(content: string): PropertyType | null {
        if (content.includes('Single Family')) return 'Single Family';
        if (content.includes('Condo')) return 'Condo';
        if (content.includes('Multi Family')) return 'Multi Family';
        return null;
    }
} 
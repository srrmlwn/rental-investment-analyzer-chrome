import { ZillowPropertyJson } from '@/types/zillowPropertyJson';

export abstract class PropertyDataExtractor<T> {
    protected abstract extractFromJson(property: ZillowPropertyJson): T | null;
    protected abstract extractFromDOM(): Promise<T | null>;
    
    async extract(property: ZillowPropertyJson | null): Promise<T | null> {
        // First try to get data from JSON if available
        if (property) {
            const result = this.extractFromJson(property);
            if (result !== null) {
                this.logExtractionSuccess('from JSON', result);
                return result;
            }
        }
        
        // Fallback to DOM extraction
        return this.extractFromDOM();
    }

    protected logExtractionStart(field: string): void {
        console.log(`🔍 Starting ${field} extraction...`);
    }

    protected logExtractionSuccess(source: string, value: any): void {
        console.log(`✅ Extracted from ${source}:`, value);
    }

    protected logExtractionError(field: string, error: string): void {
        console.error(`❌ Failed to extract ${field}:`, error);
    }

    protected safeParseInt(value: string | null | undefined): number | null {
        if (!value) return null;
        const parsed = parseInt(value.replace(/,/g, ''));
        return isNaN(parsed) ? null : parsed;
    }

    protected safeParseFloat(value: string | null | undefined): number | null {
        if (!value) return null;
        const parsed = parseFloat(value.replace(/,/g, ''));
        return isNaN(parsed) ? null : parsed;
    }

    protected getElementText(element: Element | null): string | null {
        return element?.textContent?.trim() || null;
    }

    protected getElementAttribute(element: Element | null, attr: string): string | null {
        return element?.getAttribute(attr)?.trim() || null;
    }
} 
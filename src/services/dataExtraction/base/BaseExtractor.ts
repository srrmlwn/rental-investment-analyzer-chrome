import { PropertyData } from '@/types/propertyData';

export abstract class BaseExtractor {
    protected abstract extract(): Promise<any>;

    protected logExtractionStart(field: string): void {
        console.log(`🔍 Starting ${field} extraction...`);
    }

    protected logExtractionSuccess(field: string, value: any): void {
        console.log(`✅ Extracted ${field}:`, value);
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
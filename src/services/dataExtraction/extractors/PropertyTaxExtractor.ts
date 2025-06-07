import { PropertyDataExtractor } from '../base/PropertyDataExtractor';
import { TAX_SELECTORS } from '../selectors/taxSelectors';
import { PRICE_SELECTORS } from '../selectors/priceSelectors';
import { ERROR_MESSAGES } from '@/constants/selectors';
import { ZillowPropertyJson } from '@/types/zillowPropertyJson';

export interface PropertyTaxData {
    rate: number | null;
    monthlyAmount: number | null;
}

export class PropertyTaxExtractor extends PropertyDataExtractor<PropertyTaxData> {
    protected extractFromJson(property: ZillowPropertyJson): PropertyTaxData | null {
        // Try to get the rate directly from propertyTaxRate first
        if (typeof property.propertyTaxRate === 'number') {
            const rate = property.propertyTaxRate;
            const monthlyAmount = property.taxAnnualAmount ? Math.round(property.taxAnnualAmount / 12) : null;
            return { rate, monthlyAmount };
        }

        // Fallback to calculating rate from annual tax and price
        const annualTax = property.taxAnnualAmount;
        const price = property.price;

        if (typeof annualTax === 'number' && typeof price === 'number' && price > 0) {
            const rate = (annualTax / price) * 100;
            const monthlyAmount = Math.round(annualTax / 12);
            return { rate, monthlyAmount };
        }

        return null;
    }

    protected async extractFromDOM(): Promise<PropertyTaxData | null> {
        const rate = await this.extractRate();
        const monthlyAmount = await this.extractMonthlyAmount();
        return { rate, monthlyAmount };
    }

    private async extractRate(): Promise<number | null> {
        this.logExtractionStart('property tax rate');
        
        const taxElement = document.querySelector(TAX_SELECTORS.RATE_INPUT);
        if (taxElement?.id === 'property-tax') {
            const taxRate = this.safeParseFloat((taxElement as HTMLInputElement).value);
            if (taxRate !== null) {
                this.logExtractionSuccess('DOM (rate input)', taxRate);
                return taxRate;
            }
        }

        // Try to extract rate from monthly amount if available
        const monthlyTax = await this.extractMonthlyAmount();
        if (monthlyTax !== null) {
            const price = await this.extractPrice();
            if (price) {
                const annualTax = monthlyTax * 12;
                const taxRate = (annualTax / price) * 100;
                this.logExtractionSuccess('DOM (calculated from monthly)', taxRate);
                return taxRate;
            }
        }

        this.logExtractionError('property tax rate', 'No rate available');
        return null;
    }

    private async extractMonthlyAmount(): Promise<number | null> {
        this.logExtractionStart('monthly property tax');
        
        const taxElement = document.querySelector(TAX_SELECTORS.MONTHLY_AMOUNT);
        if (taxElement?.textContent) {
            const match = taxElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                const monthlyTax = this.safeParseInt(match[1]);
                if (monthlyTax !== null) {
                    this.logExtractionSuccess('DOM (monthly amount)', monthlyTax);
                    return monthlyTax;
                }
            }
        }

        this.logExtractionError('monthly property tax', 'No monthly amount available');
        return null;
    }

    private async extractPrice(): Promise<number | null> {
        const priceElement = document.querySelector(PRICE_SELECTORS.PRIMARY);
        if (priceElement?.textContent) {
            const match = priceElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                return this.safeParseInt(match[1]);
            }
        }
        return null;
    }
} 
import { BaseExtractor } from '../base/BaseExtractor';
import { TAX_SELECTORS } from '../selectors/taxSelectors';
import { PRICE_SELECTORS } from '../selectors/priceSelectors';
import { ERROR_MESSAGES } from '@/constants/selectors';

export interface PropertyTaxData {
    rate: number | null;
    monthlyAmount: number | null;
}

export class PropertyTaxExtractor extends BaseExtractor {
    async extract(): Promise<PropertyTaxData> {
        const rate = await this.extractRate();
        const monthlyAmount = await this.extractMonthlyAmount();
        return { rate, monthlyAmount };
    }

    async extractRate(): Promise<number | null> {
        this.logExtractionStart('property tax rate');
        
        const taxElement = document.querySelector(TAX_SELECTORS.RATE_INPUT);
        if (taxElement?.id === 'property-tax') {
            const taxRate = this.safeParseFloat((taxElement as HTMLInputElement).value);
            if (taxRate !== null) {
                this.logExtractionSuccess('property tax rate from input', taxRate);
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
                this.logExtractionSuccess('property tax rate from monthly amount', taxRate);
                return taxRate;
            }
        }

        this.logExtractionError('property tax rate', 'No rate available');
        return null;
    }

    async extractMonthlyAmount(): Promise<number | null> {
        this.logExtractionStart('monthly property tax');
        
        const taxElement = document.querySelector(TAX_SELECTORS.MONTHLY_AMOUNT);
        if (taxElement?.textContent) {
            const match = taxElement.textContent.match(/\$([\d,]+)/);
            if (match) {
                const monthlyTax = this.safeParseInt(match[1]);
                if (monthlyTax !== null) {
                    this.logExtractionSuccess('monthly property tax', monthlyTax);
                    return monthlyTax;
                }
            }
        }

        this.logExtractionError('monthly property tax', 'No monthly amount available');
        return null;
    }

    async extractMonthlyTaxes(price: number, propertyTaxRate: number | null): Promise<number | null> {
        this.logExtractionStart('monthly property taxes');
        
        if (propertyTaxRate !== null && price) {
            const annualTax = (propertyTaxRate / 100) * price;
            const monthlyTax = Math.round(annualTax / 12);
            this.logExtractionSuccess('monthly property taxes from rate', monthlyTax);
            return monthlyTax;
        }

        const monthlyTax = await this.extractMonthlyAmount();
        if (monthlyTax !== null) {
            return monthlyTax;
        }

        this.logExtractionError('monthly property taxes', 'No taxes available');
        return null;
    }

    // Helper method to get price - this should be injected or moved to a shared service
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
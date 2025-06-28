import { PropertyData } from '../types/propertyData';
import { CalculationInputs } from '../types/calculationInputs';
import { CalculatedMetrics } from '../types/calculatedMetrics';

export interface ExportData {
  propertyData: PropertyData;
  calculationInputs: CalculationInputs;
  calculatedMetrics: CalculatedMetrics;
}

export class ExportService {
  generateCSV(data: ExportData): string {
    const fields: string[] = [];
    const values: string[] = [];
    
    // Property Information
    fields.push('Zillow URL', 'Listing Address', 'Property Price', 'Property Type', 'Bedrooms', 'Bathrooms', 'Units', 'Zip Code');
    values.push(
      data.propertyData.url || 'N/A',
      data.propertyData.address || 'N/A',
      this.formatCurrency(data.propertyData.price),
      data.propertyData.propertyType || 'N/A',
      data.propertyData.bedrooms?.toString() || 'N/A',
      data.propertyData.bathrooms?.toString() || 'N/A',
      data.propertyData.units?.toString() || 'N/A',
      data.propertyData.zipCode || 'N/A',
    );
    
    // Investment Metrics
    fields.push('Monthly Mortgage Payment', 'Monthly Cash Flow', 'Cap Rate', 'Cash-on-Cash Return', 'Total Investment');
    values.push(
      this.formatCurrency(data.calculatedMetrics.monthlyMortgage),
      this.formatCurrency(data.calculatedMetrics.monthlyCashFlow),
      this.formatPercentage(data.calculatedMetrics.capRate),
      this.formatPercentage(data.calculatedMetrics.cashOnCashReturn),
      this.formatCurrency(data.calculatedMetrics.totalInvestment),
    );
    
    // Investment Parameters
    fields.push('Purchase Price', 'Down Payment Percentage', 'Interest Rate', 'Loan Term', 'Closing Costs', 'Rehab Costs', 'After Repair Value', 'Property Management Rate', 'Maintenance Cost', 'Insurance Cost', 'Property Taxes', 'HOA Fees', 'Vacancy Rate', 'Other Income', 'Rent Estimate');
    values.push(
      this.formatCurrency(data.calculationInputs.purchasePrice),
      this.formatPercentage(data.calculationInputs.downPaymentPercentage),
      this.formatPercentage(data.calculationInputs.interestRate),
      `${data.calculationInputs.loanTerm} years`,
      this.formatCurrency(data.calculationInputs.closingCosts),
      this.formatCurrency(data.calculationInputs.rehabCosts),
      this.formatCurrency(data.calculationInputs.afterRepairValue),
      this.formatPercentage(data.calculationInputs.managementRate),
      this.formatCurrency(data.calculationInputs.maintenanceCost),
      this.formatCurrency(data.calculationInputs.insuranceCost),
      this.formatCurrency(data.calculationInputs.propertyTaxes),
      this.formatCurrency(data.calculationInputs.hoaFees),
      this.formatPercentage(data.calculationInputs.vacancyRate),
      this.formatCurrency(data.calculationInputs.otherIncome),
      this.formatCurrency(data.calculationInputs.rentEstimate)
    );
    
    // Combine into CSV format
    const headerRow = fields.map(field => this.escapeCSV(field)).join(',');
    const valueRow = values.map(value => this.escapeCSV(value)).join(',');
    
    return `${headerRow}\n${valueRow}`;
  }

  private escapeCSV(text: string): string {
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  private formatPercentage(rate: number): string {
    return `${rate.toFixed(2)}%`;
  }

  async copyToClipboard(csvContent: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(csvContent);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }
} 
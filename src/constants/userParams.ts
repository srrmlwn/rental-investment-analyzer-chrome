import { CalculationInputs } from '@/types/calculationInputs';
import { ConfigParameter, ConfigCategory } from '@/types/configTypes';
import { PropertyData } from '@/types/propertyData';

export const DEFAULT_CONFIG_VALUES = {
  closingCosts: 3, // 3% default
  rehabCosts: 0,
  downPaymentPercentage: 20, // 20% default
  interestRate: 7.5, // 7.5% default
  loanTerm: 30, // 30 years default
  managementRate: 8, // 8% default
  maintenanceRate: 1, // 1% default
  insuranceRate: 0.5, // 0.5% default
  vacancyRate: 5, // 5% default
  otherIncome: 0
} as const;

class UserParams {
  private configParams: ConfigParameter[];
  private propertyData: PropertyData;

  constructor(propertyData: PropertyData) {
    this.propertyData = propertyData;
    this.configParams = [
    // Purchase Parameters
    {
      id: 'purchasePrice',
      label: 'Purchase Price',
      category: 'Purchase', 
      type: 'currency',
      description: 'Offer price for the property',
      step: 1000,
      unit: '$',
      useSlider: true,
      getMin: () => this.propertyData.price * 0.25, // 25% of list price
      getMax: () => this.propertyData.price * 2,    // 2x list price
    },
    {
      id: 'closingCosts',
      label: 'Closing Costs',
      category: 'Purchase',
      type: 'percentage',
      description: 'Closing costs as percentage of purchase price',
      step: 0.1,
      unit: '%',
      isAdvanced: true,
      useSlider: true,
      getMin: () => 0,
      getMax: () => 100,
    },
    {
      id: 'rehabCosts',
      label: 'Rehab Costs',
      category: 'Purchase',
      type: 'currency',
      description: 'Estimated renovation costs',
      step: 100,
      unit: '$',
      isAdvanced: true,
      useSlider: true,
      getMin: () => 0,
      getMax: () => this.propertyData.price, // 1x purchase price
    },
    {
      id: 'afterRepairValue',
      label: 'After Repair Value',
      category: 'Purchase',
      type: 'currency',
      description: 'Estimated value after renovations',
      step: 1000,
      unit: '$',
      isAdvanced: true,
      useSlider: true,
      getMin: () => this.propertyData.price, // 1x purchase price
      getMax: () => this.propertyData.price * 2, // 2x purchase price
    },
  
    // Loan Parameters
    {
      id: 'downPaymentPercentage',
      label: 'Down Payment',
      category: 'Loan',
      type: 'percentage',
      description: 'Percentage of property price paid as down payment',
      step: 1,
      unit: '%',
      useSlider: true,
      getMin: () => 5,
      getMax: () => 100,
    },
    {
      id: 'interestRate',
      label: 'Interest Rate',
      category: 'Loan',
      type: 'percentage',
      description: 'Annual mortgage interest rate',
      step: 0.25,
      unit: '%',
      useSlider: true,
      getMin: () => 3,
      getMax: () => 12,
    },
    {
      id: 'loanTerm',
      label: 'Loan Term',
      category: 'Loan',
      type: 'number',
      description: 'Length of mortgage in years',
      step: 5,
      useSlider: true,
      getMin: () => 10,
      getMax: () => 40,
    },
  
    // Rental Income Parameters
    {
      id: 'rentEstimate',
      label: 'Monthly Rent',
      category: 'Income',
      type: 'currency',
      description: 'Expected monthly rental income',
      step: 100,
      unit: '$',
      useSlider: true,
      getMin: () => 0,
      getMax: () => (this.propertyData.rentZestimate ?? 0) * 2, // 2x current estimate
    },
    {
      id: 'vacancyRate',
      label: 'Vacancy Rate',
      category: 'Income',
      type: 'percentage',
      description: 'Expected vacancy rate as percentage of annual rent',
      step: 0.5,
      unit: '%',
      isAdvanced: true,
      useSlider: true,
      getMin: () => 0,
      getMax: () => 20,
    },
    {
      id: 'otherIncome',
      label: 'Other Income',
      category: 'Income',
      type: 'currency',
      description: 'Additional monthly income (parking, storage, etc.)',
      step: 100,
      unit: '$',
      isAdvanced: true,
      useSlider: true,
      getMin: () => 0,
      getMax: () => this.propertyData.rentZestimate ?? 0 * 2, // 2x rent estimate
    },
  
    // Operating Expenses
    {
      id: 'managementRate',
      label: 'Property Management',
      category: 'Operating',
      type: 'percentage',
      description: 'Percentage of rent paid to property manager',
      step: 0.5,
      unit: '%',
      useSlider: true,
      getMin: () => 0,
      getMax: () => 30,
    },
    {
      id: 'maintenanceRate',
      label: 'Maintenance',
      category: 'Operating',
      type: 'percentage',
      description: 'Annual maintenance as percentage of property value',
      step: 0.1,
      unit: '%',
      isAdvanced: true,
      useSlider: true,
      getMin: () => 0.5,
      getMax: () => 5,
    },
    {
      id: 'insuranceRate',
      label: 'Insurance Rate',
      category: 'Operating',
      type: 'percentage',
      description: 'Annual insurance rate as percentage of property value',
      step: 0.1,
      unit: '%',
      isAdvanced: true,
      useSlider: true,
      getMin: () => 0.1,
      getMax: () => 2,
    },
    {
      id: 'propertyTaxes',
      label: 'Annual Property Taxes',
      category: 'Operating',
      type: 'currency',
      description: 'Annual property taxes (actual amount)',
      step: 100,
      unit: '$',
      isAdvanced: true,
      useSlider: true,
      getMin: () => 0,
      getMax: () => (this.propertyData.propertyTaxes ?? 0) * 2, // 2x current taxes
    },
    {
      id: 'hoaFees',
      label: 'Monthly HOA Fees',
      category: 'Operating',
      type: 'currency',
      description: 'Monthly HOA fees',
      step: 10,
      unit: '$',
      isAdvanced: true,
      useSlider: true,
      getMin: () => 0,
      getMax: () => (this.propertyData.hoaFees ?? 0) * 2, // 2x current HOA fees
    },
  ];
  }

  public getParametersByCategory(category: ConfigCategory): ConfigParameter[] {
    return this.configParams.filter((param: ConfigParameter) => param.category === category);
  }
  
  public getBasicParameters(): ConfigParameter[] {
    return this.configParams.filter((param: ConfigParameter) => !param.isAdvanced);
  }
  
  public getAdvancedParameters(): ConfigParameter[] {
    return this.configParams.filter((param: ConfigParameter) => param.isAdvanced);
  }
  
  public getParameterByKey(key: keyof CalculationInputs): ConfigParameter | undefined {
    return this.configParams.find((param: ConfigParameter) => param.id === key);
  }

  // Update property data (called when new property is selected)
  public updatePropertyData(propertyData: PropertyData) {
    this.propertyData = propertyData;
  }
}

// Create and export a singleton instance
export const userParams = new UserParams({} as PropertyData);

// Export the class for type usage
export { UserParams };

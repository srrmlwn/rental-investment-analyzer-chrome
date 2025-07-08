import { CalculationInputs } from '@/types/calculationInputs';
import { ConfigParameter, ConfigCategory, CONFIG_CATEGORIES } from '@/types/configTypes';
import { PropertyData } from '@/types/propertyData';

export const DEFAULT_CONFIG_VALUES = {
  closingCosts: 3, // 3% default
  rehabCosts: 0,
  downPaymentPercentage: 25, // 25% default
  interestRate: 6.95, // 6.95% default
  loanTerm: 30, // 30 years default
  managementRate: 10, // 10% default
  maintenanceCost: 100, // $100 monthly maintenance default
  insuranceCost: 100, // $100 monthly insurance default
  vacancyRate: 10, // 10% default
  otherIncome: 0
} as const;

class UserParams {
  private readonly configParams: ConfigParameter[];
  private propertyData: PropertyData;

  constructor(propertyData: PropertyData) {
    this.propertyData = propertyData;
    this.configParams = [
      // Purchase Parameters
      {
        id: 'purchasePrice',
        label: 'Purchase Price',
        category: CONFIG_CATEGORIES.PURCHASE_AND_REHAB,
        type: 'currency',
        description: 'Offer price for the property',
        step: 100,
        unit: '$',
        useSlider: true,
        getMin: () => this.propertyData.price ? this.propertyData.price * 0.25 : 0, // 25% of list price
        getMax: () => {
          const maxValue = this.propertyData.price ? this.propertyData.price * 2 : 0; // 2x list price
          return Math.round(maxValue / 100) * 100; // Round to nearest $100
        },
      },
      {
        id: 'closingCosts',
        label: 'Closing Costs',
        category: CONFIG_CATEGORIES.PURCHASE_AND_REHAB,
        type: 'currency',
        description: 'Closing costs',
        step: 100,
        unit: '$',
        isAdvanced: true,
        useSlider: true,
        getMin: () => 0,
        getMax: () => {
          const maxValue = this.propertyData.price ? this.propertyData.price * 0.1 : 0; // 10% of purchase price
          return Math.round(maxValue / 100) * 100; // Round to nearest $100
        },
      },
      {
        id: 'rehabCosts',
        label: 'Rehab Costs',
        category: CONFIG_CATEGORIES.PURCHASE_AND_REHAB,
        type: 'currency',
        description: 'Estimated renovation costs',
        step: 100,
        unit: '$',
        isAdvanced: true,
        useSlider: true,
        getMin: () => 0,
        getMax: () => {
          const maxValue = this.propertyData.price ? this.propertyData.price : 0; // 1x purchase price
          return Math.round(maxValue / 100) * 100; // Round to nearest $100
        },
      },
      {
        id: 'afterRepairValue',
        label: 'After Repair Value',
        category: CONFIG_CATEGORIES.PURCHASE_AND_REHAB,
        type: 'currency',
        description: 'Estimated value after renovations',
        step: 100,
        unit: '$',
        isAdvanced: true,
        useSlider: true,
        getMin: () => this.propertyData.price ? this.propertyData.price * 0.25 : 0, // 25% of list price
        getMax: () => {
          const maxValue = this.propertyData.price ? this.propertyData.price * 2 : 0; // 2x list price
          return Math.round(maxValue / 100) * 100; // Round to nearest $100
        },
      },

      // Loan Parameters
      {
        id: 'downPaymentPercentage',
        label: 'Down Payment',
        category: CONFIG_CATEGORIES.FINANCING,
        type: 'percentage',
        description: 'Percentage of property price paid as down payment',
        step: 0.1,
        unit: '%',
        useSlider: true,
        getMin: () => 5,
        getMax: () => 100,
      },
      {
        id: 'interestRate',
        label: 'Interest Rate',
        category: CONFIG_CATEGORIES.FINANCING,
        type: 'percentage',
        description: 'Annual mortgage interest rate',
        step: 0.05,
        unit: '%',
        useSlider: true,
        getMin: () => 3,
        getMax: () => 12,
      },
      {
        id: 'loanTerm',
        label: 'Loan Term',
        category: CONFIG_CATEGORIES.FINANCING,
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
        category: CONFIG_CATEGORIES.OPERATING_INCOME,
        type: 'currency',
        description: 'Expected monthly rental income',
        step: 1,
        unit: '$',
        useSlider: true,
        getMin: () => 0,
        getMax: () => {
          var maxValue = 0;
          var unitMultiplier = this.propertyData.units ? this.propertyData.units * 4 : 4;
          if (this.propertyData.rentZestimate) {
            maxValue = this.propertyData.rentZestimate * Math.max(4, unitMultiplier);
          } else if (this.propertyData.hudRentEstimate) {
            maxValue = this.propertyData.hudRentEstimate * Math.max(4, unitMultiplier);
          } else {
            maxValue = 0.03 * (this.propertyData.price ?? 0);
          }
          return Math.round(maxValue / 1) * 1; // Round to nearest $1
        },
        isErrorValue: (value: number) => value === 0,
        getErrorMessage: () =>
          "We are unable to calculate a rent estimate for this property. Please enter the expected monthly rent for this property.",
      },
      {
        id: 'vacancyRate',
        label: 'Vacancy Rate',
        category: CONFIG_CATEGORIES.OPERATING_INCOME,
        type: 'percentage',
        description: 'Expected vacancy rate',
        step: 0.1,
        unit: '%',
        isAdvanced: true,
        useSlider: true,
        getMin: () => 0,
        getMax: () => 20,
      },
      {
        id: 'otherIncome',
        label: 'Other Income',
        category: CONFIG_CATEGORIES.OPERATING_INCOME,
        type: 'currency',
        description: 'Additional monthly income (parking, storage, etc.)',
        step: 100,
        unit: '$',
        isAdvanced: true,
        useSlider: true,
        getMin: () => 0,
        getMax: () => {
          const maxValue = this.propertyData.rentZestimate ?? 0.05 * (this.propertyData.price ?? 0);  
          return Math.round(maxValue / 100) * 100; // Round to nearest $100
        },
      },

      // Operating Expenses
      {
        id: 'managementRate',
        label: 'Property Management',
        category: CONFIG_CATEGORIES.OPERATING_EXPENSES,
        type: 'percentage',
        description: 'Percentage of rent paid to property manager',
        step: 0.1,
        unit: '%',
        useSlider: true,
        getMin: () => 0,
        getMax: () => 30,
      },
      {
        id: 'maintenanceCost',
        label: 'Monthly Maintenance',
        category: CONFIG_CATEGORIES.OPERATING_EXPENSES,
        type: 'currency',
        description: 'Monthly maintenance costs in dollars',
        step: 1,
        unit: '$',
        isAdvanced: true,
        useSlider: true,
        getMin: () => 0,
        getMax: () => {
          const maxValue = this.propertyData.price ? (this.propertyData.price * 0.05) / 12 : 4000;
          return Math.round(maxValue / 1) * 1; // Round to nearest $1
        },
      },
      {
        id: 'insuranceCost',
        label: 'Monthly Insurance',
        category: CONFIG_CATEGORIES.OPERATING_EXPENSES,
        type: 'currency',
        description: 'Monthly insurance costs in dollars',
        step: 1,
        unit: '$',
        isAdvanced: true,
        useSlider: true,
        getMin: () => 0,
        getMax: () => {
          const maxValue = this.propertyData.price ? (this.propertyData.price * 0.02) / 12 : 2000;
          return Math.round(maxValue / 1) * 1; // Round to nearest $1
        },
      },
      {
        id: 'propertyTaxes',
        label: 'Monthly Property Taxes',
        category: CONFIG_CATEGORIES.OPERATING_EXPENSES,
        type: 'currency',
        description: 'Monthly property taxes (actual amount)',
        step: 1,
        unit: '$',
        isAdvanced: true,
        useSlider: true,
        getMin: () => 0,
        getMax: () => {
          const maxValue = 2 * (propertyData.price ?? 0) * (propertyData.propertyTaxRate ?? 0) / (12 * 100)
          return Math.round(maxValue / 1) * 1; // Round to nearest $1
        },
        isErrorValue: (value: number) => value === 0,
        getErrorMessage: () =>
          "Property taxes not found. Please enter the annual property tax amount.",
      },
      {
        id: 'hoaFees',
        label: 'Monthly HOA Fees',
        category: CONFIG_CATEGORIES.OPERATING_EXPENSES,
        type: 'currency',
        description: 'Monthly HOA fees',
        step: 1,
        unit: '$',
        isAdvanced: true,
        useSlider: true,
        getMin: () => 0,
        getMax: () => {
          const maxValue = (this.propertyData.hoaFees ?? 0) * 2; // 2x current HOA fees
          return Math.round(maxValue / 1) * 1; // Round to nearest $1
        },
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

  public getAllParameters(): ConfigParameter[] {
    return this.configParams;
  }

  public getParameterByKey(key: keyof CalculationInputs): ConfigParameter | undefined {
    return this.configParams.find(param => param.id === key);
  }

  public getDefaultValue(key: keyof CalculationInputs): number {
    // If the property exists in DEFAULT_CONFIG_VALUES, return that default
    if (key in DEFAULT_CONFIG_VALUES) {
      return DEFAULT_CONFIG_VALUES[key as keyof typeof DEFAULT_CONFIG_VALUES];
    }
    
    // For properties not in DEFAULT_CONFIG_VALUES (extracted from listing), return current value
    switch (key) {
      case 'purchasePrice':
      case 'afterRepairValue':
        return this.propertyData.price ?? 0;
      case 'rentEstimate':
        return this.propertyData.rentZestimate ?? 0;
      case 'propertyTaxes':
        return (this.propertyData.price ?? 0) * (this.propertyData.propertyTaxRate ?? 0) / (12 * 100);
      case 'hoaFees':
        return this.propertyData.hoaFees ?? 0;
      default:
        return 0;
    }
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

import { ConfigParameter, ConfigCategory } from '@/types/configTypes';
import { CalculationInputs } from '@/types/calculationInputs';

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

// Parameters that should get their values from inputs (property listing data)

export const CONFIG_PARAMETERS: ConfigParameter[] = [
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
    getValue: (inputs: CalculationInputs) => inputs.purchasePrice,
    getMin: (inputs: CalculationInputs) => inputs.purchasePrice * 0.25, // 25% of list price
    getMax: (inputs: CalculationInputs) => inputs.purchasePrice * 2,    // 2x list price
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
    getValue: (_inputs: CalculationInputs) => DEFAULT_CONFIG_VALUES.closingCosts, // 3% default
    getMin: (_inputs: CalculationInputs) => 0,
    getMax: (_inputs: CalculationInputs) => 100,
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
    getValue: (_inputs: CalculationInputs) => DEFAULT_CONFIG_VALUES.rehabCosts,
    getMin: (_inputs: CalculationInputs) => 0,
    getMax: (inputs: CalculationInputs) => inputs.purchasePrice, // 1x purchase price
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
    getValue: (inputs: CalculationInputs) => inputs.purchasePrice,
    getMin: (inputs: CalculationInputs) => inputs.purchasePrice, // 1x purchase price
    getMax: (inputs: CalculationInputs) => inputs.purchasePrice * 2, // 2x purchase price
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
    getValue: (_inputs: CalculationInputs) => DEFAULT_CONFIG_VALUES.downPaymentPercentage, // 20% default
    getMin: (_inputs: CalculationInputs) => 5,
    getMax: (_inputs: CalculationInputs) => 100,
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
    getValue: (_inputs: CalculationInputs) => DEFAULT_CONFIG_VALUES.interestRate, // 7.5% default
    getMin: (_inputs: CalculationInputs) => 3,
    getMax: (_inputs: CalculationInputs) => 12,
  },
  {
    id: 'loanTerm',
    label: 'Loan Term',
    category: 'Loan',
    type: 'number',
    description: 'Length of mortgage in years',
    step: 5,
    useSlider: true,
    getValue: (_inputs: CalculationInputs) => DEFAULT_CONFIG_VALUES.loanTerm, // 30 years default
    getMin: (_inputs: CalculationInputs) => 10,
    getMax: (_inputs: CalculationInputs) => 40,
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
    getValue: (inputs: CalculationInputs) => inputs.rentEstimate,
    getMin: (_inputs: CalculationInputs) => 0,
    getMax: (inputs: CalculationInputs) => inputs.rentEstimate * 2, // 2x current estimate
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
    getValue: (_inputs: CalculationInputs) => DEFAULT_CONFIG_VALUES.vacancyRate, // 5% default
    getMin: (_inputs: CalculationInputs) => 0,
    getMax: (_inputs: CalculationInputs) => 20,
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
    getValue: (_inputs: CalculationInputs) => DEFAULT_CONFIG_VALUES.otherIncome,
    getMin: (_inputs: CalculationInputs) => 0,
    getMax: (inputs: CalculationInputs) => inputs.rentEstimate * 2, // 2x rent estimate
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
    getValue: (_inputs: CalculationInputs) => DEFAULT_CONFIG_VALUES.managementRate, // 8% default
    getMin: (_inputs: CalculationInputs) => 0,
    getMax: (_inputs: CalculationInputs) => 30,
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
    getValue: (_inputs: CalculationInputs) => DEFAULT_CONFIG_VALUES.maintenanceRate, // 1% default
    getMin: (_inputs: CalculationInputs) => 0.5,
    getMax: (_inputs: CalculationInputs) => 5,
  },
  {
    id: 'insuranceRate',
    label: 'Insurance Rate',
    category: 'Operating',
    type: 'percentage',
    description: 'Annual insurance rate as percentage of property value',
    step: 0.1,
    unit: '%',
    useSlider: true,
    getValue: (_inputs: CalculationInputs) => DEFAULT_CONFIG_VALUES.insuranceRate, // 0.5% default
    getMin: (_inputs: CalculationInputs) => 0.1,
    getMax: (_inputs: CalculationInputs) => 2,
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
    getValue: (inputs: CalculationInputs) => inputs.propertyTaxes,
    getMin: (_inputs: CalculationInputs) => 0,
    getMax: (inputs: CalculationInputs) => inputs.propertyTaxes * 2, // 2x current taxes
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
    getValue: (inputs: CalculationInputs) => inputs.hoaFees,
    getMin: (_inputs: CalculationInputs) => 0,
    getMax: (inputs: CalculationInputs) => inputs.hoaFees * 2, // 2x current HOA fees
  },
];

// Helper functions to get parameters
export function getParametersByCategory(category: ConfigCategory): ConfigParameter[] {
  return CONFIG_PARAMETERS.filter((param) => param.category === category);
}

export function getBasicParameters(): ConfigParameter[] {
  return CONFIG_PARAMETERS.filter((param) => !param.isAdvanced);
}

export function getAdvancedParameters(): ConfigParameter[] {
  return CONFIG_PARAMETERS.filter((param) => param.isAdvanced);
}

export function getParameterByKey(key: keyof CalculationInputs): ConfigParameter | undefined {
  return CONFIG_PARAMETERS.find((param) => param.id === key);
} 
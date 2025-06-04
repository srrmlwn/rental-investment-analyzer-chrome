import { ConfigParameter, ConfigCategory } from '@/types/configTypes';
import { CalculationInputs } from '@/types/calculationInputs';

export const CONFIG_PARAMETERS: ConfigParameter[] = [
  // Purchase Parameters
  {
    id: 'purchasePrice',
    label: 'Purchase Price',
    category: 'Purchase', 
    type: 'currency',
    description: 'Offer price for the property',
    min: 0.25, // 25% of list price
    max: 2, // 2x list price
    step: 1000,
    unit: '$',
    default: 0, // Will be set from listing
    useSlider: true,
  },
  {
    id: 'closingCosts',
    label: 'Closing Costs',
    category: 'Purchase',
    type: 'percentage',
    description: 'Closing costs as percentage of purchase price',
    min: 0,
    max: 100,
    step: 0.1,
    unit: '%',
    default: 3,
    isAdvanced: true,
    useSlider: true,
  },
  {
    id: 'rehabCosts',
    label: 'Rehab Costs',
    category: 'Purchase',
    type: 'currency',
    description: 'Estimated renovation costs',
    min: 0,
    max: 1, // 1x purchase price
    step: 100,
    unit: '$',
    default: 0,
    isAdvanced: true,
    useSlider: true,
  },
  {
    id: 'afterRepairValue',
    label: 'After Repair Value',
    category: 'Purchase',
    type: 'currency',
    description: 'Estimated value after renovations',
    min: 1, // 1x purchase price
    max: 2, // 2x purchase price
    step: 1000,
    unit: '$',
    default: 0, // Will be set to purchase price initially
    isAdvanced: true,
    useSlider: true,
  },

  // Loan Parameters
  {
    id: 'downPaymentPercentage',
    label: 'Down Payment',
    category: 'Loan',
    type: 'percentage',
    description: 'Percentage of property price paid as down payment',
    min: 5,
    max: 100,
    step: 1,
    unit: '%',
    default: 20,
    useSlider: true,
  },
  {
    id: 'interestRate',
    label: 'Interest Rate',
    category: 'Loan',
    type: 'percentage',
    description: 'Annual mortgage interest rate',
    min: 3,
    max: 12,
    step: 0.25,
    unit: '%',
    default: 7.5,
    useSlider: true,
  },
  {
    id: 'loanTerm',
    label: 'Loan Term',
    category: 'Loan',
    type: 'number',
    description: 'Length of mortgage in years',
    min: 10,
    max: 40,
    step: 5,
    default: 30,    
    useSlider: true,
  },

  // Rental Income Parameters
  {
    id: 'rentEstimate',
    label: 'Monthly Rent',
    category: 'Income',
    type: 'currency',
    description: 'Expected monthly rental income',
    min: 0,
    max: 2, // 2x Zestimate
    step: 100,
    unit: '$',
    default: 0, // Will be set from listing
    useSlider: true,
  },
  {
    id: 'vacancyRate',
    label: 'Vacancy Rate',
    category: 'Income',
    type: 'percentage',
    description: 'Expected vacancy rate as percentage of annual rent',
    min: 0,
    max: 20,
    step: 0.5,
    unit: '%',
    default: 5,
    isAdvanced: true,
    useSlider: true,
  },
  {
    id: 'otherIncome',
    label: 'Other Income',
    category: 'Income',
    type: 'currency',
    description: 'Additional monthly income (parking, storage, etc.)',
    min: 0,
    max: 2, // 2x rent estimate
    step: 100,
    unit: '$',
    default: 0,
    isAdvanced: true,
    useSlider: true,
  },

  // Operating Expenses
  {
    id: 'managementRate',
    label: 'Property Management',
    category: 'Operating',
    type: 'percentage',
    description: 'Percentage of rent paid to property manager',
    min: 0,
    max: 30,
    step: 0.5,
    unit: '%',
    default: 8,
    useSlider: true,
  },
  {
    id: 'maintenanceRate',
    label: 'Maintenance',
    category: 'Operating',
    type: 'percentage',
    description: 'Annual maintenance as percentage of property value',
    min: 0.5,
    max: 5,
    step: 0.1,
    unit: '%',
    default: 1,
    isAdvanced: true,
    useSlider: true,
  },
  {
    id: 'insuranceRate',
    label: 'Insurance Rate',
    category: 'Operating',
    type: 'percentage',
    description: 'Annual insurance rate as percentage of property value',
    min: 0.1,
    max: 2,
    step: 0.1,
    unit: '%',
    default: 0.5,
    useSlider: true,
  },
  {
    id: 'propertyTaxes',
    label: 'Annual Property Taxes',
    category: 'Operating',
    type: 'currency',
    description: 'Annual property taxes (actual amount)',
    min: 0,
    max: 100000,
    step: 100,
    unit: '$',
    default: 0, // Will be set from listing
    isAdvanced: true,
    useSlider: true,
  },
  {
    id: 'hoaFees',
    label: 'Monthly HOA Fees',
    category: 'Operating',
    type: 'currency',
    description: 'Monthly HOA fees',
    min: 0,
    max: 1000,
    step: 10,
    unit: '$',
    default: 0, // Will be set from listing
    isAdvanced: true,
    useSlider: true,
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
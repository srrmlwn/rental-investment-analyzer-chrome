import { ConfigParameter, ConfigCategory, UserCalculationInputs } from '@/types/investment';

export const CONFIG_PARAMETERS: ConfigParameter[] = [
  // Purchase Parameters
  {
    id: 'downPaymentPercentage',
    label: 'Down Payment',
    category: 'Purchase',
    type: 'percentage',
    description: 'Percentage of property price paid as down payment',
    min: 5,
    max: 100,
    step: 1,
    unit: '%',
    default: 20,
    useSlider: true,
  },

  // Loan Parameters
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
    allowedValues: [10, 15, 20, 30, 40],
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
    label: 'Maintenance Reserve',
    category: 'Operating',
    type: 'percentage',
    description: 'Annual maintenance reserve as percentage of property value',
    min: 0.5,
    max: 3,
    step: 0.1,
    unit: '%',
    default: 1,
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
    id: 'propertyTaxRate',
    label: 'Property Tax Rate',
    category: 'Operating',
    type: 'percentage',
    description: 'Annual property tax rate as percentage of property value',
    min: 0.1,
    max: 3,
    step: 0.1,
    unit: '%',
    default: 1.1,
    useSlider: true,
  },
  {
    id: 'vacancyRate',
    label: 'Vacancy Rate',
    category: 'Operating',
    type: 'percentage',
    description: 'Expected vacancy rate as percentage of annual rent',
    min: 0,
    max: 20,
    step: 0.5,
    unit: '%',
    default: 5,
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

export function getParameterByKey(key: keyof UserCalculationInputs): ConfigParameter | undefined {
  return CONFIG_PARAMETERS.find((param) => param.id === key);
} 
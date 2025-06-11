import { CalculationInputs } from './calculationInputs';
import { PropertyData } from './propertyData';

// Configuration parameter definition for UI
export type ConfigParameterType = 'percentage' | 'currency' | 'number';

export const CONFIG_CATEGORIES = {
  PURCHASE_AND_REHAB: 'Purchase and Rehab',
  FINANCING: 'Financing', 
  OPERATING_INCOME: 'Operating Income',
  OPERATING_EXPENSES: 'Operating Expenses'
} as const;

export type ConfigCategory = typeof CONFIG_CATEGORIES[keyof typeof CONFIG_CATEGORIES];

// Base interface for all config parameters
export interface ConfigParameter {
  id: keyof CalculationInputs;
  label: string;
  category: ConfigCategory;
  type: ConfigParameterType;
  description?: string;
  isAdvanced?: boolean;
  step?: number;
  unit?: string;
  useSlider?: boolean;
  
  // Dynamic getter methods for min/max constraints
  getMin(): number;
  getMax(): number;
  
  // Simplified validation functions for error detection
  isErrorValue?(value: number): boolean;
  getErrorMessage?(): string;
} 
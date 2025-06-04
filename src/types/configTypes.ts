import { CalculationInputs } from './calculationInputs';

// Configuration parameter definition for UI
export type ConfigParameterType = 'percentage' | 'currency' | 'number';

export type ConfigCategory = 
  | 'Purchase'
  | 'Loan'
  | 'Operating'
  | 'Income'
  | 'Growth'
  | 'Tax'
  | 'Analysis';

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
  
  // Dynamic getter methods
  getValue(inputs: CalculationInputs): number;
  getMin(inputs: CalculationInputs): number;
  getMax(inputs: CalculationInputs): number;
} 
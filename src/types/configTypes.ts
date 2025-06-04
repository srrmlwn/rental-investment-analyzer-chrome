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

export interface ConfigParameter {
  id: keyof CalculationInputs;
  label: string;
  category: ConfigCategory;
  type: ConfigParameterType;
  description?: string;
  isAdvanced?: boolean;
  isAutoFilled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  default?: number;
  allowedValues?: number[];
  useSlider?: boolean;
}

export interface ConfigValidation {
  isValid: boolean;
  error?: string;
} 
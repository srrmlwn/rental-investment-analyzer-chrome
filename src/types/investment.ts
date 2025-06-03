// Raw data from Zillow listing
export interface PropertyData {
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  squareFeet: number;
  zipCode: string;
  rentZestimate?: number;
  propertyTaxes?: number;
  hoaFees?: number;
}

// User-configurable calculation parameters
export interface UserCalculationInputs {
  downPaymentPercentage: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate: number;
  insuranceRate: number;
  maintenanceRate: number;
  vacancyRate: number;
  managementRate: number;
}

// Results of investment analysis
export interface CalculatedMetrics {
  monthlyMortgage: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
}

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
  id: keyof UserCalculationInputs;
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

export interface InvestmentCalculations {
  // Basic Calculations
  downPayment: number;
  loanAmount: number;
  monthlyMortgage: number;
  totalMonthlyExpenses: number;
  effectiveMonthlyRent: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  capRate: number;
  cashOnCashReturn: number;

  // Advanced Calculations
  totalROI: number;
  breakEvenYears: number;
  netOperatingIncome: number;
  debtServiceCoverageRatio: number;
  totalInvestment: number;
  totalReturn: number;
  totalProfit: number;
  annualizedReturn: number;
}

export interface ConfigValidation {
  isValid: boolean;
  error?: string;
} 
// Listing-agnostic configuration parameters (stored in Chrome storage)
export interface InvestmentConfig {
  // Purchase & Loan
  propertyPrice?: number; // Optional as it's listing-specific
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  points: number;
  closingCostsPercent: number;

  // Operating Expenses
  propertyManagementPercent: number;
  maintenanceReservePercent: number;
  insuranceRate: number;
  propertyTaxRate: number;
  hoaFees: number;
  vacancyRatePercent: number;

  // Growth Assumptions
  annualAppreciation: number;
  annualRentGrowth: number;
  annualExpenseGrowth: number;

  // Advanced Parameters (optional)
  marginalTaxRate?: number;
  depreciationPeriod?: number;
  analysisPeriod?: number;
  exitCapRate?: number;
}

// Listing-specific data (from Zillow/HUD)
export interface PropertyData {
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  zipCode: string;
  rentEstimate: number;
  rentSource: 'Zestimate' | 'HUD';
  propertyTaxes?: number; // Annual property taxes, optional as it may not be available
}

// Combined type for calculations
export interface InvestmentParams extends InvestmentConfig {
  // Listing-specific data
  monthlyRent: number;
  monthlyMaintenance: number;
  otherExpensesMonthly: number;
  hoaFeesMonthly: number;
  propertyTaxesAnnual: number;
  insuranceMonthly: number;
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

export type ConfigCategory = 
  | 'Purchase'
  | 'Loan'
  | 'Operating'
  | 'Income'
  | 'Growth'
  | 'Tax'
  | 'Analysis';

export type ConfigParameterType = 'percentage' | 'currency' | 'integer';

export interface ConfigParameter {
  key: keyof InvestmentConfig;
  label: string;
  category: ConfigCategory;
  type: ConfigParameterType;
  description: string;
  isAdvanced?: boolean;
  isAutoFilled?: boolean;
  isReadOnly?: boolean;
  isListingSpecific?: boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  default?: number;
} 
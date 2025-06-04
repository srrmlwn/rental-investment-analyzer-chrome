// User-configurable calculation parameters
export interface CalculationInputs {
  // Purchase Parameters
  purchasePrice: number;
  closingCosts: number;
  rehabCosts: number;
  afterRepairValue: number;
  
  // Loan Parameters
  downPaymentPercentage: number;
  interestRate: number;
  loanTerm: number;
  
  // Operating Expenses
  propertyTaxes: number;  // Annual property taxes
  insuranceRate: number;
  maintenanceRate: number;
  vacancyRate: number;
  managementRate: number;
  hoaFees: number;  // Monthly HOA fees
  
  // Income Parameters
  rentEstimate: number;  // Monthly rent estimate
  otherIncome: number;   // Additional monthly income
} 
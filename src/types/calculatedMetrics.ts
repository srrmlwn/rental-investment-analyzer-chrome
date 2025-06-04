// Results of investment analysis
export interface CalculatedMetrics {
  // Basic Investment Metrics
  monthlyMortgage: number;      // Principal and interest payment
  monthlyCashFlow: number;      // Net monthly income after all expenses
  annualCashFlow: number;       // Monthly cash flow * 12
  cashOnCashReturn: number;     // Annual cash flow / total investment
  capRate: number;             // NOI / property value
  
  // Advanced Investment Metrics
  totalInvestment: number;      // Down payment + closing costs + rehab costs
  netOperatingIncome: number;   // Effective annual income - operating expenses
  debtServiceCoverageRatio: number;  // NOI / annual debt service
  returnOnInvestment: number;   // (Annual cash flow + appreciation) / total investment
  breakEvenYears: number;      // Years to recoup total investment
  effectiveGrossIncome: number; // Total potential income including other income
  operatingExpenseRatio: number; // Total operating expenses / effective gross income
} 
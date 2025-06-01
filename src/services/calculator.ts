import { InvestmentParams, InvestmentCalculations } from '@/types/investment';

/**
 * Calculates investment metrics based on the provided parameters.
 * This includes basic metrics like cash flow and ROI, as well as advanced metrics
 * like total return and break-even analysis.
 */
export function calculateInvestmentMetrics(params: InvestmentParams): InvestmentCalculations {
  // Basic calculations
  const downPayment = (params.propertyPrice * params.downPaymentPercent) / 100;
  const loanAmount = params.propertyPrice - downPayment;

  // Monthly mortgage calculation (P&I only)
  const monthlyRate = params.interestRate / 100 / 12;
  const numPayments = params.loanTermYears * 12;
  const monthlyMortgage =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  // Monthly expenses
  const propertyManagementFee = (params.monthlyRent * params.propertyManagementPercent) / 100;
  const monthlyPropertyTax = params.propertyTaxesAnnual / 12;
  const totalMonthlyExpenses =
    monthlyMortgage +
    params.monthlyMaintenance +
    propertyManagementFee +
    monthlyPropertyTax +
    params.insuranceMonthly +
    params.otherExpensesMonthly;

  // Effective rent (accounting for vacancy)
  const effectiveMonthlyRent = params.monthlyRent * (1 - params.vacancyRatePercent / 100);

  // Cash flow
  const monthlyCashFlow = effectiveMonthlyRent - totalMonthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;

  // Net Operating Income (NOI)
  const annualNOI =
    effectiveMonthlyRent * 12 -
    (params.monthlyMaintenance +
      propertyManagementFee +
      monthlyPropertyTax +
      params.insuranceMonthly +
      params.otherExpensesMonthly) *
      12;

  // Cap rate (NOI / Property Price)
  const capRate = (annualNOI / params.propertyPrice) * 100;

  // Cash on cash return
  const cashOnCashReturn = (annualCashFlow / downPayment) * 100;

  // Total investment (down payment + closing costs)
  const closingCosts = (params.propertyPrice * params.closingCostsPercent) / 100;
  const totalInvestment = downPayment + closingCosts;

  // Analysis period calculations
  const analysisPeriod = params.analysisPeriod || 30;
  const annualAppreciation = params.annualAppreciation || 3;
  const annualRentGrowth = params.annualRentGrowth || 2;
  const annualExpenseGrowth = params.annualExpenseGrowth || 2;

  // Project future value
  const futureValue = params.propertyPrice * Math.pow(1 + annualAppreciation / 100, analysisPeriod);
  const remainingLoan = calculateRemainingLoan(loanAmount, monthlyMortgage, monthlyRate, analysisPeriod);
  const totalEquity = futureValue - remainingLoan;

  // Project future cash flows
  let totalCashFlow = 0;
  let currentRent = effectiveMonthlyRent;
  let currentExpenses = totalMonthlyExpenses;

  for (let year = 1; year <= analysisPeriod; year++) {
    currentRent *= (1 + annualRentGrowth / 100);
    currentExpenses *= (1 + annualExpenseGrowth / 100);
    totalCashFlow += (currentRent - currentExpenses) * 12;
  }

  // Total return and profit
  const totalReturn = totalEquity + totalCashFlow;
  const totalProfit = totalReturn - totalInvestment;

  // ROI and annualized return
  const totalROI = (totalProfit / totalInvestment) * 100;
  const annualizedReturn = (Math.pow(1 + totalROI / 100, 1 / analysisPeriod) - 1) * 100;

  // Break-even analysis
  const breakEvenYears = calculateBreakEvenYears(
    totalInvestment,
    monthlyCashFlow,
    annualRentGrowth,
    annualExpenseGrowth
  );

  // Debt service coverage ratio
  const debtServiceCoverageRatio = annualNOI / (monthlyMortgage * 12);

  return {
    downPayment,
    loanAmount,
    monthlyMortgage,
    totalMonthlyExpenses,
    effectiveMonthlyRent,
    monthlyCashFlow,
    annualCashFlow,
    capRate,
    cashOnCashReturn,
    totalROI,
    breakEvenYears,
    netOperatingIncome: annualNOI,
    debtServiceCoverageRatio,
    totalInvestment,
    totalReturn,
    totalProfit,
    annualizedReturn,
  };
}

function calculateRemainingLoan(
  initialLoan: number,
  monthlyPayment: number,
  monthlyRate: number,
  years: number
): number {
  const numPayments = years * 12;
  const remainingPayments = 30 * 12 - numPayments; // Assuming 30-year loan
  if (remainingPayments <= 0) return 0;

  return (
    (monthlyPayment * (1 - Math.pow(1 + monthlyRate, -remainingPayments))) /
    monthlyRate
  );
}

function calculateBreakEvenYears(
  totalInvestment: number,
  initialMonthlyCashFlow: number,
  annualRentGrowth: number,
  annualExpenseGrowth: number
): number {
  let cumulativeCashFlow = 0;
  let currentMonthlyCashFlow = initialMonthlyCashFlow;
  let years = 0;

  while (cumulativeCashFlow < totalInvestment && years < 30) {
    years++;
    currentMonthlyCashFlow *= (1 + (annualRentGrowth - annualExpenseGrowth) / 100);
    cumulativeCashFlow += currentMonthlyCashFlow * 12;
  }

  return years;
}

// Export the module as default as well for easier imports
export default { calculateInvestmentMetrics }; 
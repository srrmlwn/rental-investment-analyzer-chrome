import { CalculationInputs } from '@/types/calculationInputs';
import { CalculatedMetrics } from '@/types/calculatedMetrics';

/**
 * Calculates investment metrics based on calculation inputs.
 * Each metric is calculated using standard real estate investment formulas.
 * 
 * Business Logic Documentation:
 * 
 * 1. Basic Investment Metrics:
 *    - Monthly Mortgage: Principal and interest payment using standard amortization formula
 *    - Monthly Cash Flow: Net income after all expenses (rent + other income - all expenses)
 *    - Annual Cash Flow: Monthly cash flow * 12
 *    - Cash on Cash Return: Annual cash flow / total investment (down payment + closing costs + rehab)
 *    - Cap Rate: NOI / property value (using after repair value if available)
 * 
 * 2. Advanced Investment Metrics:
 *    - Total Investment: Sum of all cash invested (down payment + closing costs + rehab costs)
 *    - Net Operating Income (NOI): Effective annual income minus operating expenses
 *    - Debt Service Coverage Ratio: NOI / annual debt service (mortgage payments)
 *    - Return on Investment: (Annual cash flow + appreciation) / total investment
 *    - Break Even Years: Total investment / annual cash flow
 *    - Effective Gross Income: Total potential income including other income
 *    - Operating Expense Ratio: Total operating expenses / effective gross income
 */
export function calculateInvestmentMetrics(
  inputs: CalculationInputs
): CalculatedMetrics {
  // 1. Calculate total investment
  const downPayment = (inputs.purchasePrice * inputs.downPaymentPercentage) / 100;
  console.log('Total investment', downPayment, inputs.closingCosts, inputs.rehabCosts);
  const totalInvestment = downPayment + inputs.closingCosts + inputs.rehabCosts;

  // 2. Calculate loan amount and monthly mortgage
  const loanAmount = inputs.purchasePrice - downPayment;
  const monthlyRate = inputs.interestRate / 100 / 12;
  const numPayments = inputs.loanTerm * 12;
  console.log('Monthly mortgage', loanAmount, monthlyRate, numPayments, inputs.interestRate);
  const monthlyMortgage =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  // 3. Calculate monthly expenses
  const monthlyPropertyTax = inputs.propertyTaxes;  // Already monthly property taxes
  const monthlyInsurance = inputs.insuranceCost;  // Use monthly insurance cost directly
  const monthlyMaintenance = inputs.maintenanceCost;  // Use monthly maintenance cost directly
  const effectiveMonthlyRent = inputs.rentEstimate * (1 - inputs.vacancyRate / 100);
  const monthlyManagement = (effectiveMonthlyRent * inputs.managementRate / 100);
  const monthlyHoaFees = inputs.hoaFees;  // Use actual HOA fees
  console.log('Monthly expenses', monthlyMortgage, monthlyPropertyTax, monthlyInsurance, monthlyMaintenance, monthlyManagement, monthlyHoaFees);
  const totalMonthlyExpenses =
    monthlyMortgage +
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyMaintenance +
    monthlyManagement +
    monthlyHoaFees;

  // 4. Calculate effective income
  const effectiveGrossIncome = effectiveMonthlyRent + inputs.otherIncome;
  console.log('Effective income', effectiveMonthlyRent, inputs.otherIncome, effectiveGrossIncome);
  // 5. Calculate cash flow
  const monthlyCashFlow = effectiveGrossIncome - totalMonthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;
  console.log('Cash flow', monthlyCashFlow, annualCashFlow);
  // 6. Calculate NOI (Net Operating Income)
  const annualNOI = (effectiveGrossIncome * 12) - 
    ((monthlyPropertyTax + monthlyInsurance + monthlyMaintenance + 
      monthlyManagement + monthlyHoaFees) * 12);
  console.log('NOI', annualNOI);
  // 7. Calculate property value (use ARV if available, otherwise purchase price)
  const propertyValue = inputs.afterRepairValue || inputs.purchasePrice;
  console.log('Property value', propertyValue);
  // 8. Calculate advanced metrics
  const capRate = (annualNOI / propertyValue) * 100;
  const cashOnCashReturn = (annualCashFlow / totalInvestment) * 100;
  const debtServiceCoverageRatio = annualNOI / (monthlyMortgage * 12);
  console.log('Debt service coverage ratio', debtServiceCoverageRatio);
  // 9. Calculate appreciation and ROI
  const appreciation = propertyValue - inputs.purchasePrice;
  const returnOnInvestment = ((annualCashFlow + appreciation) / totalInvestment) * 100;
  console.log('Appreciation', appreciation, returnOnInvestment);
  // 10. Calculate break even and operating ratios
  const breakEvenYears = annualCashFlow > 0 ? totalInvestment / annualCashFlow : Infinity;
  const operatingExpenseRatio = (totalMonthlyExpenses * 12) / (effectiveGrossIncome * 12) * 100;
  console.log('Break even years', breakEvenYears, operatingExpenseRatio);
  return {
    // Basic Investment Metrics
    monthlyMortgage,
    monthlyCashFlow,
    annualCashFlow,
    cashOnCashReturn,
    capRate,

    // Advanced Investment Metrics
    totalInvestment,
    netOperatingIncome: annualNOI,
    debtServiceCoverageRatio,
    returnOnInvestment,
    breakEvenYears,
    effectiveGrossIncome: effectiveGrossIncome * 12,
    operatingExpenseRatio,
  };
}

// Export the module as default as well for easier imports
export default { calculateInvestmentMetrics }; 
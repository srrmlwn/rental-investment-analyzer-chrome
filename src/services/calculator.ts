import { PropertyData, UserCalculationInputs, CalculatedMetrics } from '@/types/investment';

/**
 * Calculates investment metrics based on property data and user inputs.
 * This includes basic metrics like cash flow and ROI.
 */
export function calculateInvestmentMetrics(
  propertyData: PropertyData,
  userInputs: UserCalculationInputs
): CalculatedMetrics {
  // Basic calculations
  const downPayment = (propertyData.price * userInputs.downPaymentPercentage) / 100;
  const loanAmount = propertyData.price - downPayment;

  // Monthly mortgage calculation (P&I only)
  const monthlyRate = userInputs.interestRate / 100 / 12;
  const numPayments = userInputs.loanTerm * 12;
  const monthlyMortgage =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  // Monthly expenses
  const monthlyPropertyTax = (propertyData.price * userInputs.propertyTaxRate / 100) / 12;
  const monthlyInsurance = (propertyData.price * userInputs.insuranceRate / 100) / 12;
  const monthlyMaintenance = (propertyData.price * userInputs.maintenanceRate / 100) / 12;
  const monthlyManagement = (propertyData.price * userInputs.managementRate / 100) / 12;

  const totalMonthlyExpenses =
    monthlyMortgage +
    monthlyMaintenance +
    monthlyManagement +
    monthlyPropertyTax +
    monthlyInsurance;

  // Effective rent (accounting for vacancy)
  const monthlyRent = propertyData.rentZestimate || 0;
  const effectiveMonthlyRent = monthlyRent * (1 - userInputs.vacancyRate / 100);

  // Cash flow
  const monthlyCashFlow = effectiveMonthlyRent - totalMonthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;

  // Net Operating Income (NOI)
  const annualNOI =
    effectiveMonthlyRent * 12 -
    (monthlyMaintenance +
      monthlyManagement +
      monthlyPropertyTax +
      monthlyInsurance) *
      12;

  // Cap rate (NOI / Property Price)
  const capRate = (annualNOI / propertyData.price) * 100;

  // Cash on cash return
  const cashOnCashReturn = (annualCashFlow / downPayment) * 100;

  return {
    monthlyMortgage,
    monthlyCashFlow,
    annualCashFlow,
    cashOnCashReturn,
    capRate,
  };
}

// Export the module as default as well for easier imports
export default { calculateInvestmentMetrics }; 
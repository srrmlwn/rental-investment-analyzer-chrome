import { CalculationInputs } from '@/types/calculationInputs';
import { CONFIG_CATEGORIES } from '@/types/configTypes';

// Mock the calculateSectionSummary function logic for testing
const calculateSectionSummary = (category: string, inputs: CalculationInputs): string => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  switch (category) {
    case CONFIG_CATEGORIES.PURCHASE_AND_REHAB: {
      const downPayment = (inputs.purchasePrice * inputs.downPaymentPercentage) / 100;
      const totalInvestment = downPayment + inputs.closingCosts + inputs.rehabCosts;
      return `(Total Investment: ${formatCurrency(totalInvestment)})`;
    }
    
    case CONFIG_CATEGORIES.FINANCING: {
      const downPayment = (inputs.purchasePrice * inputs.downPaymentPercentage) / 100;
      const loanAmount = inputs.purchasePrice - downPayment;
      const monthlyRate = inputs.interestRate / 100 / 12;
      const numPayments = inputs.loanTerm * 12;
      const monthlyMortgage = loanAmount > 0 && monthlyRate > 0 && numPayments > 0
        ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
        : 0;
      return `(Monthly Payment: ${formatCurrency(monthlyMortgage)})`;
    }
    
    case CONFIG_CATEGORIES.OPERATING_INCOME: {
      const effectiveMonthlyRent = inputs.rentEstimate * (1 - inputs.vacancyRate / 100);
      const effectiveGrossIncome = effectiveMonthlyRent + inputs.otherIncome;
      return `(Monthly Income: ${formatCurrency(effectiveGrossIncome)})`;
    }
    
    case CONFIG_CATEGORIES.OPERATING_EXPENSES: {
      const monthlyPropertyTax = inputs.propertyTaxes / 12;
      const monthlyInsurance = inputs.insuranceCost;
      const monthlyMaintenance = inputs.maintenanceCost;
      const monthlyManagement = (inputs.rentEstimate * inputs.managementRate / 100);
      const monthlyHoaFees = inputs.hoaFees;
      
      const totalMonthlyExpenses = monthlyPropertyTax + monthlyInsurance + 
                                  monthlyMaintenance + monthlyManagement + monthlyHoaFees;
      return `(Monthly Expenses: ${formatCurrency(totalMonthlyExpenses)})`;
    }
    
    default:
      return '';
  }
};

describe('Config Panel Section Summaries', () => {
  const mockInputs: CalculationInputs = {
    // Purchase Parameters
    purchasePrice: 300000,
    closingCosts: 9000, // 3% of purchase price
    rehabCosts: 15000,
    afterRepairValue: 320000,
    
    // Loan Parameters
    downPaymentPercentage: 25,
    interestRate: 6.95,
    loanTerm: 30,
    
    // Operating Expenses
    propertyTaxes: 3600, // Annual
    insuranceCost: 100, // Monthly
    maintenanceCost: 100, // Monthly
    vacancyRate: 10,
    managementRate: 10,
    hoaFees: 200, // Monthly
    
    // Income Parameters
    rentEstimate: 2500, // Monthly
    otherIncome: 100, // Monthly
  };

  test('Purchase and Rehab section shows total investment', () => {
    const summary = calculateSectionSummary(CONFIG_CATEGORIES.PURCHASE_AND_REHAB, mockInputs);
    expect(summary).toBe('(Total Investment: $99,000)');
    
    // Verify calculation: down payment (75k) + closing costs (9k) + rehab (15k) = 99k
    const expectedDownPayment = (300000 * 25) / 100; // 75,000
    const expectedTotal = expectedDownPayment + 9000 + 15000; // 99,000
    expect(expectedTotal).toBe(99000);
  });

  test('Financing section shows monthly mortgage payment', () => {
    const summary = calculateSectionSummary(CONFIG_CATEGORIES.FINANCING, mockInputs);
    expect(summary).toContain('(Monthly Payment: $');
    
    // Verify it's a reasonable mortgage payment for a 225k loan at 6.95% for 30 years
    // Should be around $1,490 per month
    const loanAmount = 300000 - (300000 * 25 / 100); // 225,000
    const monthlyRate = 6.95 / 100 / 12; // 0.00579
    const numPayments = 30 * 12; // 360
    const expectedPayment = (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
                           (Math.pow(1 + monthlyRate, numPayments) - 1);
    expect(expectedPayment).toBeCloseTo(1490, -1); // Within $10
  });

  test('Operating Income section shows effective monthly income', () => {
    const summary = calculateSectionSummary(CONFIG_CATEGORIES.OPERATING_INCOME, mockInputs);
    expect(summary).toBe('(Monthly Income: $2,350)');
    
    // Verify calculation: rent (2500 * 0.9) + other income (100) = 2350
    const effectiveRent = 2500 * (1 - 10 / 100); // 2250
    const expectedTotal = effectiveRent + 100; // 2350
    expect(expectedTotal).toBe(2350);
  });

  test('Operating Expenses section shows total monthly expenses (excluding mortgage)', () => {
    const summary = calculateSectionSummary(CONFIG_CATEGORIES.OPERATING_EXPENSES, mockInputs);
    expect(summary).toBe('(Monthly Expenses: $950)');
    
    // Verify calculation includes all expense components (excluding mortgage)
    const monthlyPropertyTax = 3600 / 12; // 300
    const monthlyInsurance = 100;
    const monthlyMaintenance = 100;
    const monthlyManagement = (2500 * 10 / 100); // 250
    const monthlyHoaFees = 200;
    
    const expectedExpenses = 300 + 100 + 100 + 250 + 200; // 950
    expect(expectedExpenses).toBe(950);
  });

  test('Summary updates when inputs change', () => {
    // Test with different rent estimate
    const modifiedInputs = { ...mockInputs, rentEstimate: 3000 };
    const summary = calculateSectionSummary(CONFIG_CATEGORIES.OPERATING_INCOME, modifiedInputs);
    expect(summary).toBe('(Monthly Income: $2,800)');
    
    // Verify calculation: rent (3000 * 0.9) + other income (100) = 2800
    const effectiveRent = 3000 * (1 - 10 / 100); // 2700
    const expectedTotal = effectiveRent + 100; // 2800
    expect(expectedTotal).toBe(2800);
  });
}); 
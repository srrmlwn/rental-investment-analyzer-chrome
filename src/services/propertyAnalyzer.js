/**
 * Property Analysis Service
 * Provides calculators for cash flow, cap rate, ROI, mortgage, and property comparison.
 */

/**
 * Calculate monthly cash flow
 * @param {Object} params
 * @param {number} params.rent - Monthly rental income
 * @param {number} params.expenses - Total monthly expenses (taxes, insurance, maintenance, etc.)
 * @param {number} params.mortgage - Monthly mortgage payment
 * @returns {number} Monthly cash flow
 */
export function calculateCashFlow({ rent, expenses, mortgage }) {
    if (typeof rent !== 'number' || typeof expenses !== 'number' || typeof mortgage !== 'number') {
        throw new Error('All arguments must be numbers');
    }
    return rent - expenses - mortgage;
}

/**
 * Calculate monthly mortgage payment (principal & interest only)
 * @param {Object} params
 * @param {number} params.loanAmount - Total loan amount
 * @param {number} params.annualInterestRate - Annual interest rate (percent, e.g. 6.5)
 * @param {number} params.loanTermYears - Loan term in years
 * @returns {number} Monthly mortgage payment
 */
export function calculateMortgage({ loanAmount, annualInterestRate, loanTermYears }) {
    if (typeof loanAmount !== 'number' || typeof annualInterestRate !== 'number' || typeof loanTermYears !== 'number') {
        throw new Error('All arguments must be numbers');
    }
    const monthlyRate = (annualInterestRate / 100) / 12;
    const n = loanTermYears * 12;
    if (monthlyRate === 0) return loanAmount / n;
    return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
}

// TODO: Implement cap rate calculator
// TODO: Implement ROI calculator
// TODO: Implement property comparison utilities 
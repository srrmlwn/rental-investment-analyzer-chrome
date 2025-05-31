// Cash flow analyzer for rental investment properties
// Calculates key investment metrics and cash flow analysis

import configManager from './configManager.js';

class CashFlowAnalyzer {
    constructor() {
        this.config = configManager;
    }

    analyzeProperty(propertyData, rentalEstimate) {
        try {
            const {
                price,
                squareFeet
            } = propertyData;

            const {
                rent,
                source: rentSource
            } = rentalEstimate;

            // Calculate monthly expenses
            const expenses = this.calculateMonthlyExpenses(price, rent);
            
            // Calculate monthly income
            const income = this.calculateMonthlyIncome(rent);
            
            // Calculate key metrics
            const metrics = this.calculateMetrics(price, expenses, income);
            
            return {
                expenses,
                income,
                metrics,
                rentSource,
                propertyDetails: {
                    price,
                    squareFeet,
                    pricePerSqFt: price / squareFeet
                }
            };
        } catch (error) {
            console.error('[RIA] Error analyzing property:', error);
            throw new Error('Failed to analyze property: ' + error.message);
        }
    }

    calculateMonthlyExpenses(propertyValue, monthlyRent) {
        const config = this.config.getConfig();
        
        // Mortgage payment (P&I)
        const mortgagePayment = this.config.calculateMonthlyMortgage(propertyValue);
        
        // Property taxes (monthly)
        const propertyTaxes = (propertyValue * config.propertyTaxRate / 100) / 12;
        
        // Insurance (monthly)
        const insurance = (propertyValue * config.insuranceRate / 100) / 12;
        
        // Property management (percentage of rent)
        const propertyManagement = monthlyRent * config.propertyManagementFee / 100;
        
        // Maintenance reserve (percentage of property value, monthly)
        const maintenanceReserve = (propertyValue * config.maintenanceReserve / 100) / 12;
        
        // HOA fees (fixed monthly)
        const hoaFees = config.hoaFees;
        
        // Total monthly expenses
        const totalExpenses = {
            mortgagePayment,
            propertyTaxes,
            insurance,
            propertyManagement,
            maintenanceReserve,
            hoaFees,
            total: mortgagePayment + propertyTaxes + insurance + 
                  propertyManagement + maintenanceReserve + hoaFees
        };

        return totalExpenses;
    }

    calculateMonthlyIncome(monthlyRent) {
        const config = this.config.getConfig();
        
        // Gross monthly rent
        const grossRent = monthlyRent;
        
        // Vacancy allowance
        const vacancyAllowance = grossRent * config.vacancyRate / 100;
        
        // Net monthly income
        const netIncome = grossRent - vacancyAllowance;
        
        return {
            grossRent,
            vacancyAllowance,
            netIncome
        };
    }

    calculateMetrics(propertyValue, expenses, income) {
        const config = this.config.getConfig();
        
        // Monthly cash flow
        const monthlyCashFlow = income.netIncome - expenses.total;
        
        // Annual cash flow
        const annualCashFlow = monthlyCashFlow * 12;
        
        // Cash on cash return
        const downPayment = propertyValue * config.downPaymentPercent / 100;
        const cashOnCashReturn = (annualCashFlow / downPayment) * 100;
        
        // Cap rate
        const netOperatingIncome = income.netIncome * 12;
        const capRate = (netOperatingIncome / propertyValue) * 100;
        
        // Total monthly expenses
        const totalMonthlyExpenses = expenses.total;
        
        // Net operating income (monthly)
        const monthlyNOI = income.netIncome;
        
        return {
            monthlyCashFlow,
            annualCashFlow,
            cashOnCashReturn,
            capRate,
            totalMonthlyExpenses,
            monthlyNOI
        };
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatPercentage(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value / 100);
    }
}

// Create and export a singleton instance
const cashFlowAnalyzer = new CashFlowAnalyzer();
export default cashFlowAnalyzer; 
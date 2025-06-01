import { useState, useEffect, useCallback } from "react"
import { useChromeStorage } from "./use-chrome-storage"

export interface InvestmentParams {
  // Basic Parameters
  monthlyRent: number
  downPaymentPercent: number
  vacancyRatePercent: number
  interestRate: number

  // Advanced Parameters
  propertyManagementPercent: number
  monthlyMaintenance: number
  insuranceMonthly: number
  propertyTaxesAnnual: number
  loanTermYears: number
  otherExpensesMonthly: number
}

export interface InvestmentCalculations {
  // Key Metrics
  monthlyCashFlow: number
  annualCashFlow: number
  capRate: number
  cashOnCashReturn: number

  // Investment Breakdown
  downPayment: number
  monthlyMortgage: number
  effectiveMonthlyRent: number
  totalMonthlyExpenses: number
}

const DEFAULT_PARAMS: InvestmentParams = {
  // Basic Parameters
  monthlyRent: 2000,
  downPaymentPercent: 20,
  vacancyRatePercent: 5,
  interestRate: 6.5,

  // Advanced Parameters
  propertyManagementPercent: 8,
  monthlyMaintenance: 200,
  insuranceMonthly: 150,
  propertyTaxesAnnual: 2400,
  loanTermYears: 30,
  otherExpensesMonthly: 100,
}

const PRESETS: Record<string, Partial<InvestmentParams>> = {
  conservative: {
    downPaymentPercent: 25,
    vacancyRatePercent: 8,
    interestRate: 7,
    propertyManagementPercent: 10,
    monthlyMaintenance: 250,
    insuranceMonthly: 175,
    propertyTaxesAnnual: 3000,
    otherExpensesMonthly: 150,
  },
  moderate: {
    downPaymentPercent: 20,
    vacancyRatePercent: 5,
    interestRate: 6.5,
    propertyManagementPercent: 8,
    monthlyMaintenance: 200,
    insuranceMonthly: 150,
    propertyTaxesAnnual: 2400,
    otherExpensesMonthly: 100,
  },
  aggressive: {
    downPaymentPercent: 15,
    vacancyRatePercent: 3,
    interestRate: 6,
    propertyManagementPercent: 6,
    monthlyMaintenance: 150,
    insuranceMonthly: 125,
    propertyTaxesAnnual: 2000,
    otherExpensesMonthly: 75,
  },
}

export function useInvestmentState() {
  const [params, setParams] = useChromeStorage<InvestmentParams>("investmentParams", DEFAULT_PARAMS)
  const [isAdvancedOpen, setIsAdvancedOpen] = useChromeStorage("isAdvancedOpen", false)
  const [calculations, setCalculations] = useState<InvestmentCalculations>({
    monthlyCashFlow: 0,
    annualCashFlow: 0,
    capRate: 0,
    cashOnCashReturn: 0,
    downPayment: 0,
    monthlyMortgage: 0,
    effectiveMonthlyRent: 0,
    totalMonthlyExpenses: 0,
  })

  // Calculate investment metrics
  const calculateMetrics = useCallback((currentParams: InvestmentParams) => {
    const {
      monthlyRent,
      downPaymentPercent,
      vacancyRatePercent,
      interestRate,
      propertyManagementPercent,
      monthlyMaintenance,
      insuranceMonthly,
      propertyTaxesAnnual,
      loanTermYears,
      otherExpensesMonthly,
    } = currentParams

    // Constants
    const PROPERTY_VALUE = 300000 // Example property value
    const LOAN_AMOUNT = PROPERTY_VALUE * (1 - downPaymentPercent / 100)
    const DOWN_PAYMENT = PROPERTY_VALUE * (downPaymentPercent / 100)

    // Monthly Calculations
    const EFFECTIVE_MONTHLY_RENT = monthlyRent * (1 - vacancyRatePercent / 100)
    const MONTHLY_PROPERTY_MANAGEMENT = monthlyRent * (propertyManagementPercent / 100)
    const MONTHLY_PROPERTY_TAXES = propertyTaxesAnnual / 12
    const MONTHLY_INTEREST_RATE = interestRate / 100 / 12
    const NUMBER_OF_PAYMENTS = loanTermYears * 12

    // Mortgage Payment Calculation (P = L[c(1 + c)^n]/[(1 + c)^n - 1])
    const MONTHLY_MORTGAGE =
      (LOAN_AMOUNT * MONTHLY_INTEREST_RATE * Math.pow(1 + MONTHLY_INTEREST_RATE, NUMBER_OF_PAYMENTS)) /
      (Math.pow(1 + MONTHLY_INTEREST_RATE, NUMBER_OF_PAYMENTS) - 1)

    // Total Monthly Expenses
    const TOTAL_MONTHLY_EXPENSES =
      MONTHLY_MORTGAGE +
      MONTHLY_PROPERTY_MANAGEMENT +
      monthlyMaintenance +
      insuranceMonthly +
      MONTHLY_PROPERTY_TAXES +
      otherExpensesMonthly

    // Cash Flow Calculations
    const MONTHLY_CASH_FLOW = EFFECTIVE_MONTHLY_RENT - TOTAL_MONTHLY_EXPENSES
    const ANNUAL_CASH_FLOW = MONTHLY_CASH_FLOW * 12

    // Return Metrics
    const CAP_RATE = (ANNUAL_CASH_FLOW / PROPERTY_VALUE) * 100
    const CASH_ON_CASH_RETURN = (ANNUAL_CASH_FLOW / DOWN_PAYMENT) * 100

    return {
      monthlyCashFlow: MONTHLY_CASH_FLOW,
      annualCashFlow: ANNUAL_CASH_FLOW,
      capRate: CAP_RATE,
      cashOnCashReturn: CASH_ON_CASH_RETURN,
      downPayment: DOWN_PAYMENT,
      monthlyMortgage: MONTHLY_MORTGAGE,
      effectiveMonthlyRent: EFFECTIVE_MONTHLY_RENT,
      totalMonthlyExpenses: TOTAL_MONTHLY_EXPENSES,
    }
  }, [])

  // Update calculations when params change
  useEffect(() => {
    setCalculations(calculateMetrics(params))
  }, [params, calculateMetrics])

  // Update a single parameter
  const updateParam = useCallback(
    <K extends keyof InvestmentParams>(key: K, value: InvestmentParams[K]) => {
      setParams((prev: InvestmentParams) => ({ ...prev, [key]: value }))
    },
    [setParams]
  )

  // Apply a preset configuration
  const applyPreset = useCallback(
    (presetName: keyof typeof PRESETS) => {
      const preset = PRESETS[presetName]
      setParams((prev: InvestmentParams) => ({ ...prev, ...preset }))
    },
    [setParams]
  )

  // Reset advanced parameters to defaults
  const resetAdvancedParams = useCallback(() => {
    setParams((prev: InvestmentParams) => ({
      ...prev,
      propertyManagementPercent: DEFAULT_PARAMS.propertyManagementPercent,
      monthlyMaintenance: DEFAULT_PARAMS.monthlyMaintenance,
      insuranceMonthly: DEFAULT_PARAMS.insuranceMonthly,
      propertyTaxesAnnual: DEFAULT_PARAMS.propertyTaxesAnnual,
      loanTermYears: DEFAULT_PARAMS.loanTermYears,
      otherExpensesMonthly: DEFAULT_PARAMS.otherExpensesMonthly,
    }))
  }, [setParams])

  return {
    params,
    calculations,
    updateParam,
    applyPreset,
    resetAdvancedParams,
    isAdvancedOpen,
    setIsAdvancedOpen,
  }
} 
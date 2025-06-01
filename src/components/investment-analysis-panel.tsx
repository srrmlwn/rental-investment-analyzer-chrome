import { Calculator, DollarSign, TrendingUp, Percent, Edit3, RotateCcw, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { useState, useEffect } from "react"

interface InvestmentParams {
  propertyPrice: number
  monthlyRent: number
  downPaymentPercent: number
  interestRate: number
  loanTermYears: number
  monthlyMaintenance: number
  propertyManagementPercent: number
  vacancyRatePercent: number
  propertyTaxesAnnual: number
  insuranceMonthly: number
  otherExpensesMonthly: number
}

interface InvestmentCalculations {
  downPayment: number
  loanAmount: number
  monthlyMortgage: number
  totalMonthlyExpenses: number
  effectiveMonthlyRent: number
  monthlyCashFlow: number
  annualCashFlow: number
  capRate: number
  cashOnCashReturn: number
}

export function InvestmentAnalysisPanel() {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  // Investment parameters with state
  const [params, setParams] = useState<InvestmentParams>({
    propertyPrice: 258900,
    monthlyRent: 1800,
    downPaymentPercent: 20,
    interestRate: 7.5,
    loanTermYears: 30,
    monthlyMaintenance: 200,
    propertyManagementPercent: 8,
    vacancyRatePercent: 5,
    propertyTaxesAnnual: 3100,
    insuranceMonthly: 150,
    otherExpensesMonthly: 50,
  })

  // Calculated values
  const [calculations, setCalculations] = useState<InvestmentCalculations>({
    downPayment: 0,
    loanAmount: 0,
    monthlyMortgage: 0,
    totalMonthlyExpenses: 0,
    effectiveMonthlyRent: 0,
    monthlyCashFlow: 0,
    annualCashFlow: 0,
    capRate: 0,
    cashOnCashReturn: 0,
  })

  // Recalculate whenever parameters change
  useEffect(() => {
    const downPayment = (params.propertyPrice * params.downPaymentPercent) / 100
    const loanAmount = params.propertyPrice - downPayment

    // Monthly mortgage calculation (P&I only)
    const monthlyRate = params.interestRate / 100 / 12
    const numPayments = params.loanTermYears * 12
    const monthlyMortgage =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)

    // Monthly expenses
    const propertyManagementFee = (params.monthlyRent * params.propertyManagementPercent) / 100
    const monthlyPropertyTax = params.propertyTaxesAnnual / 12
    const totalMonthlyExpenses =
      monthlyMortgage +
      params.monthlyMaintenance +
      propertyManagementFee +
      monthlyPropertyTax +
      params.insuranceMonthly +
      params.otherExpensesMonthly

    // Effective rent (accounting for vacancy)
    const effectiveMonthlyRent = params.monthlyRent * (1 - params.vacancyRatePercent / 100)

    // Cash flow
    const monthlyCashFlow = effectiveMonthlyRent - totalMonthlyExpenses
    const annualCashFlow = monthlyCashFlow * 12

    // Cap rate (NOI / Property Price)
    const annualNOI =
      effectiveMonthlyRent * 12 -
      (params.monthlyMaintenance +
        propertyManagementFee +
        monthlyPropertyTax +
        params.insuranceMonthly +
        params.otherExpensesMonthly) *
        12
    const capRate = (annualNOI / params.propertyPrice) * 100

    // Cash on cash return
    const cashOnCashReturn = (annualCashFlow / downPayment) * 100

    setCalculations({
      downPayment,
      loanAmount,
      monthlyMortgage,
      totalMonthlyExpenses,
      effectiveMonthlyRent,
      monthlyCashFlow,
      annualCashFlow,
      capRate,
      cashOnCashReturn,
    })
  }, [params])

  const updateParam = (key: keyof InvestmentParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const applyPreset = (preset: "conservative" | "moderate" | "aggressive") => {
    const presets = {
      conservative: {
        downPaymentPercent: 25,
        vacancyRatePercent: 8,
        propertyManagementPercent: 10,
        monthlyMaintenance: 250,
      },
      moderate: {
        downPaymentPercent: 20,
        vacancyRatePercent: 5,
        propertyManagementPercent: 8,
        monthlyMaintenance: 200,
      },
      aggressive: {
        downPaymentPercent: 15,
        vacancyRatePercent: 3,
        propertyManagementPercent: 6,
        monthlyMaintenance: 150,
      },
    }

    setParams((prev) => ({ ...prev, ...presets[preset] }))
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-900">Investment Analysis</CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Live Calculator
            </Badge>
          </div>
          <div className="flex gap-2">
            {/* Quick Preset Buttons */}
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset("conservative")}
                className="text-xs px-2"
              >
                Conservative
              </Button>
              <Button variant="outline" size="sm" onClick={() => applyPreset("moderate")} className="text-xs px-2">
                Moderate
              </Button>
              <Button variant="outline" size="sm" onClick={() => applyPreset("aggressive")} className="text-xs px-2">
                Aggressive
              </Button>
            </div>
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  Advanced
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Monthly Cash Flow</span>
            </div>
            <div
              className={`text-2xl font-bold ${calculations.monthlyCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              ${calculations.monthlyCashFlow >= 0 ? "+" : ""}
              {Math.round(calculations.monthlyCashFlow).toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Percent className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Cap Rate</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{calculations.capRate.toFixed(1)}%</div>
          </div>

          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Cash-on-Cash</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{calculations.cashOnCashReturn.toFixed(1)}%</div>
          </div>

          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Annual Cash Flow</span>
            </div>
            <div
              className={`text-2xl font-bold ${calculations.annualCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              ${calculations.annualCashFlow >= 0 ? "+" : ""}
              {Math.round(calculations.annualCashFlow).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Quick Adjustments - Always Visible */}
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            Quick Adjustments
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Monthly Rent */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Monthly Rent</Label>
                <span className="text-sm font-bold text-blue-600">${params.monthlyRent}</span>
              </div>
              <Slider
                value={[params.monthlyRent]}
                onValueChange={(value) => updateParam("monthlyRent", value[0])}
                max={3000}
                min={800}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>$800</span>
                <span>$3000</span>
              </div>
            </div>

            {/* Down Payment % */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Down Payment</Label>
                <span className="text-sm font-bold text-blue-600">{params.downPaymentPercent}%</span>
              </div>
              <Slider
                value={[params.downPaymentPercent]}
                onValueChange={(value) => updateParam("downPaymentPercent", value[0])}
                max={50}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Vacancy Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Vacancy Rate</Label>
                <span className="text-sm font-bold text-blue-600">{params.vacancyRatePercent}%</span>
              </div>
              <Slider
                value={[params.vacancyRatePercent]}
                onValueChange={(value) => updateParam("vacancyRatePercent", value[0])}
                max={15}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Interest Rate</Label>
                <span className="text-sm font-bold text-blue-600">{params.interestRate}%</span>
              </div>
              <Slider
                value={[params.interestRate]}
                onValueChange={(value) => updateParam("interestRate", value[0])}
                max={12}
                min={3}
                step={0.25}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>3%</span>
                <span>12%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Summary */}
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <h4 className="font-semibold mb-3">Investment Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-gray-600">Down Payment:</span>
              <div className="font-semibold">${Math.round(calculations.downPayment).toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <span className="text-gray-600">Monthly Mortgage:</span>
              <div className="font-semibold">${Math.round(calculations.monthlyMortgage).toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <span className="text-gray-600">Effective Rent:</span>
              <div className="font-semibold">${Math.round(calculations.effectiveMonthlyRent).toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <span className="text-gray-600">Total Expenses:</span>
              <div className="font-semibold">${Math.round(calculations.totalMonthlyExpenses).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Advanced Settings Panel */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleContent className="space-y-4">
            <Separator />
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Advanced Parameters</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setParams((prev) => ({
                      ...prev,
                      propertyManagementPercent: 8,
                      monthlyMaintenance: 200,
                      propertyTaxesAnnual: 3100,
                      insuranceMonthly: 150,
                      otherExpensesMonthly: 50,
                      loanTermYears: 30,
                    }))
                  }
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Property Management */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Property Management</Label>
                    <span className="text-sm font-bold">{params.propertyManagementPercent}%</span>
                  </div>
                  <Slider
                    value={[params.propertyManagementPercent]}
                    onValueChange={(value) => updateParam("propertyManagementPercent", value[0])}
                    max={15}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Monthly Maintenance */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Maintenance/Month</Label>
                    <span className="text-sm font-bold">${params.monthlyMaintenance}</span>
                  </div>
                  <Slider
                    value={[params.monthlyMaintenance]}
                    onValueChange={(value) => updateParam("monthlyMaintenance", value[0])}
                    max={500}
                    min={50}
                    step={25}
                    className="w-full"
                  />
                </div>

                {/* Insurance */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Insurance/Month</Label>
                    <span className="text-sm font-bold">${params.insuranceMonthly}</span>
                  </div>
                  <Slider
                    value={[params.insuranceMonthly]}
                    onValueChange={(value) => updateParam("insuranceMonthly", value[0])}
                    max={400}
                    min={50}
                    step={25}
                    className="w-full"
                  />
                </div>

                {/* Property Taxes */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Annual Property Taxes</Label>
                  <Input
                    type="number"
                    value={params.propertyTaxesAnnual}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParam("propertyTaxesAnnual", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Loan Term */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Loan Term (Years)</Label>
                  <Input
                    type="number"
                    value={params.loanTermYears}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParam("loanTermYears", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Other Expenses */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Other Expenses/Month</Label>
                  <Input
                    type="number"
                    value={params.otherExpensesMonthly}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParam("otherExpensesMonthly", Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
} 
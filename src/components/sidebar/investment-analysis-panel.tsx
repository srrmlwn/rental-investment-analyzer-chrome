import * as React from "react"
import { Calculator, DollarSign, TrendingUp, Percent, Edit3, RotateCcw, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { LabeledSlider } from "../custom/labeled-slider"
import { MetricCard } from "../custom/metric-card"
import { CollapsibleSection } from "../custom/collapsible-section"
import { NumericInput } from "../custom/numeric-input"
import { useInvestmentState } from "../../hooks/use-investment-state"

export function InvestmentAnalysisPanel() {
  const {
    params,
    calculations,
    updateParam,
    applyPreset,
    resetAdvancedParams,
    isAdvancedOpen,
    setIsAdvancedOpen,
  } = useInvestmentState()

  return (
    <div className="p-4 space-y-4">
      {/* Investment Analysis Card */}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset("moderate")}
                  className="text-xs px-2"
                >
                  Moderate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset("aggressive")}
                  className="text-xs px-2"
                >
                  Aggressive
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Advanced
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Monthly Cash Flow"
              value={`${calculations.monthlyCashFlow >= 0 ? "+" : ""}$${Math.round(
                calculations.monthlyCashFlow
              ).toLocaleString()}`}
              icon={DollarSign}
              variant={calculations.monthlyCashFlow >= 0 ? "success" : "destructive"}
            />
            <MetricCard
              title="Cap Rate"
              value={`${calculations.capRate.toFixed(1)}%`}
              icon={Percent}
              variant="default"
            />
            <MetricCard
              title="Cash-on-Cash"
              value={`${calculations.cashOnCashReturn.toFixed(1)}%`}
              icon={TrendingUp}
              variant="default"
            />
            <MetricCard
              title="Annual Cash Flow"
              value={`${calculations.annualCashFlow >= 0 ? "+" : ""}$${Math.round(
                calculations.annualCashFlow
              ).toLocaleString()}`}
              icon={DollarSign}
              variant={calculations.annualCashFlow >= 0 ? "success" : "destructive"}
            />
          </div>

          {/* Quick Adjustments */}
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              Quick Adjustments
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <LabeledSlider
                label="Monthly Rent"
                value={params.monthlyRent}
                min={800}
                max={3000}
                step={50}
                formatValue={(v) => `$${v}`}
                onChange={(v) => updateParam("monthlyRent", v)}
              />
              <LabeledSlider
                label="Down Payment"
                value={params.downPaymentPercent}
                min={5}
                max={50}
                step={5}
                formatValue={(v) => `${v}%`}
                onChange={(v) => updateParam("downPaymentPercent", v)}
              />
              <LabeledSlider
                label="Vacancy Rate"
                value={params.vacancyRatePercent}
                min={0}
                max={15}
                step={1}
                formatValue={(v) => `${v}%`}
                onChange={(v) => updateParam("vacancyRatePercent", v)}
              />
              <LabeledSlider
                label="Interest Rate"
                value={params.interestRate}
                min={3}
                max={12}
                step={0.25}
                formatValue={(v) => `${v}%`}
                onChange={(v) => updateParam("interestRate", v)}
              />
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <h4 className="font-semibold mb-3">Investment Breakdown</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
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

          {/* Advanced Settings */}
          <CollapsibleSection
            title="Advanced Parameters"
            defaultOpen={isAdvancedOpen}
            icon={<Edit3 className="h-4 w-4" />}
          >
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Advanced Settings</h4>
                <Button variant="outline" size="sm" onClick={resetAdvancedParams} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <LabeledSlider
                  label="Property Management"
                  value={params.propertyManagementPercent}
                  min={0}
                  max={15}
                  step={0.5}
                  formatValue={(v) => `${v}%`}
                  onChange={(v) => updateParam("propertyManagementPercent", v)}
                />
                <LabeledSlider
                  label="Maintenance/Month"
                  value={params.monthlyMaintenance}
                  min={50}
                  max={500}
                  step={25}
                  formatValue={(v) => `$${v}`}
                  onChange={(v) => updateParam("monthlyMaintenance", v)}
                />
                <LabeledSlider
                  label="Insurance/Month"
                  value={params.insuranceMonthly}
                  min={50}
                  max={400}
                  step={25}
                  formatValue={(v) => `$${v}`}
                  onChange={(v) => updateParam("insuranceMonthly", v)}
                />
                <NumericInput
                  label="Annual Property Taxes"
                  value={params.propertyTaxesAnnual}
                  onChange={(v) => updateParam("propertyTaxesAnnual", v)}
                  min={0}
                  step={100}
                  formatValue={(v) => `$${v}`}
                />
                <NumericInput
                  label="Loan Term (Years)"
                  value={params.loanTermYears}
                  onChange={(v) => updateParam("loanTermYears", v)}
                  min={15}
                  max={40}
                  step={5}
                />
                <NumericInput
                  label="Other Expenses/Month"
                  value={params.otherExpensesMonthly}
                  onChange={(v) => updateParam("otherExpensesMonthly", v)}
                  min={0}
                  step={25}
                  formatValue={(v) => `$${v}`}
                />
              </div>
            </div>
          </CollapsibleSection>
        </CardContent>
      </Card>
    </div>
  )
} 
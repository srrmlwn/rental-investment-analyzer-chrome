import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LabeledSlider } from './ui/labeled-slider';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { calculateMortgage, calculateCashFlow } from '../services/propertyAnalyzer';
import configManager from '../services/configManager';

interface InvestmentCalculatorProps {
  propertyPrice: number;
  rentZestimate: number | null;
  onCalculationsUpdate?: (calculations: InvestmentCalculations) => void;
}

export interface InvestmentCalculations {
  monthlyMortgage: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
  totalInvestment: number;
  monthlyIncome: number;
}

type ConfigKey = keyof ReturnType<typeof configManager.getConfig>;

export const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({
  propertyPrice,
  rentZestimate,
  onCalculationsUpdate,
}) => {
  const [config, setConfig] = useState(configManager.getConfig());
  const [calculations, setCalculations] = useState<InvestmentCalculations | null>(null);

  // Update calculations when config or property data changes
  useEffect(() => {
    if (!rentZestimate) return;

    const loanAmount = propertyPrice * (1 - config.downPaymentPercent / 100);
    const monthlyMortgage = calculateMortgage({
      loanAmount,
      annualInterestRate: config.mortgageRate,
      loanTermYears: config.loanTermYears,
    });

    const monthlyExpenses = calculateMonthlyExpenses(propertyPrice, rentZestimate, config);
    const monthlyIncome = rentZestimate * (1 - config.vacancyRate / 100);
    const monthlyCashFlow = calculateCashFlow({
      rent: monthlyIncome,
      expenses: monthlyExpenses,
      mortgage: monthlyMortgage,
    });

    const totalInvestment = propertyPrice * (config.downPaymentPercent / 100);
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCashReturn = (annualCashFlow / totalInvestment) * 100;
    const capRate = ((monthlyIncome * 12 - monthlyExpenses * 12) / propertyPrice) * 100;

    const newCalculations = {
      monthlyMortgage,
      monthlyExpenses,
      monthlyCashFlow,
      annualCashFlow,
      cashOnCashReturn,
      capRate,
      totalInvestment,
      monthlyIncome,
    };

    setCalculations(newCalculations);
    onCalculationsUpdate?.(newCalculations);
  }, [propertyPrice, rentZestimate, config, onCalculationsUpdate]);

  const handleConfigChange = async (key: ConfigKey, value: number) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    await configManager.saveConfig(newConfig);
  };

  if (!rentZestimate) {
    return (
      <Card className="w-full border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-600">Rental Estimate Required</CardTitle>
        </CardHeader>
        <CardContent>
          Unable to calculate investment metrics without a rental estimate.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Investment Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LabeledSlider
            label="Down Payment"
            value={config.downPaymentPercent}
            min={5}
            max={50}
            step={1}
            unit="%"
            onChange={(value: number) => handleConfigChange('downPaymentPercent', value)}
          />
          <LabeledSlider
            label="Mortgage Rate"
            value={config.mortgageRate}
            min={2}
            max={10}
            step={0.1}
            unit="%"
            onChange={(value: number) => handleConfigChange('mortgageRate', value)}
          />
          <LabeledSlider
            label="Property Management"
            value={config.propertyManagementFee}
            min={0}
            max={15}
            step={0.5}
            unit="%"
            onChange={(value: number) => handleConfigChange('propertyManagementFee', value)}
          />
          <LabeledSlider
            label="Maintenance Reserve"
            value={config.maintenanceReserve}
            min={0}
            max={5}
            step={0.1}
            unit="%"
            onChange={(value: number) => handleConfigChange('maintenanceReserve', value)}
          />
          <LabeledSlider
            label="Vacancy Rate"
            value={config.vacancyRate}
            min={0}
            max={15}
            step={0.5}
            unit="%"
            onChange={(value: number) => handleConfigChange('vacancyRate', value)}
          />
        </CardContent>
      </Card>

      {calculations && (
        <Card>
          <CardHeader>
            <CardTitle>Investment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Monthly Cash Flow</h3>
                <p className={`text-2xl font-bold ${calculations.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(calculations.monthlyCashFlow)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Annual Cash Flow</h3>
                <p className={`text-2xl font-bold ${calculations.annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(calculations.annualCashFlow)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Cash on Cash Return</h3>
                <p className={`text-2xl font-bold ${calculations.cashOnCashReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(calculations.cashOnCashReturn / 100)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Cap Rate</h3>
                <p className="text-2xl font-bold">
                  {formatPercent(calculations.capRate / 100)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper function to calculate monthly expenses
function calculateMonthlyExpenses(
  propertyPrice: number,
  rentZestimate: number,
  config: ReturnType<typeof configManager.getConfig>
): number {
  const monthlyPropertyTax = (propertyPrice * (config.propertyTaxRate / 100)) / 12;
  const monthlyInsurance = (propertyPrice * (config.insuranceRate / 100)) / 12;
  const monthlyMaintenance = (propertyPrice * (config.maintenanceReserve / 100)) / 12;
  const monthlyPropertyManagement = rentZestimate * (config.propertyManagementFee / 100);
  const monthlyHOA = config.hoaFees;

  return (
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyMaintenance +
    monthlyPropertyManagement +
    monthlyHOA
  );
} 
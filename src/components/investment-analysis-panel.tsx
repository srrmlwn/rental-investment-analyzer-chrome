import { useEffect, useState } from "react"
import { ConfigPanel } from "./investment/config-panel"
import { CalculationInputs, createInitialInputs } from "@/types/calculationInputs"
import { CalculatedMetrics } from "@/types/calculatedMetrics"
import { calculateInvestmentMetrics } from "../services/calculator"
import { DataExtractor } from "@/services/dataExtractor"
import { DollarSign, Percent, TrendingUp } from "lucide-react"
import { UserParams } from "@/constants/userParams"

export function InvestmentAnalysisPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculationInputs, setCalculationInputs] = useState<CalculationInputs | null>(null);
  const [calculations, setCalculations] = useState<CalculatedMetrics | null>(null);
  const [userParams, setUserParams] = useState<UserParams | null>(null);

  // Extract property data and initialize calculation inputs on mount
  useEffect(() => {
    const extractAndInitialize = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dataExtractor = new DataExtractor();
        const extractedData = await dataExtractor.extractPropertyData();
        
        // Create UserParams instance with extracted data
        const params = new UserParams(extractedData);
        setUserParams(params);
        
        // Create initial calculation inputs using the helper function
        const initialInputs = createInitialInputs(extractedData);
        setCalculationInputs(initialInputs);
        
        const initialCalculations = calculateInvestmentMetrics(initialInputs);
        setCalculations(initialCalculations);
        
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to extract property data');
      } finally {
        setIsLoading(false);
      }
    };

    extractAndInitialize();
  }, []);

  // Update calculations when inputs change
  useEffect(() => {
    if (calculationInputs) {
      const newCalculations = calculateInvestmentMetrics(calculationInputs);
      setCalculations(newCalculations);
    }
  }, [calculationInputs]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!calculationInputs || !calculations) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
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

      {/* Investment Summary */}
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <h4 className="font-semibold mb-3">Investment Breakdown</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-gray-600">Monthly Mortgage:</span>
            <div className="font-semibold">${Math.round(calculations.monthlyMortgage).toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <span className="text-gray-600">Effective Rent:</span>
            <div className="font-semibold">${Math.round(calculationInputs.rentEstimate).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      {userParams && (
        <ConfigPanel 
          inputs={calculationInputs}
          onConfigChange={setCalculationInputs}
          userParams={userParams}
        />
      )}
      {/* Rest of the component */}
    </div>
  );
} 
import { DollarSign, TrendingUp, Percent } from "lucide-react"
import { useEffect, useState } from "react"
import { ConfigPanel } from "./investment/config-panel"
import { ConfigManager } from "@/services/configManager"
import { CalculationInputs } from "@/types/calculationInputs"
import { CalculatedMetrics } from "@/types/calculatedMetrics"
import { calculateInvestmentMetrics } from "../services/calculator"
import { DataExtractor } from "@/services/dataExtractor"

export function InvestmentAnalysisPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculationInputs, setCalculationInputs] = useState<CalculationInputs | null>(null);
  const [calculations, setCalculations] = useState<CalculatedMetrics | null>(null);
  const [propertyDetails, setPropertyDetails] = useState<{ propertyType: string; squareFeet: number } | null>(null);

  // Extract property data and initialize calculation inputs on mount
  useEffect(() => {
    const extractAndInitialize = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dataExtractor = new DataExtractor();
        const extractedData = await dataExtractor.extractPropertyData();
        
        console.log('[RIA Debug] Extracted property data:', {
          price: extractedData.price,
          priceFormatted: `$${extractedData.price.toLocaleString()}`
        });
        
        // Store property details for display
        setPropertyDetails({
          propertyType: extractedData.propertyType,
          squareFeet: extractedData.squareFeet
        });
        
        // Get user's preferred defaults from ConfigManager
        const userDefaults = ConfigManager.getInstance().getConfig();
        console.log('[RIA Debug] User defaults:', {
          purchasePrice: userDefaults.purchasePrice,
          purchasePriceFormatted: `$${userDefaults.purchasePrice.toLocaleString()}`
        });
        
        // Create calculation inputs combining user defaults and extracted data
        const inputs: CalculationInputs = {
          ...userDefaults,
          // Listing-specific values
          purchasePrice: extractedData.price,
          rentEstimate: extractedData.rentZestimate || 0,
          propertyTaxes: extractedData.propertyTaxes || 0,
          hoaFees: extractedData.hoaFees || 0
        };
        
        console.log('[RIA Debug] Final calculation inputs:', {
          purchasePrice: inputs.purchasePrice,
          purchasePriceFormatted: `$${inputs.purchasePrice.toLocaleString()}`
        });
        
        setCalculationInputs(inputs);
        
        // Calculate initial metrics
        const initialCalculations = calculateInvestmentMetrics(inputs);
        setCalculations(initialCalculations);
        
      } catch (error) {
        console.error('[RIA] Error extracting property data:', error);
        setError(error instanceof Error ? error.message : 'Failed to extract property data');
      } finally {
        setIsLoading(false);
      }
    };

    extractAndInitialize();
  }, []);

  // Subscribe to config changes
  useEffect(() => {
    if (!calculationInputs) return;

    const unsubscribe = ConfigManager.getInstance().subscribe((newInputs) => {
      setCalculationInputs(newInputs);
      const newCalculations = calculateInvestmentMetrics(newInputs);
      setCalculations(newCalculations);
    });
    return () => unsubscribe();
  }, [calculationInputs]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <p className="font-medium mb-2">Error loading property data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!calculationInputs || !calculations || !propertyDetails) {
    return null;
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
          <div className="space-y-1">
            <span className="text-gray-600">Property Type:</span>
            <div className="font-semibold">{propertyDetails.propertyType}</div>
          </div>
          <div className="space-y-1">
            <span className="text-gray-600">Square Feet:</span>
            <div className="font-semibold">{propertyDetails.squareFeet.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <ConfigPanel 
        inputs={calculationInputs}
        onConfigChange={(newInputs) => {
          setCalculationInputs(newInputs);
          const newCalculations = calculateInvestmentMetrics(newInputs);
          setCalculations(newCalculations);
        }}
      />
    </div>
  );
} 
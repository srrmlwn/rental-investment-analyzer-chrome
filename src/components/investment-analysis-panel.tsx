import { DollarSign, TrendingUp, Percent } from "lucide-react"
import { useEffect, useState } from "react"
import { ConfigPanel } from "./investment/config-panel"
import { ConfigManager } from "@/services/configManager"
import { InvestmentParams, InvestmentCalculations, PropertyData } from "@/types/investment"
import { calculateInvestmentMetrics } from "../services/calculator"
import { DataExtractor } from "@/services/dataExtractor"

export function InvestmentAnalysisPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<InvestmentParams | null>(null);
  const [needsManualRentInput, setNeedsManualRentInput] = useState(false);
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
    totalROI: 0,
    breakEvenYears: 0,
    netOperatingIncome: 0,
    debtServiceCoverageRatio: 0,
    totalInvestment: 0,
    totalReturn: 0,
    totalProfit: 0,
    annualizedReturn: 0,
  });

  // Extract property data and update configuration on mount
  useEffect(() => {
    const extractAndUpdateConfig = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dataExtractor = new DataExtractor();
        const extractedData = await dataExtractor.extractPropertyData();
        
        // Map extracted data to PropertyData type
        const propertyData: PropertyData = {
          price: extractedData.price,
          propertyType: extractedData.propertyType,
          bedrooms: extractedData.bedrooms || 0, // Default to 0 if not found
          bathrooms: extractedData.bathrooms || 0, // Default to 0 if not found
          squareFeet: extractedData.squareFeet,
          zipCode: extractedData.zipCode,
          rentEstimate: extractedData.rentZestimate || 0,
          rentSource: extractedData.rentZestimate ? 'Zestimate' : 'HUD',
          propertyTaxes: extractedData.propertyTaxes,
        };

        // Check if we need manual rent input
        setNeedsManualRentInput(!extractedData.bedrooms || !extractedData.bathrooms);
        
        // Log property data for debugging
        console.log('[RIA Debug] Extracted property data:', {
          price: propertyData.price,
          propertyType: propertyData.propertyType,
          bedrooms: propertyData.bedrooms || 'Not found',
          bathrooms: propertyData.bathrooms || 'Not found',
          squareFeet: propertyData.squareFeet,
          zipCode: propertyData.zipCode,
          rentEstimate: propertyData.rentEstimate,
          rentSource: propertyData.rentSource,
          propertyTaxes: propertyData.propertyTaxes
        });
        
        // Update configuration based on property data
        await ConfigManager.getInstance().updateFromPropertyData(propertyData);
        
        // Now that we have property data, get the config
        const initialConfig = ConfigManager.getInstance().getConfig();
        setConfig(initialConfig);
        setCalculations(calculateInvestmentMetrics(initialConfig));
        
        console.log('[RIA] Updated configuration based on property data:', propertyData);
      } catch (error) {
        console.error('[RIA] Error extracting property data:', error);
        setError(error instanceof Error ? error.message : 'Failed to extract property data');
      } finally {
        setIsLoading(false);
      }
    };

    extractAndUpdateConfig();
  }, []);

  // Subscribe to config changes
  useEffect(() => {
    if (!config) return; // Don't subscribe until we have initial config

    const unsubscribe = ConfigManager.getInstance().subscribe((newConfig) => {
      setConfig(newConfig);
      setCalculations(calculateInvestmentMetrics(newConfig));
    });
    return () => unsubscribe();
  }, [config]);

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

  if (!config) {
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

      {/* Configuration Panel with special rent input */}
      <ConfigPanel 
        onConfigChange={(newConfig) => {
          setConfig(newConfig);
          setCalculations(calculateInvestmentMetrics(newConfig));
        }}
        needsManualRentInput={needsManualRentInput}
      />

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

      {/* Additional Metrics */}
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <h4 className="font-semibold mb-3">Additional Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-gray-600">Total Investment:</span>
            <div className="font-semibold">${Math.round(calculations.totalInvestment).toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <span className="text-gray-600">Total Return:</span>
            <div className="font-semibold">${Math.round(calculations.totalReturn).toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <span className="text-gray-600">Total Profit:</span>
            <div className="font-semibold">${Math.round(calculations.totalProfit).toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <span className="text-gray-600">Annualized Return:</span>
            <div className="font-semibold">{calculations.annualizedReturn.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
} 
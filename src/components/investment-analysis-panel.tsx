import { useEffect, useState, useRef } from "react"
import { ConfigPanel } from "./investment/config-panel"
import { CalculationInputs, createInitialInputs } from "@/types/calculationInputs"
import { CalculatedMetrics } from "@/types/calculatedMetrics"
import { calculateInvestmentMetrics } from "../services/calculator"
import { DataExtractionService } from "@/services/dataExtraction"
import { DollarSign, Percent, TrendingUp, Home, ChevronDown } from "lucide-react"
import { UserParams } from "@/constants/userParams"
import { Button } from "./ui/button"
import { PropertyData } from "../types/propertyData"

// Helper function to format currency values
const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Helper function to format percentage values
const formatPercentage = (value?: number) => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

// Helper function to format numbers
const formatNumber = (value?: number) => {
  if (value === undefined || value === null) return 'N/A';
  return value.toLocaleString('en-US');
};

// Helper function to get display label for property data fields
const getPropertyDataLabel = (key: keyof PropertyData): string => {
  const labels: Record<keyof PropertyData, string> = {
    price: 'List Price',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    propertyType: 'Property Type',
    zipCode: 'Zip Code',
    rentZestimate: 'Rent Zestimate',
    hudRentEstimate: 'HUD Rent Estimate',
    monthlyPropertyTaxes: 'Monthly Property Tax',
    propertyTaxRate: 'Property Tax Rate',
    hoaFees: 'Monthly HOA Fees',
    units: 'Number of Units'
  };
  return labels[key];
};

// Helper function to format property data value
const formatPropertyDataValue = (key: keyof PropertyData, value: any): string => {
  if (value === undefined || value === null) return 'N/A';

  switch (key) {
    case 'price':
    case 'rentZestimate':
    case 'hudRentEstimate':
    case 'monthlyPropertyTaxes':
    case 'hoaFees':
      return formatCurrency(value);
    case 'propertyTaxRate':
      return formatPercentage(value);
    case 'bedrooms':
    case 'bathrooms':
    case 'units':
      return formatNumber(value);
    default:
      return String(value);
  }
};

export function InvestmentAnalysisPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculationInputs, setCalculationInputs] = useState<CalculationInputs | null>(null);
  const [calculations, setCalculations] = useState<CalculatedMetrics | null>(null);
  const [userParams, setUserParams] = useState<UserParams | null>(null);
  const [isPropertyInfoExpanded, setIsPropertyInfoExpanded] = useState(false);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const metricsRef = useRef<HTMLDivElement>(null);

  // Extract property data and initialize calculation inputs on mount
  useEffect(() => {
    const extractAndInitialize = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dataExtractor = new DataExtractionService();
        const extractedData = await dataExtractor.extractPropertyData();
        setPropertyData(extractedData);

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

  // Add scroll handler for metrics
  useEffect(() => {
    const handleScroll = () => {
      if (metricsRef.current) {
        const rect = metricsRef.current.getBoundingClientRect();
        setIsCompact(rect.top < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!calculationInputs || !calculations || !propertyData) {
    return <div>No data available</div>;
  }

  // Get all property data fields in a consistent order
  const propertyDataFields: (keyof PropertyData)[] = [
    'price',
    'propertyType',
    'units',
    'bedrooms',
    'bathrooms',
    'propertyTaxRate',
    'rentZestimate',
    'hudRentEstimate',
  ];

  const renderMetrics = (isCompact: boolean) => (
    <div 
      ref={metricsRef}
      className={`sticky top-0 z-50 transition-all duration-200 bg-white ${
        isCompact 
          ? 'bg-white/95 backdrop-blur-sm shadow-md' 
          : ''
      }`}
    >
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${isCompact ? 'gap-2' : ''}`}>
        <div className={`bg-white rounded-lg border shadow-sm ${isCompact ? 'p-2' : 'p-4'}`}>
          <div className={`flex items-center gap-2 ${isCompact ? 'mb-0' : 'mb-1'}`}>
            <DollarSign className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'} text-green-600`} />
            <span className={`${isCompact ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Monthly Cash Flow</span>
          </div>
          <div
            className={`${isCompact ? 'text-sm' : 'text-2xl'} font-bold ${
              calculations.monthlyCashFlow >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${calculations.monthlyCashFlow >= 0 ? "+" : ""}
            {Math.round(calculations.monthlyCashFlow).toLocaleString()}
          </div>
        </div>

        <div className={`bg-white rounded-lg border shadow-sm ${isCompact ? 'p-2' : 'p-4'}`}>
          <div className={`flex items-center gap-2 ${isCompact ? 'mb-0' : 'mb-1'}`}>
            <Percent className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'} text-blue-600`} />
            <span className={`${isCompact ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Cap Rate</span>
          </div>
          <div className={`${isCompact ? 'text-sm' : 'text-2xl'} font-bold text-blue-600`}>
            {calculations.capRate.toFixed(1)}%
          </div>
        </div>

        <div className={`bg-white rounded-lg border shadow-sm ${isCompact ? 'p-2' : 'p-4'}`}>
          <div className={`flex items-center gap-2 ${isCompact ? 'mb-0' : 'mb-1'}`}>
            <TrendingUp className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'} text-purple-600`} />
            <span className={`${isCompact ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Cash-on-Cash</span>
          </div>
          <div className={`${isCompact ? 'text-sm' : 'text-2xl'} font-bold text-purple-600`}>
            {calculations.cashOnCashReturn.toFixed(1)}%
          </div>
        </div>

        <div className={`bg-white rounded-lg border shadow-sm ${isCompact ? 'p-2' : 'p-4'}`}>
          <div className={`flex items-center gap-2 ${isCompact ? 'mb-0' : 'mb-1'}`}>
            <DollarSign className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'} text-orange-600`} />
            <span className={`${isCompact ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>Total Cash Needed</span>
          </div>
          <div className={`${isCompact ? 'text-sm' : 'text-2xl'} font-bold text-orange-600`}>
            ${Math.round(calculations.totalInvestment).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Metrics section - will stay at top */}
      {renderMetrics(isCompact)}

      {/* Scrollable content container */}
      <div className="flex-1 overflow-y-auto mt-4 pb-8" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="space-y-6">
          {/* Property Information Section */}
          <div className="space-y-4 bg-gray-50 rounded-lg p-4 border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Property Information</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPropertyInfoExpanded(!isPropertyInfoExpanded)}
                className="h-8 w-8 p-0"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isPropertyInfoExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            {isPropertyInfoExpanded && (
              <div className="grid gap-4 rounded-lg border p-4 bg-white">
                <div className="grid grid-cols-3 gap-4">
                  {propertyDataFields.map((field) => (
                    <div key={field}>
                      <p className="text-sm text-muted-foreground">{getPropertyDataLabel(field)}</p>
                      <p className="font-medium">{formatPropertyDataValue(field, propertyData[field])}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Configuration Panel */}
          {userParams && (
            <ConfigPanel
              inputs={calculationInputs}
              onConfigChange={setCalculationInputs}
              userParams={userParams}
              propertyData={propertyData}
            />
          )}
        </div>
      </div>
    </div>
  );
} 
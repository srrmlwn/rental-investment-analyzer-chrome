import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { SlidersHorizontal, ChevronDown, Home, Banknote, TrendingUp, Calculator, AlertTriangle } from 'lucide-react';
import { CalculationInputs } from '@/types/calculationInputs';
import { ConfigCategory, CONFIG_CATEGORIES, ConfigParameter } from '@/types/configTypes';
import { UserParams } from '@/constants/userParams';
import { cn } from '@/lib/utils';
import { PropertyData } from '@/types/propertyData';

interface ConfigPanelProps {
  onConfigChange?: (config: CalculationInputs) => void;
  inputs: CalculationInputs;
  userParams: UserParams;
  propertyData?: PropertyData;
  className?: string;
}

const CATEGORY_ICONS = {
  [CONFIG_CATEGORIES.PURCHASE_AND_REHAB]: Home,
  [CONFIG_CATEGORIES.FINANCING]: Banknote,
  [CONFIG_CATEGORIES.OPERATING_INCOME]: TrendingUp,
  [CONFIG_CATEGORIES.OPERATING_EXPENSES]: Calculator,
} as const;

export function ConfigPanel({ onConfigChange, inputs, userParams, propertyData, className }: ConfigPanelProps) {
  // Initialize all sections as expanded
  const [expandedSections, setExpandedSections] = useState<Record<ConfigCategory, boolean>>(
    Object.values(CONFIG_CATEGORIES).reduce((acc, category) => ({
      ...acc,
      [category]: true
    }), {} as Record<ConfigCategory, boolean>)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localInputs, setLocalInputs] = useState<CalculationInputs>(inputs);

  // Update local inputs when props change
  useEffect(() => {
    setLocalInputs(inputs);
  }, [inputs]);

  const handleConfigChange = (key: keyof CalculationInputs, value: number) => {
    const param = userParams.getParameterByKey(key);
    if (!param) return;

    try {
      if (value < param.getMin() || value > param.getMax()) {
        throw new Error(
          `Invalid value for ${param.label}: must be between ${
            param.type === 'currency' ? '$' : ''
          }${param.getMin().toLocaleString()} and ${
            param.type === 'currency' ? '$' : ''
          }${param.getMax().toLocaleString()}`
        );
      }

      // Update the value
      const newInputs = { ...localInputs, [key]: value };
      setLocalInputs(newInputs);
      setErrors(prev => ({ ...prev, [key]: '' }));
      
      // Notify parent of change
      if (onConfigChange) {
        onConfigChange(newInputs);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrors(prev => ({ ...prev, [key]: error.message }));
      }
    }
  };


  const formatValue = (value: number, unit?: string) => {
    if (unit === '%') {
      return `${value}%`;
    }
    if (unit === '$') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value.toString();
  };

  const renderParameterInput = (param: ReturnType<typeof userParams.getParameterByKey>) => {
    if (!param) return null;
    
    const error = errors[param.id];
    const value = localInputs[param.id];
    const min = param.getMin();
    const max = param.getMax();

    // Check for validation errors
    const hasValidationError = param.isErrorValue && param.isErrorValue(value, propertyData);
    const validationMessage = param.getErrorMessage && param.getErrorMessage(value, propertyData);

    const handleSliderChange = (newValue: number[]) => {
      handleConfigChange(param.id, newValue[0]);
    };

    return (
      <div className={cn("space-y-2", error && "border-red-500")}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Label className="text-sm font-medium">{param.label}</Label>
            {hasValidationError && (
              <div className="group relative">
                <AlertTriangle className="h-4 w-4 text-amber-500 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {validationMessage}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>
          <span className="text-sm font-bold text-blue-600">
            {formatValue(value, param.unit)}
          </span>
        </div>
        <Slider
          value={[value]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={param.step ?? 1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatValue(min, param.unit)}</span>
          <span>{formatValue(max, param.unit)}</span>
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  };

  const toggleSection = (category: ConfigCategory) => {
    setExpandedSections(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const renderCategorySection = (category: ConfigCategory) => {
    const Icon = CATEGORY_ICONS[category];
    const isExpanded = expandedSections[category];
    const parameters = userParams.getAllParameters().filter((param: ConfigParameter) => param.category === category);

    if (parameters.length === 0) return null;

    return (
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <button
          onClick={() => toggleSection(category)}
          className="w-full flex justify-between items-center hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
        >
          <h4 className="font-semibold flex items-center gap-2">
            <Icon className="h-4 w-4 text-blue-600" />
            {category}
          </h4>
          <ChevronDown className={cn(
            "h-4 w-4 text-gray-500 transition-transform duration-200",
            isExpanded && "transform rotate-180"
          )} />
        </button>
        {isExpanded && (
          <>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parameters.map((param: ConfigParameter) => (
                <div key={param.id}>
                  {renderParameterInput(param)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Card className={cn("border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <SlidersHorizontal className="h-5 w-5 text-blue-600" />
          Investment Parameters
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {Object.values(CONFIG_CATEGORIES).map(category => (
          <div key={category}>
            {renderCategorySection(category)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 
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

export function ConfigPanel({ onConfigChange, inputs, userParams, className }: ConfigPanelProps) {
  // Initialize all sections as expanded
  const [expandedSections, setExpandedSections] = useState<Record<ConfigCategory, boolean>>(
    Object.values(CONFIG_CATEGORIES).reduce((acc, category) => ({
      ...acc,
      [category]: true
    }), {} as Record<ConfigCategory, boolean>)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localInputs, setLocalInputs] = useState<CalculationInputs>(inputs);
  
  // State for inline editing - moved to component level
  const [editingParam, setEditingParam] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  
  // Track which parameters have been modified from their default values
  const [modifiedParams, setModifiedParams] = useState<Set<string>>(new Set());

  // Update local inputs when props change
  useEffect(() => {
    setLocalInputs(inputs);
  }, [inputs]);

  // Update input values when local inputs change
  useEffect(() => {
    const newInputValues: Record<string, string> = {};
    Object.keys(localInputs).forEach(key => {
      if (!editingParam || editingParam !== key) {
        newInputValues[key] = localInputs[key as keyof CalculationInputs].toString();
      }
    });
    setInputValues(prev => ({ ...prev, ...newInputValues }));
  }, [localInputs, editingParam]);

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
      
      // Check if the value is different from the default
      const defaultValue = userParams.getDefaultValue(key);
      if (value !== defaultValue) {
        setModifiedParams(prev => new Set(prev).add(key));
      } else {
        setModifiedParams(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
      
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
    const isEditing = editingParam === param.id;
    const inputValue = inputValues[param.id] !== undefined ? inputValues[param.id] : value.toString();

    // Check for validation errors
    const hasValidationError = param.isErrorValue && param.isErrorValue(value);
    const validationMessage = param.getErrorMessage && param.getErrorMessage();

    const handleSliderChange = (newValue: number[]) => {
      const newValueNumber = newValue[0];
      handleConfigChange(param.id, newValueNumber);
      if (!isEditing) {
        setInputValues(prev => ({ ...prev, [param.id]: newValueNumber.toString() }));
      }
    };

    // Input handlers for inline editing
    const handleInputBlur = () => {
      // Handle empty string as 0
      if (inputValue === '') {
        const defaultValue = Math.max(min, 0); // Use 0 or minimum value
        handleConfigChange(param.id, defaultValue);
        setInputValues(prev => ({ ...prev, [param.id]: defaultValue.toString() }));
        setEditingParam(null);
        return;
      }
      
      const numericValue = parseFloat(inputValue);
      
      if (!isNaN(numericValue)) {
        // Clamp to min/max range
        const clampedValue = Math.max(min, Math.min(max, numericValue));
        handleConfigChange(param.id, clampedValue);
        setInputValues(prev => ({ ...prev, [param.id]: clampedValue.toString() }));
      } else {
        // Reset to current value if invalid
        setInputValues(prev => ({ ...prev, [param.id]: value.toString() }));
      }
      setEditingParam(null);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleInputBlur();
      } else if (e.key === 'Escape') {
        setInputValues(prev => ({ ...prev, [param.id]: value.toString() }));
        setEditingParam(null);
      }
    };

    const handleInputChange = (newValue: string) => {
      setInputValues(prev => ({ ...prev, [param.id]: newValue }));
    };

    const handleStartEditing = () => {
      setEditingParam(param.id);
      setInputValues(prev => ({ ...prev, [param.id]: value.toString() }));
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
          
          {/* Editable current value */}
          <div className="relative">
            {isEditing ? (
              <input
                type="number"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                step={param.step ?? 1}
                min={min}
                max={max}
                className="w-20 px-2 py-1 text-sm font-bold text-green-600 border border-green-300 rounded focus:border-green-500 focus:outline-none text-right"
                autoFocus
              />
            ) : (
              <button
                onClick={handleStartEditing}
                className={cn(
                  "text-sm font-bold px-2 py-1 rounded transition-colors",
                  modifiedParams.has(param.id) 
                    ? "text-blue-600 hover:text-blue-800 hover:bg-blue-50" 
                    : "text-black hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                {formatValue(value, param.unit)}
              </button>
            )}
          </div>
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
    setExpandedSections(prev => {
      const newState = {
        ...prev,
        [category]: !prev[category]
      };
      return newState;
    });
  };

  const renderCategorySection = (category: ConfigCategory) => {
    const Icon = CATEGORY_ICONS[category];
    const isExpanded = expandedSections[category];
    const parameters = userParams.getAllParameters().filter((param: ConfigParameter) => param.category === category);

    if (parameters.length === 0) return null;

    return (
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            toggleSection(category);
          }}
          className="w-full flex justify-between items-center hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
        >
          <h4 className="font-semibold flex items-center gap-2">
            <Icon className="h-4 w-4 text-green-600" />
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
    <Card className={cn("border-2 border-green-200 bg-gradient-to-r from-green-50 to-lime-50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <SlidersHorizontal className="h-5 w-5 text-green-600" />
          Investment Parameters
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pb-8">
        {Object.values(CONFIG_CATEGORIES).map(category => (
          <div key={category}>
            {renderCategorySection(category)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 
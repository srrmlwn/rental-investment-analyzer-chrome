import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Separator } from '../ui/separator';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Calculator, Edit3, SlidersHorizontal, ChevronDown, Zap, Cog } from 'lucide-react';
import { CalculationInputs } from '@/types/calculationInputs';
import { ConfigCategory } from '@/types/configTypes';
import { UserParams } from '@/constants/userParams';
import { cn } from '@/lib/utils';

interface ConfigPanelProps {
  onConfigChange?: (config: CalculationInputs) => void;
  inputs: CalculationInputs;
  userParams: UserParams;
  className?: string;
}

export function ConfigPanel({ onConfigChange, inputs, userParams, className }: ConfigPanelProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
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

  const handleReset = () => {
    // Reset to initial values from props
    setLocalInputs(inputs);
    setErrors({});
    if (onConfigChange) {
      onConfigChange(inputs);
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

    const handleSliderChange = (newValue: number[]) => {
      handleConfigChange(param.id, newValue[0]);
    };

    return (
      <div className={cn("space-y-2", error && "border-red-500")}>
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">{param.label}</Label>
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

  return (
    <Card className={cn("border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <SlidersHorizontal className="h-5 w-5 text-blue-600" />
          Investment Parameters
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Adjustments */}
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            Quick Adjustments
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userParams.getBasicParameters().map((param) => (
              <div key={param.id}>
                {renderParameterInput(param)}
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <CollapsibleTrigger asChild>
              <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded">
                <h4 className="font-semibold flex items-center gap-2">
                  <Cog className="h-4 w-4 text-blue-600" />
                  Advanced Settings
                </h4>
                <ChevronDown className={cn(
                  "h-4 w-4 text-gray-500 transition-transform duration-200",
                  isAdvancedOpen && "transform rotate-180"
                )} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-4">
                <Separator className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userParams.getAdvancedParameters().map((param) => (
                    <div key={param.id}>
                      {renderParameterInput(param)}
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
} 
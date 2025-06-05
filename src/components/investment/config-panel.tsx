import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Separator } from '../ui/separator';
import { LabeledSlider } from '../ui/labeled-slider';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calculator, Edit3, SlidersHorizontal, ChevronDown, Zap, Cog } from 'lucide-react';
import { CalculationInputs } from '@/types/calculationInputs';
import { CONFIG_PARAMETERS, getBasicParameters, getParametersByCategory } from '@/constants/configParameters';
import { cn } from '@/lib/utils';

interface ConfigPanelProps {
  onConfigChange?: (config: CalculationInputs) => void;
  inputs: CalculationInputs;
  className?: string;
}

export function ConfigPanel({ onConfigChange, inputs, className }: ConfigPanelProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localInputs, setLocalInputs] = useState<CalculationInputs>(inputs);

  // Update local inputs when props change
  useEffect(() => {
    setLocalInputs(inputs);
  }, [inputs]);

  const handleConfigChange = (key: keyof CalculationInputs, value: number) => {
    const param = CONFIG_PARAMETERS.find(p => p.id === key);
    if (!param) return;

    try {
      // Validate the value
      const min = param.getMin(localInputs);
      const max = param.getMax(localInputs);
      
      if (value < min || value > max) {
        throw new Error(
          `Invalid value for ${param.label}: must be between ${
            param.type === 'currency' ? '$' : ''
          }${min.toLocaleString()} and ${
            param.type === 'currency' ? '$' : ''
          }${max.toLocaleString()}`
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

  const renderParameterInput = (param: typeof CONFIG_PARAMETERS[0]) => {
    const error = errors[param.id];

    if (param.useSlider) {
      const handleSliderChange = (newValue: number) => {
        handleConfigChange(param.id, newValue);        
      };

      return (
        <LabeledSlider
          label={param.label}
          value={param.getValue(localInputs) ?? 0}
          min={param.getMin(localInputs)}
          max={param.getMax(localInputs)}
          step={param.step ?? 1}
          unit={param.unit}
          onChange={handleSliderChange}
          disabled={false}
        />
      );
    }

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{param.label}</Label>
        <Input
          type="number"
          value={param.getValue(localInputs)}
          min={param.getMin(localInputs)}
          max={param.getMax(localInputs)}
          onChange={(e) => handleConfigChange(param.id, Number(e.target.value))}
          disabled={false}
          className={cn(
            "w-full",
            error && "border-red-500"
          )}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
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
            {getBasicParameters().map((param) => (
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
                {/* Group by category */}
                {(['Purchase', 'Loan', 'Operating'] as const).map((category) => {
                  const params = getParametersByCategory(category);
                  if (params.length === 0) return null;

                  return (
                    <div key={category} className="mb-6 last:mb-0">
                      <h5 className="font-medium text-sm text-gray-600 mb-3">{category} Parameters</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {params.map((param) => (
                          <div key={param.id}>
                            {renderParameterInput(param)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
} 
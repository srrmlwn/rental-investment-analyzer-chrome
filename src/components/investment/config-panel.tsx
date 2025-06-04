import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Separator } from '../ui/separator';
import { LabeledSlider } from '../ui/labeled-slider';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calculator, Edit3, RotateCcw } from 'lucide-react';
import { ConfigManager } from '@/services/configManager';
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
  const [config, setConfig] = useState<CalculationInputs>(inputs);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update local state when inputs prop changes
  useEffect(() => {
    console.log('[RIA Debug] ConfigPanel received new inputs:', {
      purchasePrice: inputs.purchasePrice,
      purchasePriceFormatted: `$${inputs.purchasePrice.toLocaleString()}`
    });
    setConfig(inputs);
  }, [inputs]);

  const handleConfigChange = async (key: keyof CalculationInputs, value: number) => {
    const param = CONFIG_PARAMETERS.find(p => p.id === key);
    if (!param) return;

    console.log('[RIA Debug] ConfigPanel handling config change:', {
      key,
      value,
      valueFormatted: key === 'purchasePrice' ? `$${value.toLocaleString()}` : value.toString()
    });

    try {
      await ConfigManager.getInstance().updateConfig({ [key]: value });
      setErrors(prev => ({ ...prev, [key]: '' }));
    } catch (error) {
      if (error instanceof Error) {
        setErrors(prev => ({ ...prev, [key]: error.message }));
      }
    }
  };

  const handleReset = async () => {
    await ConfigManager.getInstance().resetToDefaults();
  };

  const renderParameterInput = (param: typeof CONFIG_PARAMETERS[0]) => {
    const value = config[param.id];
    const error = errors[param.id];

    if (param.useSlider) {
      // For parameters with allowed values, snap to nearest allowed value
      const handleSliderChange = (newValue: number) => {
        handleConfigChange(param.id, newValue);        
      };

      return (
        <LabeledSlider
          label={param.label}
          value={value ?? 0}
          min={param.min ?? 0}
          max={param.max ?? 100}
          step={param.step ?? 1}
          unit={param.unit}
          onChange={handleSliderChange}
          disabled={false}
          marks={param.allowedValues?.map(v => ({ value: v, label: v.toString() }))}
        />
      );
    }

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{param.label}</Label>
        <Input
          type="number"
          value={value}
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
          <Calculator className="h-5 w-5 text-blue-600" />
          Investment Parameters
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Adjustments */}
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-blue-600" />
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
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              Advanced Settings
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <Separator />
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Advanced Settings</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="gap-2"
                  title="Reset to default values"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>

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
        </Collapsible>
      </CardContent>
    </Card>
  );
} 
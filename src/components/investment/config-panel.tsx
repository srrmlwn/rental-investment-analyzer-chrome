import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Separator } from '../ui/separator';
import { LabeledSlider } from '../ui/labeled-slider';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Calculator, Edit3, RotateCcw, Zap } from 'lucide-react';
import { ConfigManager, DEFAULT_PRESETS } from '@/services/configManager';
import { InvestmentParams } from '@/types/investment';
import { CONFIG_PARAMETERS, getBasicParameters, getAdvancedParameters, getParametersByCategory } from '@/constants/configParameters';
import { cn } from '@/lib/utils';

interface ConfigPanelProps {
  onConfigChange?: (config: InvestmentParams) => void;
  className?: string;
}

export function ConfigPanel({ onConfigChange, className }: ConfigPanelProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [config, setConfig] = useState<InvestmentParams>(ConfigManager.getInstance().getConfig());
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Subscribe to config changes
  useEffect(() => {
    const unsubscribe = ConfigManager.getInstance().subscribe((newConfig) => {
      setConfig(newConfig);
      onConfigChange?.(newConfig);
    });
    return () => unsubscribe();
  }, [onConfigChange]);

  const handleConfigChange = async (key: keyof InvestmentParams, value: number) => {
    const param = CONFIG_PARAMETERS.find(p => p.key === key);
    if (!param) return;

    try {
      await ConfigManager.getInstance().updateConfig({ [key]: value });
      setErrors(prev => ({ ...prev, [key]: '' }));
    } catch (error) {
      if (error instanceof Error) {
        setErrors(prev => ({ ...prev, [key]: error.message }));
      }
    }
  };

  const handlePresetApply = async (presetKey: keyof typeof DEFAULT_PRESETS) => {
    await ConfigManager.getInstance().applyPreset(presetKey);
  };

  const handleReset = async () => {
    await ConfigManager.getInstance().resetToDefaults();
  };

  const renderParameterInput = (param: typeof CONFIG_PARAMETERS[0]) => {
    const value = config[param.key];
    const error = errors[param.key];

    if (param.isReadOnly) {
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{param.label}</Label>
          <Input
            value={value}
            disabled
            className="bg-gray-50"
          />
        </div>
      );
    }

    if (param.type === 'percentage' || (param.type === 'currency' && param.min !== undefined && param.max !== undefined)) {
      return (
        <LabeledSlider
          label={param.label}
          value={value ?? 0} // Provide default of 0 if value is undefined
          min={param.min ?? 0}
          max={param.max ?? 100}
          step={param.step ?? 1}
          unit={param.unit}
          onChange={(newValue) => handleConfigChange(param.key, newValue)}
          disabled={param.isAutoFilled}
        />
      );
    }

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{param.label}</Label>
        <Input
          type="number"
          value={value}
          onChange={(e) => handleConfigChange(param.key, Number(e.target.value))}
          disabled={param.isAutoFilled}
          className={cn(
            "w-full",
            error && "border-red-500",
            param.isAutoFilled && "bg-gray-50"
          )}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {param.isAutoFilled && (
          <p className="text-xs text-gray-500">Auto-filled from property data</p>
        )}
      </div>
    );
  };

  return (
    <Card className={cn("border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-900">Investment Configuration</CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Live Calculator
            </Badge>
          </div>
          <div className="flex gap-2">
            {/* Quick Preset Buttons */}
            <div className="flex gap-1">
              {Object.entries(DEFAULT_PRESETS).map(([key, preset]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetApply(key as keyof typeof DEFAULT_PRESETS)}
                  className="text-xs px-2"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  Advanced
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
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
              <div key={param.key}>
                {renderParameterInput(param)}
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
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
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>

              {/* Group by category */}
              {(['Purchase', 'Loan', 'Operating', 'Growth', 'Tax', 'Analysis'] as const).map((category) => {
                const params = getParametersByCategory(category);
                if (params.length === 0) return null;

                return (
                  <div key={category} className="mb-6 last:mb-0">
                    <h5 className="font-medium text-sm text-gray-600 mb-3">{category} Parameters</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {params.map((param) => (
                        <div key={param.key}>
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
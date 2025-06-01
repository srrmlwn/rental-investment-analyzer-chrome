import React from 'react';
import { Slider } from './slider';
import { Label } from './label';
import { cn } from '@/lib/utils';

interface LabeledSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export function LabeledSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  disabled = false,
  className,
  error,
}: LabeledSliderProps) {
  const formatValue = (val: number) => {
    if (unit === '%') {
      return `${val}%`;
    }
    if (unit === '$') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    return val.toString();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm font-medium text-gray-600">
          {formatValue(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([newValue]) => onChange(newValue)}
        disabled={disabled}
        className={cn(
          "w-full",
          error && "border-red-500",
          disabled && "opacity-50"
        )}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 
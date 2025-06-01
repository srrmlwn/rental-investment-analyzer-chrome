import React from 'react';
import { Slider } from './slider';
import { Label } from './label';

interface LabeledSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const LabeledSlider: React.FC<LabeledSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</Label>
        <span className="text-sm font-medium">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        id={label.toLowerCase().replace(/\s+/g, '-')}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([newValue]) => onChange(newValue)}
        disabled={disabled}
      />
    </div>
  );
}; 
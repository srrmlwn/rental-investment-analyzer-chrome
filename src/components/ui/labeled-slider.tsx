import React, { useState } from 'react';
import { Slider } from './slider';
import { Label } from './label';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface Mark {
  value: number;
  label: string;
}

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
  marks?: Mark[]; // Optional marks for specific values
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
  marks,
}: LabeledSliderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

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

  const handleValueClick = () => {
    if (disabled) return;
    setIsEditing(true);
    setEditValue(value.toString());
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleValueBlur = () => {
    setIsEditing(false);
    const newValue = Number(editValue);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    } else {
      setEditValue(value.toString()); // Reset to current value if invalid
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleValueBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value.toString());
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{label}</Label>
        {isEditing ? (
          <Input
            type="number"
            value={editValue}
            onChange={handleValueChange}
            onBlur={handleValueBlur}
            onKeyDown={handleKeyDown}
            className="w-24 h-6 text-sm"
            min={min}
            max={max}
            step={step}
            autoFocus
          />
        ) : (
          <span 
            className="text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900"
            onClick={handleValueClick}
            title="Click to edit value"
          >
            {formatValue(value)}
          </span>
        )}
      </div>
      <div className="relative">
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
        {marks && (
          <div className="absolute w-full flex justify-between px-1 mt-1">
            {marks.map((mark) => (
              <div
                key={mark.value}
                className="text-xs text-gray-500"
                style={{
                  transform: 'translateX(-50%)',
                  left: `${((mark.value - min) / (max - min)) * 100}%`,
                }}
              >
                {mark.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 
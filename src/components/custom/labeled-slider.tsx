import * as React from "react"
import { Slider } from "../ui/slider"
import { Label } from "@radix-ui/react-label"
import { cn } from "../../utils/cn"

interface LabeledSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  formatValue?: (value: number) => string
  onChange: (value: number) => void
  className?: string
  description?: string
}

export function LabeledSlider({
  label,
  value,
  min,
  max,
  step = 1,
  formatValue = (v) => v.toString(),
  onChange,
  className,
  description,
}: LabeledSliderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </Label>
        <span className="text-sm text-muted-foreground">
          {formatValue(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([newValue]) => onChange(newValue)}
        className="w-full"
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
} 
import * as React from "react"
import { Label } from "@radix-ui/react-label"
import { cn } from "../../utils/cn"

interface NumericInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  formatValue?: (value: number) => string
  parseValue?: (value: string) => number
  className?: string
  description?: string
  error?: string
  disabled?: boolean
}

export function NumericInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue = (v) => v.toString(),
  parseValue = (v) => Number(v),
  className,
  description,
  error,
  disabled,
}: NumericInputProps) {
  const [inputValue, setInputValue] = React.useState(formatValue(value))

  React.useEffect(() => {
    setInputValue(formatValue(value))
  }, [value, formatValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    const parsed = parseValue(newValue)
    if (!isNaN(parsed)) {
      if (min !== undefined && parsed < min) return
      if (max !== undefined && parsed > max) return
      onChange(parsed)
    }
  }

  const handleBlur = () => {
    setInputValue(formatValue(value))
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </Label>
      <input
        type="number"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive"
        )}
      />
      {(description || error) && (
        <p
          className={cn(
            "text-xs",
            error ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {error || description}
        </p>
      )}
    </div>
  )
} 
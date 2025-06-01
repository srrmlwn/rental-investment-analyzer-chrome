import * as React from "react"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { cn } from "../../utils/cn"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    label: string
  }
  className?: string
  variant?: "default" | "success" | "warning" | "destructive"
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  variant = "default",
}: MetricCardProps) {
  const getTrendColor = (value: number) => {
    if (value > 0) return "success"
    if (value < 0) return "destructive"
    return "secondary"
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {title}
            </span>
          </div>
          {trend && (
            <Badge variant={getTrendColor(trend.value) as any}>
              {trend.label}
            </Badge>
          )}
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 
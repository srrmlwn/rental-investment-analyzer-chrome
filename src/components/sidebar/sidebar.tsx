import * as React from "react"
import { cn } from "../../utils/cn"
import { InvestmentAnalysisPanel } from "./investment-analysis-panel"

interface SidebarProps {
  className?: string
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-[400px] bg-background border-l shadow-lg transition-transform duration-300 ease-in-out transform",
        isOpen ? "translate-x-0" : "translate-x-full",
        className
      )}
    >
      <div className="h-full overflow-y-auto">
        <InvestmentAnalysisPanel />
      </div>
    </div>
  )
} 
import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "../../utils/cn"
import { Button } from "../ui/button"

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  icon?: React.ReactNode
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className,
  icon,
}: CollapsibleSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <CollapsiblePrimitive.Root
      open={open}
      onOpenChange={setOpen}
      className={cn("w-full space-y-2", className)}
    >
      <div className="flex items-center justify-between">
        <CollapsiblePrimitive.Trigger asChild>
          <Button
            variant="ghost"
            className="flex w-full items-center justify-between p-2 hover:bg-accent"
          >
            <div className="flex items-center space-x-2">
              {icon}
              <span className="text-sm font-medium">{title}</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                open && "transform rotate-180"
              )}
            />
          </Button>
        </CollapsiblePrimitive.Trigger>
      </div>
      <CollapsiblePrimitive.Content className="space-y-2 px-2">
        {children}
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  )
} 
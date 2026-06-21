import { cn } from "@/lib/utils"

import type { MetricBg } from "../../data/landing"

const textColorMap: Record<MetricBg, string> = {
  primary: "text-primary",
  success: "text-success",
  danger: "text-destructive",
}

interface DashboardRowProps {
  readonly name: string
  readonly pct: string
  readonly margin: string
  readonly color: MetricBg
}

export function DashboardRow({ name, pct, margin, color }: Readonly<DashboardRowProps>) {
  return (
    <div className="flex items-center justify-between bg-muted rounded-lg px-3 py-2 text-xs font-medium">
      <span>{name}</span>
      <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: pct }} />
      </div>
      <span className={cn(textColorMap[color])}>{margin}</span>
    </div>
  )
}

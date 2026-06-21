import { cn } from "@/lib/utils"

import type { MetricBg } from "../../data/landing"

const textColorMap: Record<MetricBg, string> = {
  primary: "text-primary",
  success: "text-success",
  danger: "text-destructive",
}

const metricBgMap: Record<MetricBg, string> = {
  primary: "bg-primary/10",
  success: "bg-success/10",
  danger: "bg-destructive/10",
}

interface DashboardMetricProps {
  readonly label: string
  readonly value: string
  readonly bg: MetricBg
}

export function DashboardMetric({ label, value, bg }: Readonly<DashboardMetricProps>) {
  return (
    <div className={cn(metricBgMap[bg], "rounded-xl p-3 text-center")}>
      <p className={cn("text-xs", textColorMap[bg], "font-medium")}>{label}</p>
      <p className={cn("text-xl font-bold", textColorMap[bg])}>{value}</p>
    </div>
  )
}

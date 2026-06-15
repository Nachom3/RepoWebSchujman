import type { MetricBg } from '../../data/landing'

const metricColorMap: Record<MetricBg, string> = {
  primary: 'text-primary',
  success: 'text-success',
  danger: 'text-danger',
}

const metricBgMap: Record<MetricBg, string> = {
  primary: 'bg-primary/10',
  success: 'bg-success/10',
  danger: 'bg-danger/10',
}

export interface DashboardMetricProps {
  readonly label: string
  readonly value: string
  readonly bg: MetricBg
}

export function DashboardMetric({ label, value, bg }: Readonly<DashboardMetricProps>) {
  return (
    <div className={`${metricBgMap[bg]} rounded-xl p-3 text-center`}>
      <p className={`text-xs ${metricColorMap[bg]} font-medium`}>{label}</p>
      <p className={`text-xl font-bold ${metricColorMap[bg]}`}>{value}</p>
    </div>
  )
}

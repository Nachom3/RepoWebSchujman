import { useEffect, useState } from "react"
import { PieChart, Pie, Cell } from "recharts"
import { motion } from "framer-motion"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  type ChartConfig,
} from "@/components/ui/chart"
import { getProjects } from "@/features/proyectos/services/projectService"
import type { ProjectStatus } from "@/features/proyectos"

const chartConfig = {
  PENDIENTE: { label: "Pendiente", color: "var(--chart-5)" },
  EN_CURSO: { label: "En curso", color: "var(--chart-1)" },
  PAUSADA: { label: "Pausada", color: "var(--chart-2)" },
  FINALIZADA: { label: "Finalizada", color: "var(--chart-3)" },
  CANCELADA: { label: "Cancelada", color: "var(--chart-4)" },
} satisfies ChartConfig

const STATUS_KEYS: ProjectStatus[] = [
  "PENDIENTE",
  "EN_CURSO",
  "PAUSADA",
  "FINALIZADA",
  "CANCELADA",
]

interface StatusCount {
  readonly name: string
  readonly value: number
  readonly status: ProjectStatus
}

function countByStatus(projects: { status: ProjectStatus }[]): StatusCount[] {
  const counts: Record<ProjectStatus, number> = {
    PENDIENTE: 0,
    EN_CURSO: 0,
    PAUSADA: 0,
    FINALIZADA: 0,
    CANCELADA: 0,
  }

  for (const project of projects) {
    counts[project.status]++
  }

  return STATUS_KEYS.map((status) => ({
    name: chartConfig[status].label as string,
    value: counts[status],
    status,
  }))
}

interface LegendPayloadItem {
  readonly value: string
  readonly color?: string
  readonly payload?: StatusCount
}

function CustomLegend({ payload, total }: { readonly payload?: LegendPayloadItem[]; readonly total: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-2">
      {payload?.map((entry) => {
        const count = entry.payload?.value ?? 0
        const pct = total > 0 ? Math.round((count / total) * 100) : 0
        return (
          <div key={entry.value} className="flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground">{entry.value}</span>
            <span className="text-xs font-medium">{count}</span>
            <span className="text-xs text-muted-foreground/60">({pct}%)</span>
          </div>
        )
      })}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="size-[200px] rounded-full" />
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-16 rounded-full" />
        ))}
      </div>
    </div>
  )
}

export function ProjectsByStatusChart() {
  const [projects, setProjects] = useState<{ status: ProjectStatus }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchProjects() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProjects()
        if (!cancelled) setProjects(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar obras")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProjects()
    return () => {
      cancelled = true
    }
  }, [])

  const data = countByStatus(projects)
  const total = projects.length
  const activeData = data.filter((d) => d.value > 0)

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card surface="glass">
        <CardHeader>
          <CardTitle className="text-base">Obras por estado</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <ChartSkeleton />}
          {!loading && error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {!loading && !error && total === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay obras registradas
            </p>
          )}
          {!loading && !error && total > 0 && (
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <PieChart accessibilityLayer>
                <Pie
                  data={activeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="status"
                  strokeWidth={0}
                >
                  {activeData.map((entry) => (
                    <Cell key={entry.status} fill={`var(--color-${entry.status})`} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="status"
                      formatter={(value) =>
                        `${value} obra${Number(value) !== 1 ? "s" : ""}`
                      }
                    />
                  }
                />
                <ChartLegend content={<CustomLegend total={total} />} verticalAlign="bottom" />
                <text
                  x="50%"
                  y="48%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-card-foreground text-2xl font-bold"
                >
                  {total}
                </text>
                <text
                  x="50%"
                  y="57%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-muted-foreground text-[10px]"
                >
                  Total
                </text>
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

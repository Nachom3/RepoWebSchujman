import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fadeInUp } from "@/lib/animations"
import { getPayments } from "@/features/pagos/services/paymentService"
import type { Payment } from "@/features/pagos"

const chartConfig = {
  income: { label: "Ingreso", color: "var(--chart-2)" },
} satisfies ChartConfig

interface MonthlyRevenue {
  readonly month: string
  readonly revenue: number
}

const MONTH_NAMES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
] as const

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function getMonthLabel(date: Date): string {
  return MONTH_NAMES[date.getMonth()]
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function processPayments(payments: Payment[]): MonthlyRevenue[] {
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const cobros = payments.filter(
    (payment) =>
      payment.type === "COBRO" && new Date(payment.date) >= sixMonthsAgo,
  )

  const revenueByMonth = new Map<string, number>()
  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    revenueByMonth.set(getMonthKey(date), 0)
  }

  for (const payment of cobros) {
    const date = new Date(payment.date)
    const key = getMonthKey(date)
    revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + payment.amount)
  }

  const result: MonthlyRevenue[] = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = getMonthKey(date)
    result.push({ month: getMonthLabel(date), revenue: revenueByMonth.get(key) ?? 0 })
  }
  return result
}

const SKELETON_HEIGHTS = ["45%", "65%", "55%", "70%", "40%", "60%"] as const

function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3 h-64">
        {SKELETON_HEIGHTS.map((height, i) => (
          <Skeleton key={i} className="flex-1 rounded-t" style={{ height }} />
        ))}
      </div>
    </div>
  )
}

export function RevenueChart() {
  const [data, setData] = useState<MonthlyRevenue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchRevenue() {
      try {
        setIsLoading(true)
        setError(null)
        const payments = await getPayments()
        if (!cancelled) setData(processPayments(payments))
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar los datos")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetchRevenue()
    return () => {
      cancelled = true
    }
  }, [])

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <motion.div {...fadeInUp}>
      <Card surface="glass" className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cobros mensuales</CardTitle>
          {!isLoading && !error && (
            <div className="text-right">
              <p className="text-2xl font-bold text-card-foreground">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading && <ChartSkeleton />}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {!isLoading && !error && (
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                  width={50}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-income)" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

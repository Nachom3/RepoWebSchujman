import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Hammer, Clock, Wallet, Users } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { stagger } from "@/lib/animations"
import { getClients } from "@/features/clientes/services/clientService"
import { getProjects } from "@/features/proyectos/services/projectService"
import { getPanelSummary } from "@/features/panel-overview/services/panelService"

interface StatCardProps {
  readonly label: string
  readonly value: string | number
  readonly trend: string
  readonly icon: React.ReactNode
  readonly color: string
  readonly iconBg: string
  readonly index: number
  readonly loading?: boolean
}

function StatCard({
  label,
  value,
  trend,
  icon,
  color,
  iconBg,
  index,
  loading,
}: Readonly<StatCardProps>) {
  if (loading) {
    return (
      <Card surface="glass" padding="md" className="flex items-center gap-4">
        <Skeleton className="size-12 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      </Card>
    )
  }

  return (
    <motion.div {...stagger(index)}>
      <Card surface="glass" padding="md" className="flex items-center gap-4">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            iconBg,
          )}
        >
          <span className={cn("size-6", color)}>{icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
        </div>
      </Card>
    </motion.div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function StatsRow() {
  const [stats, setStats] = useState<{
    activeClients: number | null;
    activeProjects: number | null;
    monthlyIncome: number | null;
    pendingProjects: number | null;
    staff: number | null;
  }>({
    activeClients: null,
    activeProjects: null,
    monthlyIncome: null,
    pendingProjects: null,
    staff: null,
  });
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const [clients, _projects, panel] = await Promise.all([
          getClients("ACTIVE"),
          getProjects(),
          getPanelSummary(),
        ]);

        if (cancelled) return;

        setStats({
          activeClients: clients.length,
          activeProjects: panel.activeProjects,
          pendingProjects: panel.pendingProjects,
          monthlyIncome: panel.monthlyIncome,
          staff: null,
        });
      } catch {
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const fmt = (value: number | null) => {
    if (hasError || value === null) return "—";
    return value.toLocaleString("es-AR");
  };

  const cards = [
    {
      label: "Clientes activos",
      value: fmt(stats.activeClients),
      trend: "Total cargado",
      icon: <Users className="size-5" />,
      color: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Obras en curso",
      value: fmt(stats.activeProjects),
      trend: "En ejecución",
      icon: <Hammer className="size-5" />,
      color: "text-accent",
      iconBg: "bg-accent/10",
    },
    {
      label: "Obras pendientes",
      value: fmt(stats.pendingProjects),
      trend: "A iniciar",
      icon: <Clock className="size-5" />,
      color: "text-amber-600",
      iconBg: "bg-amber-500/10",
    },
    {
      label: "Ingreso del mes",
      value:
        hasError || stats.monthlyIncome === null
          ? "—"
          : formatCurrency(stats.monthlyIncome),
      trend: "Cobros acumulados",
      icon: <Wallet className="size-5" />,
      color: "text-emerald-600",
      iconBg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat, i) => (
        <StatCard key={stat.label} index={i} loading={loading} {...stat} />
      ))}
    </div>
  )
}

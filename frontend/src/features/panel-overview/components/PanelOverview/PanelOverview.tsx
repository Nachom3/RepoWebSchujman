import { motion } from "framer-motion";
import {
  Building2,
  Clock,
  AlertTriangle,
  DollarSign,
  Package,
  ListChecks,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeInUp } from "@/lib/animations";
import { usePanelSummary } from "../../hooks/usePanelSummary";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function MetricCard({
  title,
  value,
  icon,
  variant = "default",
}: {
  readonly title: string;
  readonly value: string | number;
  readonly icon: React.ReactNode;
  readonly variant?: "default" | "warn" | "danger";
}) {
  const colorClass =
    variant === "danger"
      ? "text-destructive"
      : variant === "warn"
        ? "text-amber-600"
        : "text-foreground";

  return (
    <Card surface="glass" padding="md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold tabular-nums ${colorClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function SummarySkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} surface="glass" padding="md">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function PanelOverview() {
  const { data, isLoading, error } = usePanelSummary();

  if (isLoading) return <SummarySkeleton />;

  if (error || !data) {
    return (
      <Card surface="glass" padding="md">
        <CardContent className="py-10 text-center">
          <p className="text-destructive font-medium">No se pudo cargar el panel</p>
          <p className="text-sm text-muted-foreground mt-1">{error ?? "Reintentá más tarde."}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div {...fadeInUp} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Obras en curso"
          value={data.activeProjects}
          icon={<Building2 className="size-4" />}
        />
        <MetricCard
          title="Obras pendientes"
          value={data.pendingProjects}
          icon={<Clock className="size-4" />}
        />
        <MetricCard
          title="Obras finalizadas"
          value={data.finishedProjects}
          icon={<Building2 className="size-4" />}
        />
        <MetricCard
          title="Cobros del mes"
          value={formatCurrency(data.monthlyIncome)}
          icon={<DollarSign className="size-4 text-emerald-600" />}
        />
        <MetricCard
          title="Gastos del mes"
          value={formatCurrency(data.monthlyExpense)}
          icon={<DollarSign className="size-4 text-destructive" />}
        />
        <MetricCard
          title="Materiales con stock bajo"
          value={data.lowStockMaterials}
          icon={<Package className="size-4" />}
          variant={data.lowStockMaterials > 0 ? "warn" : "default"}
        />
      </div>

      {data.overdueTasks > 0 && (
        <Card surface="glass" padding="md" className="border-destructive/30">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="size-5 text-destructive" />
            <div>
              <p className="font-medium">
                {data.overdueTasks} {data.overdueTasks === 1 ? "tarea atrasada" : "tareas atrasadas"}
              </p>
              <p className="text-sm text-muted-foreground">
                Revisá el módulo de tareas para reasignar o actualizar el estado.
              </p>
            </div>
            <ListChecks className="size-5 ml-auto text-muted-foreground" />
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

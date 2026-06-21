import { usePanelSummary } from "../../hooks/usePanelSummary";
import { MetricCard } from "../MetricCard";
import { WeeklyBar } from "../WeeklyBar";
import { PeakHourList } from "../PeakHourList";

export function PanelView() {
  const { data: summary, isLoading, error } = usePanelSummary();

  if (isLoading) {
    return <div className="p-4">Cargando...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  if (!summary) {
    return <div className="p-4">No hay datos disponibles.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Ingreso Mensual"
          value={`$${summary.monthlyIncome.toLocaleString()}`}
        />
        <MetricCard
          title="m³ Despachados (Semana)"
          value={summary.m3DispatchedThisWeek.toLocaleString()}
        />
        <MetricCard
          title="Pagos Recibidos"
          value={`$${summary.paymentStatus.paid.toLocaleString()}`}
        />
        <MetricCard
          title="Pagos Pendientes"
          value={`$${summary.paymentStatus.pending.toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyBar m3Dispatched={summary.m3DispatchedThisWeek} />
        <PeakHourList peakHours={summary.peakHours} />
      </div>
    </div>
  );
}

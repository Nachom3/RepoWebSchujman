import { PanelOverview } from "@/features/panel-overview";

export default function PanelPage() {
  return (
    <div className="mx-auto max-w-screen-xl space-y-6 px-4 py-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Panel</h1>
        <p className="text-muted-foreground">
          Resumen ejecutivo de la constructora: obras, ingresos, gastos y
          alertas.
        </p>
      </div>
      <PanelOverview />
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { PortalTrackProps } from "./PortalTrack.types";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDIENTE: "secondary",
  EN_PROCESO: "default",
  COMPLETADO: "outline",
  CANCELADO: "destructive",
};

export function PortalTrack({ order, isLoading, error, onBack }: PortalTrackProps) {
  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto">
        <p className="text-destructive">{error ?? "Pedido no encontrado"}</p>
        <Button variant="ghost" onClick={onBack} className="mt-4">
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <Button variant="ghost" onClick={onBack}>
        ← Volver
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pedido #{order.id}
            <Badge variant={STATUS_VARIANT[order.status] ?? "default"}>
              {order.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Fórmula</p>
              <p className="font-medium">#{order.formulaId}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cantidad</p>
              <p className="font-medium">{order.quantity} m³</p>
            </div>
            <div>
              <p className="text-muted-foreground">Dirección de obra</p>
              <p className="font-medium">{order.obraAddress ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha programada</p>
              <p className="font-medium">
                {order.scheduledDate
                  ? new Date(order.scheduledDate).toLocaleDateString("es-AR")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Precio</p>
              <p className="font-medium">
                {order.priceSnapshot != null ? `$${order.priceSnapshot}` : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Creado</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString("es-AR")}
              </p>
            </div>
          </div>
          {order.truck && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground text-sm">Camión asignado</p>
                <p className="font-medium">{order.truck.patente}</p>
              </div>
            </>
          )}
          {order.statusHistory.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground text-sm mb-2">Historial</p>
                <div className="space-y-2">
                  {order.statusHistory.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="text-xs">
                        {entry.status}
                      </Badge>
                      <span className="text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "../../hooks/useOrder";
import { useApproveOrder } from "../../hooks/useApproveOrder";
import { approveOrder, completeOrder, cancelOrder, assignTruck } from "../../services/orderService";
import type { PedidoDetailProps } from "./PedidoDetail.types";

const statusLabels: Record<string, string> = {
  PENDIENTE: "Pendiente",
  APROBADA: "Aprobada",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
};

export function PedidoDetail({ orderId }: PedidoDetailProps) {
  const navigate = useNavigate();
  const { data: order, isLoading, error, } = useOrder(orderId);
  const { mutate: approve, isLoading: isApproving } = useApproveOrder();

  if (isLoading) {
    return <div className="p-4">Cargando...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  if (!order) {
    return <div className="p-4">Pedido no encontrado.</div>;
  }

  const handleApprove = async () => {
    const result = await approve(orderId);
    if (result) {
      window.location.reload();
    }
  };

  const handleComplete = async () => {
    try {
      await completeOrder(orderId);
      window.location.reload();
    } catch {
      // error handled by service
    }
  };

  const handleCancel = async () => {
    try {
      await cancelOrder(orderId);
      window.location.reload();
    } catch {
      // error handled by service
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedido #{order.id}</h1>
        <Button variant="outline" onClick={() => navigate("/pedidos")}>
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estado:</span>
            <Badge
              variant={
                order.status === "COMPLETADA"
                  ? "default"
                  : order.status === "CANCELADA"
                    ? "destructive"
                    : "secondary"
              }
            >
              {statusLabels[order.status]}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cliente:</span>
            <span>{order.client.razonSocial}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fórmula:</span>
            <span>{order.formula.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cantidad:</span>
            <span>{order.quantity} m³</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Precio unitario:</span>
            <span>${order.priceSnapshot?.toLocaleString() ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-semibold">
              ${((order.priceSnapshot ?? 0) * order.quantity).toLocaleString()}
            </span>
          </div>
          {order.truck && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Camión:</span>
              <span>{order.truck.patente}</span>
            </div>
          )}
          {order.deliveryDate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha de entrega:</span>
              <span>{new Date(order.deliveryDate).toLocaleDateString()}</span>
            </div>
          )}
          {order.completedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completado:</span>
              <span>{new Date(order.completedAt).toLocaleString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          {order.status === "PENDIENTE" && (
            <>
              <Button onClick={handleApprove} disabled={isApproving}>
                {isApproving ? "Aprobando..." : "Aprobar"}
              </Button>
              <Button variant="destructive" onClick={handleCancel}>
                Cancelar
              </Button>
            </>
          )}
          {order.status === "APROBADA" && (
            <Button onClick={handleComplete}>Completar</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

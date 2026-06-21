import { useNavigate } from "react-router-dom";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { PedidoRowProps } from "./PedidoRow.types";

const statusLabels: Record<string, string> = {
  PENDIENTE: "Pendiente",
  APROBADA: "Aprobada",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
};

export function PedidoRow({ order }: PedidoRowProps) {
  const navigate = useNavigate();

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => navigate(`/pedidos/${order.id}`)}
    >
      <TableCell className="font-mono">#{order.id}</TableCell>
      <TableCell>{order.clientId}</TableCell>
      <TableCell>{order.formulaId}</TableCell>
      <TableCell>{order.quantity}</TableCell>
      <TableCell>
        <Badge
          variant={
            order.status === "COMPLETADA"
              ? "default"
              : order.status === "CANCELADA"
                ? "destructive"
                : "secondary"
          }
        >
          {statusLabels[order.status] ?? order.status}
        </Badge>
      </TableCell>
    </TableRow>
  );
}

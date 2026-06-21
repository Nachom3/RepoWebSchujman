import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "../../hooks/useOrders";
import type { OrderStatus } from "../../types";
import type { PedidoListProps } from "./PedidoList.types";

const statusLabels: Record<OrderStatus, string> = {
  PENDIENTE: "Pendiente",
  APROBADA: "Aprobada",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
};

export function PedidoList({ statusFilter, onStatusFilterChange }: PedidoListProps) {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useOrders(statusFilter as OrderStatus | undefined);
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(
    (o) =>
      String(o.id).includes(search) ||
      String(o.clientId).includes(search),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <Button onClick={() => navigate("/pedidos/new")}>Nuevo Pedido</Button>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Buscar por ID o cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={statusFilter ?? ""}
          onChange={(e) => onStatusFilterChange?.(e.target.value || undefined)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Todos</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="APROBADA">Aprobada</option>
          <option value="COMPLETADA">Completada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Fórmula</TableHead>
            <TableHead>Cantidad (m³)</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Cargando...
              </TableCell>
            </TableRow>
          ) : filteredOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No se encontraron pedidos.
              </TableCell>
            </TableRow>
          ) : (
            filteredOrders.map((order) => (
              <TableRow
                key={order.id}
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
                    {statusLabels[order.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pedidos/${order.id}`);
                    }}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClient } from "../../hooks/useClient";
import { useCreateMovement } from "../../hooks/useCreateMovement";
import type { MovementTipo } from "../../types";
import type { ClientDetailProps } from "./ClientDetail.types";

export function ClientDetail({ clientId }: ClientDetailProps) {
  const navigate = useNavigate();
  const { data: client, isLoading, error } = useClient(clientId);
  const { mutate: createMovement, isLoading: isCreating } = useCreateMovement(clientId);
  const [tipo, setTipo] = useState<MovementTipo>("DEBITO");
  const [monto, setMonto] = useState<number>(0);
  const [referencia, setReferencia] = useState("");
  const [movementError, setMovementError] = useState<string | null>(null);

  if (isLoading) {
    return <div className="p-4">Cargando...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  if (!client) {
    return <div className="p-4">Cliente no encontrado.</div>;
  }

  const handleCreateMovement = async () => {
    if (monto <= 0) {
      setMovementError("El monto debe ser mayor a 0");
      return;
    }
    setMovementError(null);
    const movement = await createMovement(tipo, monto, referencia || undefined);
    if (movement) {
      setMonto(0);
      setReferencia("");
      // The client data will be refetched on next render because useClient depends on clientId
      // However, we need to refetch client data. Since we don't have a refetch function,
      // we can force a re-render by incrementing a key. For simplicity, we'll just reload.
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{client.razonSocial}</h1>
        <Button variant="outline" onClick={() => navigate("/clientes")}>
          Volver
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">CUIT:</span>
            <span className="font-mono">{client.cuit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estado:</span>
            <Badge variant={client.status === "active" ? "default" : "secondary"}>
              {client.status === "active" ? "Activo" : "Deshabilitado"}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Saldo:</span>
            <span className="font-semibold">${client.saldo.toLocaleString()}</span>
          </div>
          {client.direccion && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dirección:</span>
              <span>{client.direccion}</span>
            </div>
          )}
          {client.telefono && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Teléfono:</span>
              <span>{client.telefono}</span>
            </div>
          )}
          {client.email && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{client.email}</span>
            </div>
          )}
          {client.contacto && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contacto:</span>
              <span>{client.contacto}</span>
            </div>
          )}
          {client.condicionIVA && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Condición IVA:</span>
              <span>{client.condicionIVA}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Registrar Movimiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as MovementTipo)}
                className="w-full border rounded px-2 py-1"
              >
                <option value="DEBITO">Débito</option>
                <option value="CREDITO">Crédito</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Monto</label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(parseFloat(e.target.value) || 0)}
                className="w-full border rounded px-2 py-1"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Referencia (opcional)</label>
            <input
              type="text"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          {movementError && <p className="text-red-500 text-sm">{movementError}</p>}
          <Button onClick={handleCreateMovement} disabled={isCreating}>
            {isCreating ? "Registrando..." : "Registrar Movimiento"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Referencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {client.movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No hay movimientos.
                  </TableCell>
                </TableRow>
              ) : (
                client.movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      {new Date(movement.fecha).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={movement.tipo === "DEBITO" ? "default" : "secondary"}>
                        {movement.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>${movement.monto.toLocaleString()}</TableCell>
                    <TableCell>{movement.referencia ?? "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
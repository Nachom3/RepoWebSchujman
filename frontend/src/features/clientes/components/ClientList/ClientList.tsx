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
import { useClients } from "../../hooks/useClients";
import type { ClientStatus } from "../../types";
import type { ClientListProps } from "./ClientList.types";

export function ClientList({ statusFilter, onStatusFilterChange }: ClientListProps) {
  const navigate = useNavigate();
  const { data: clients, isLoading, error } = useClients(statusFilter);
  const [search, setSearch] = useState("");

  const filteredClients = clients.filter(
    (c) =>
      c.razonSocial.toLowerCase().includes(search.toLowerCase()) ||
      c.cuit.includes(search),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={() => navigate("/clientes/new")}>Nuevo Cliente</Button>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Buscar por razón social o CUIT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={statusFilter ?? ""}
          onChange={(e) =>
            onStatusFilterChange?.(
              e.target.value ? (e.target.value as ClientStatus) : undefined,
            )
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Todos</option>
          <option value="active">Activos</option>
          <option value="disabled">Deshabilitados</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CUIT</TableHead>
            <TableHead>Razón Social</TableHead>
            <TableHead>Saldo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Cargando...
              </TableCell>
            </TableRow>
          ) : filteredClients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No se encontraron clientes.
              </TableCell>
            </TableRow>
          ) : (
            filteredClients.map((client) => (
              <TableRow
                key={client.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/clientes/${client.id}`)}
              >
                <TableCell className="font-mono">{client.cuit}</TableCell>
                <TableCell>{client.razonSocial}</TableCell>
                <TableCell>${client.saldo.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={client.status === "active" ? "default" : "secondary"}>
                    {client.status === "active" ? "Activo" : "Deshabilitado"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/clientes/${client.id}`);
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
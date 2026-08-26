import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useClients } from "../../hooks/useClients";
import type { ClientStatus } from "../../types";
import { getClientStatusBadgeVariant, getClientStatusLabel } from "../../presentation";

interface ClientListProps {
  readonly statusFilter?: ClientStatus;
  readonly onStatusFilterChange?: (status: ClientStatus | undefined) => void;
}

export function ClientList({ statusFilter, onStatusFilterChange }: ClientListProps) {
  const navigate = useNavigate();
  const { data: clients, isLoading, error } = useClients(statusFilter);
  const [search, setSearch] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.taxId ?? "").includes(search),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o CUIT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter ?? "all"}
          onValueChange={(value) =>
            onStatusFilterChange?.(
              value === "all" ? undefined : (value as ClientStatus),
            )
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ACTIVE">Activos</SelectItem>
            <SelectItem value="DISABLED">Deshabilitados</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => navigate("/clientes/new")} className="ml-auto">
          <Plus className="size-4" /> Nuevo Cliente
        </Button>
      </div>

      <Card surface="glass" padding="none">
        <CardHeader className="p-4">
          <p className="text-sm text-muted-foreground">
            {clients.length} cliente{clients.length === 1 ? "" : "s"} cargados
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="px-4 pb-4">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="px-4 pb-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="size-10 mb-3 opacity-40" />
              <p className="text-sm">No hay clientes registrados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CUIT/DNI</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((client) => (
                  <TableRow
                    key={client.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/clientes/${client.id}`)}
                  >
                    <TableCell className="font-mono">{client.taxId ?? "—"}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {client.email ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {client.phone ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getClientStatusBadgeVariant(client.status)}
                        className={cn(
                          client.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-600 border-transparent"
                            : "",
                        )}
                      >
                        {getClientStatusLabel(client.status)}
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
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

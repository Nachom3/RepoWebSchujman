import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Building2 } from "lucide-react";

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
import { fadeInUp } from "@/lib/animations";
import { useProjects } from "../../hooks/useProjects";
import type { ProjectStatus } from "../../types";
import { STATUS_LABEL, STATUS_VARIANT } from "../../presentation";

interface ProjectListProps {
  readonly statusFilter?: ProjectStatus;
  readonly onStatusFilterChange?: (status: ProjectStatus | undefined) => void;
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function ProgressCell({ percent }: { readonly percent: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground">{percent}%</span>
    </div>
  );
}

export function ProjectList({ statusFilter, onStatusFilterChange }: ProjectListProps) {
  const navigate = useNavigate();
  const { data, isLoading, error } = useProjects(statusFilter);
  const [search, setSearch] = useState("");

  const filtered = data.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).includes(search) ||
      String(p.clientId).includes(search),
  );

  return (
    <motion.div {...fadeInUp}>
      <Card surface="glass" padding="none">
        <CardHeader className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter ?? "all"}
              onValueChange={(value) =>
                onStatusFilterChange?.(
                  value === "all" ? undefined : (value as ProjectStatus),
                )
              }
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="EN_CURSO">En curso</SelectItem>
                <SelectItem value="PAUSADA">Pausada</SelectItem>
                <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                <SelectItem value="CANCELADA">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {error && <p className="text-destructive text-sm mb-4">{error}</p>}

          {isLoading ? (
            <ListSkeleton />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Building2 className="size-10 mb-3 opacity-40" />
              <p className="text-sm">No hay obras registradas</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Avance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((project) => (
                  <TableRow
                    key={project.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/proyectos/${project.id}`)}
                  >
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      #{project.clientId}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {project.type.replace(/_/g, " ").toLowerCase()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[project.status]}>
                        {STATUS_LABEL[project.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ProgressCell percent={project.progressPercent} />
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

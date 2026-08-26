import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortalProject } from "../../hooks/usePortal";
import type { PortalSession } from "../../types";

interface PortalProjectDetailViewProps {
  readonly session: PortalSession;
}

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_CURSO: "En curso",
  PAUSADA: "Pausada",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
};

const TASK_STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En proceso",
  TERMINADA: "Terminada",
  ATRASADA: "Atrasada",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-AR");
}

export function PortalProjectDetailView({ session }: Readonly<PortalProjectDetailViewProps>) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const projectId = id ? Number.parseInt(id, 10) : null;
  const { data, isLoading, error } = usePortalProject(session.sessionToken, projectId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <Button variant="ghost" onClick={() => navigate("/portal")}>
          <ArrowLeft className="size-4" /> Volver
        </Button>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <Button variant="ghost" onClick={() => navigate("/portal")}>
          <ArrowLeft className="size-4" /> Volver
        </Button>
        <p className="text-sm text-destructive">
          {error ?? "No se encontró la obra."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate("/portal")}>
        <ArrowLeft className="size-4" /> Volver
      </Button>

      <Card surface="solid" padding="none" className="!rounded-2xl !p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="outline">{STATUS_LABELS[data.status] ?? data.status}</Badge>
            <h1 className="text-2xl font-bold mt-2">{data.name}</h1>
            {data.address && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="size-3" /> {data.address}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs uppercase text-muted-foreground">Avance</p>
            <p className="text-4xl font-black tabular-nums">{data.progressPercent}%</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" /> Inicio: <strong className="text-foreground">{formatDate(data.startedAt ?? data.estimatedStart)}</strong>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" /> Fin: <strong className="text-foreground">{formatDate(data.finishedAt ?? data.estimatedEnd)}</strong>
          </div>
        </div>
      </Card>

      {data.description && (
        <Card surface="glass" padding="md">
          <CardHeader>
            <CardTitle className="text-base">Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{data.description}</p>
          </CardContent>
        </Card>
      )}

      <Card surface="glass" padding="md">
        <CardHeader>
          <CardTitle className="text-base">Tareas</CardTitle>
        </CardHeader>
        <CardContent>
          {data.tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin tareas registradas.</p>
          ) : (
            <ul className="space-y-2">
              {data.tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 p-3"
                >
                  <p className="text-sm font-medium">{task.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {TASK_STATUS_LABELS[task.status] ?? task.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {task.progress}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

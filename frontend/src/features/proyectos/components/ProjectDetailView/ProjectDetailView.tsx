import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProject } from "../../hooks/useProject";
import { STATUS_LABEL, STATUS_VARIANT } from "../../presentation";
import { ProjectTeamSection } from "../ProjectTeamSection/ProjectTeamSection";

interface ProjectDetailViewProps {
  readonly projectId: number;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-AR");
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export function ProjectDetailView({ projectId }: Readonly<ProjectDetailViewProps>) {
  const navigate = useNavigate();
  const { data, isLoading, error } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/proyectos")}>
          <ArrowLeft className="size-4" /> Volver
        </Button>
        <DetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/proyectos")}>
          <ArrowLeft className="size-4" /> Volver
        </Button>
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/proyectos")}
            className="-ml-3 mb-1"
          >
            <ArrowLeft className="size-4" /> Volver
          </Button>
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={STATUS_VARIANT[data.status]}>
              {STATUS_LABEL[data.status]}
            </Badge>
            <span>·</span>
            <span className="capitalize">{data.type.replace(/_/g, " ").toLowerCase()}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase text-muted-foreground">Avance</p>
          <p className="text-3xl font-black tabular-nums">{data.progressPercent}%</p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">General</TabsTrigger>
          <TabsTrigger value="team">Equipo</TabsTrigger>
          <TabsTrigger value="tasks">Tareas</TabsTrigger>
          <TabsTrigger value="budget">Presupuesto</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card surface="glass" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Información de la obra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="size-4" />
                  <span>
                    Cliente: <strong className="text-foreground">{data.client.name}</strong>
                  </span>
                </div>
                {data.address && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4" />
                    <span>{data.address}</span>
                  </div>
                )}
                {data.estimatedStart && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-4" />
                    <span>Inicio: {formatDate(data.estimatedStart)}</span>
                  </div>
                )}
                {data.estimatedEnd && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-4" />
                    <span>Fin: {formatDate(data.estimatedEnd)}</span>
                  </div>
                )}
              </div>
              <Separator />
              {data.description ? (
                <p className="text-foreground whitespace-pre-line">
                  {data.description}
                </p>
              ) : (
                <p className="text-muted-foreground italic">Sin descripción.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <ProjectTeamSection projectId={data.id} />
        </TabsContent>

        <TabsContent value="tasks">
          <Card surface="glass" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Tareas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                La gestión de tareas se conectará a este proyecto desde el módulo
                <strong> Tareas</strong>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card surface="glass" padding="md">
            <CardHeader>
              <CardTitle className="text-base">Presupuesto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Los presupuestos asociados a esta obra se administran desde el módulo
                <strong> Presupuestos</strong>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

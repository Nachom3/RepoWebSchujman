import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClient } from "../../hooks/useClient";
import { ClientDetailErrorState } from "./ClientDetailErrorState";
import { ClientDetailHeader } from "./ClientDetailHeader";
import { ClientDetailSkeleton } from "./ClientDetailSkeleton";
import { ClientOverviewTab } from "./ClientOverviewTab";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClientDetailProps } from "./ClientDetail.types";

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_CURSO: "En curso",
  PAUSADA: "Pausada",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
};

export function ClientDetail({ clientId }: ClientDetailProps) {
  const navigate = useNavigate();
  const { data: client, isLoading, error } = useClient(clientId);

  if (isLoading) {
    return <ClientDetailSkeleton />;
  }

  if (error) {
    return (
      <ClientDetailErrorState
        title="No pudimos cargar el cliente"
        description={error}
        onBack={() => navigate("/clientes")}
      />
    );
  }

  if (!client) {
    return (
      <ClientDetailErrorState
        title="Cliente no encontrado"
        description="El cliente que buscás no existe o fue eliminado."
        onBack={() => navigate("/clientes")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ClientDetailHeader
        client={client}
        onBack={() => navigate("/clientes")}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="projects">Obras</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ClientOverviewTab client={client} />
        </TabsContent>

        <TabsContent value="projects">
          <Card surface="glass" padding="none">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-base">Obras del cliente</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {client.projects.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  Este cliente aún no tiene obras cargadas.
                </p>
              ) : (
                <ul className="space-y-2">
                  {client.projects.map((project) => (
                    <li
                      key={project.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 p-3 cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/proyectos/${project.id}`)}
                    >
                      <p className="font-medium">{project.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {STATUS_LABELS[project.status] ?? project.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {project.progressPercent}%
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

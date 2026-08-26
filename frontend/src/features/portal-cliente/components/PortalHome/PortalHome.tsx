import { useNavigate } from "react-router-dom";
import { Building2, FileText, ArrowRight, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { portalLogout } from "../../services/portalService";
import { usePortalPayments, usePortalProjects } from "../../hooks/usePortal";
import type { PortalSession } from "../../types";

interface PortalHomeProps {
  readonly session: PortalSession;
  readonly onLogout: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_CURSO: "En curso",
  PAUSADA: "Pausada",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PortalHome({ session, onLogout }: Readonly<PortalHomeProps>) {
  const navigate = useNavigate();
  const { data: projects, isLoading: loadingProjects } = usePortalProjects(session.sessionToken);
  const { data: payments } = usePortalPayments(session.sessionToken);

  async function handleLogout() {
    await portalLogout(session.sessionToken);
    onLogout();
  }

  const totalCobros = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card surface="solid" padding="none" className="!rounded-2xl !p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary font-semibold">
              Portal del Cliente
            </p>
            <h1 className="text-2xl font-bold mt-1">{session.client.name}</h1>
            <p className="text-sm text-muted-foreground">
              {session.client.taxId ?? `Cliente #${session.client.id}`}
            </p>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="size-4" /> Cerrar sesión
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card surface="glass" padding="md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Obras</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{projects.length}</p>
          </CardContent>
        </Card>
        <Card surface="glass" padding="md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pagos realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{formatCurrency(totalCobros)}</p>
          </CardContent>
        </Card>
        <Card surface="glass" padding="md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{payments.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card surface="glass" padding="none">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-lg">Mis obras</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {loadingProjects ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No tenés obras activas por el momento.
            </p>
          ) : (
            <ul className="space-y-2">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="size-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.address ?? "Sin dirección"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {STATUS_LABELS[project.status] ?? project.status}
                    </Badge>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {project.progressPercent}%
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/portal/obras/${project.id}`)}
                    >
                      Ver <ArrowRight className="size-3" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {payments.length > 0 && (
        <Card surface="glass" padding="none">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="size-4" /> Últimos pagos
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <ul className="space-y-2">
              {payments.slice(0, 5).map((payment) => (
                <li
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 p-3 text-sm"
                >
                  <span className="text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString("es-AR")}
                  </span>
                  <span className="font-bold tabular-nums">
                    {formatCurrency(payment.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

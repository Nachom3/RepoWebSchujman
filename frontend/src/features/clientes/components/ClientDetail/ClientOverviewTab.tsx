import {
  Building2,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClientInfoField } from "./ClientInfoField";
import { ClientStatusBadge } from "./ClientStatusBadge";
import type { ClientDetail } from "../../types";

interface ClientOverviewTabProps {
  client: ClientDetail;
}

export function ClientOverviewTab({ client }: ClientOverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card surface="glass" padding="md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="size-4" />
              Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientStatusBadge status={client.status} />
          </CardContent>
        </Card>

        <Card surface="glass" padding="md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="size-4" />
              Obras asociadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">{client.projects.length}</p>
          </CardContent>
        </Card>

        <Card surface="glass" padding="md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="size-4" />
              Contacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {client.contactName ?? <span className="text-muted-foreground">Sin contacto</span>}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card surface="glass" padding="md">
        <CardHeader>
          <CardTitle>Información del cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientInfoField
            icon={<FileText className="size-4" />}
            label="CUIT/DNI"
            value={<span className="font-mono">{client.taxId ?? "Sin especificar"}</span>}
          />
          <Separator />
          <ClientInfoField
            icon={<Building2 className="size-4" />}
            label="Nombre"
            value={client.name}
          />
          <Separator />
          <ClientInfoField
            icon={<MapPin className="size-4" />}
            label="Dirección"
            value={client.address ?? "Sin dirección"}
          />
          <Separator />
          <ClientInfoField
            icon={<Phone className="size-4" />}
            label="Teléfono"
            value={client.phone ?? "Sin teléfono"}
          />
          <Separator />
          <ClientInfoField
            icon={<Mail className="size-4" />}
            label="Email"
            value={client.email ?? "Sin email"}
          />
          <Separator />
          <ClientInfoField
            icon={<User className="size-4" />}
            label="Contacto"
            value={client.contactName ?? "Sin contacto"}
          />
        </CardContent>
      </Card>

      {client.notes && (
        <Card surface="glass" padding="md">
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{client.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card surface="glass" padding="md">
        <CardHeader>
          <CardTitle>Resumen rápido</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="secondary">{client.projects.length} obras</Badge>
          {client.email ? <Badge variant="outline">Email registrado</Badge> : null}
          {client.phone ? <Badge variant="outline">Teléfono registrado</Badge> : null}
        </CardContent>
      </Card>
    </div>
  );
}

import { ArrowLeft, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientStatusBadge } from "./ClientStatusBadge";
import type { ClientDetail } from "../../types";

interface ClientDetailHeaderProps {
  client: ClientDetail;
  onBack: () => void;
}

export function ClientDetailHeader({ client, onBack }: ClientDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Volver a clientes">
          <ArrowLeft className="size-5" />
        </Button>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <UserRound className="size-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
            <ClientStatusBadge status={client.status} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {client.taxId && <span className="font-mono">{client.taxId}</span>}
            {client.email && <span>{client.email}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

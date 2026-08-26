import { Badge } from "@/components/ui/badge";
import { getClientStatusBadgeVariant, getClientStatusLabel } from "../../presentation";
import type { ClientStatus } from "../../types";

interface ClientStatusBadgeProps {
  status: ClientStatus;
}

export function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  return <Badge variant={getClientStatusBadgeVariant(status)}>{getClientStatusLabel(status)}</Badge>;
}

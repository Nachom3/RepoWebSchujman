import type { ClientStatus } from "../../types";

export interface ClientListProps {
  statusFilter?: ClientStatus;
  onStatusFilterChange?: (status: ClientStatus | undefined) => void;
}
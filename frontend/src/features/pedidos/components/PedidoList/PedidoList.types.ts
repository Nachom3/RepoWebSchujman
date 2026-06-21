import type { Order } from "../../types";

export interface PedidoListProps {
  statusFilter?: string;
  onStatusFilterChange?: (status: string | undefined) => void;
}

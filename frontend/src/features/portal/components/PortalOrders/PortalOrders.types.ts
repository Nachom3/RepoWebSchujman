import type { PortalOrder } from "../../types";

export interface PortalOrdersProps {
  orders: PortalOrder[];
  isLoading: boolean;
  error: string | null;
  onTrack: (orderId: number) => void;
  onNewOrder: () => void;
  onLogout: () => void;
}

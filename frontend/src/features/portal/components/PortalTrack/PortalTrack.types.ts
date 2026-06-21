import type { PortalOrderDetail } from "../../types";

export interface PortalTrackProps {
  order: PortalOrderDetail | null;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
}

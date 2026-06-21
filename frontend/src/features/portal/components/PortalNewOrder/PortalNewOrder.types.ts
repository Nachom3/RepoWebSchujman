import type { PortalCreateOrderFormData } from "../../types";

export interface PortalNewOrderProps {
  onSubmit: (data: PortalCreateOrderFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
}

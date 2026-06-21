import type { PortalLoginFormData } from "../../types";

export interface PortalLoginProps {
  onLogin: (sessionToken: string, client: { id: number; razonSocial: string; cuit: string }) => void;
}

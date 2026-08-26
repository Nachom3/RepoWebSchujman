import { Navigate, useLocation } from "react-router-dom";
import { usePortalSession } from "./PortalContext";
import type { ReactNode } from "react";

export function PortalGate({ children }: { readonly children: ReactNode }) {
  const { isAuthenticated } = usePortalSession();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

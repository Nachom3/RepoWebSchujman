import { Navigate } from "react-router-dom";
import { usePortalSession } from "../../hooks/usePortalSession";
import type { PortalGateProps } from "./PortalGate.types";

const PORTAL_STORAGE_KEY = "portal_session";

function hasPortalSession(): boolean {
  try {
    const raw = localStorage.getItem(PORTAL_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return typeof parsed?.sessionToken === "string";
  } catch {
    return false;
  }
}

export function PortalGate({ children }: Readonly<PortalGateProps>) {
  const { isAuthenticated } = usePortalSession();

  if (!isAuthenticated && !hasPortalSession()) {
    return <Navigate to="/portal/login" replace />;
  }

  return children;
}

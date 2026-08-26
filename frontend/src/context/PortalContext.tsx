import { createContext, useContext, useState, type ReactNode } from "react";
import type { PortalSession } from "@/features/portal-cliente";

const STORAGE_KEY = "portal-session";

interface PortalContextValue {
  readonly isAuthenticated: boolean;
  readonly session: PortalSession | null;
  readonly login: (session: PortalSession) => void;
  readonly logout: () => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

function readStoredSession(): PortalSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PortalSession;
    if (!parsed?.sessionToken || !parsed?.client) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function PortalProvider({ children }: { readonly children: ReactNode }) {
  const [session, setSession] = useState<PortalSession | null>(() => readStoredSession());

  function login(next: PortalSession) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  return (
    <PortalContext.Provider
      value={{
        isAuthenticated: session !== null,
        session,
        login,
        logout,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortalSession(): PortalContextValue {
  const ctx = useContext(PortalContext);
  if (!ctx) {
    throw new Error("usePortalSession must be used within a PortalProvider");
  }
  return ctx;
}

import { useState, useCallback } from "react";
import type { PortalClient } from "../types";

const STORAGE_KEY = "portal_session";

interface StoredSession {
  sessionToken: string;
  client: PortalClient;
}

function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function usePortalSession() {
  const [session, setSession] = useState<StoredSession | null>(readSession);

  const login = useCallback((sessionToken: string, client: PortalClient) => {
    const data: StoredSession = { sessionToken, client };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSession(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  return {
    sessionToken: session?.sessionToken ?? null,
    client: session?.client ?? null,
    isAuthenticated: session !== null,
    login,
    logout,
  };
}

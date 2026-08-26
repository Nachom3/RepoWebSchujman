import type {
  PortalPayment,
  PortalProject,
  PortalProjectDetail,
  PortalSession,
} from "../types";
import { API_BASE } from "@/lib/api";

const PORTAL_API = `${API_BASE}/portal`;

function portalHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-portal-token": token,
  };
}

async function portalFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${PORTAL_API}${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Portal request failed" }));
    throw new Error(body.error ?? "Portal request failed");
  }
  return res.json() as Promise<T>;
}

export async function portalLogin(identifier: string): Promise<PortalSession> {
  return portalFetch<PortalSession>("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier }),
  });
}

export async function portalLogout(token: string): Promise<void> {
  await fetch(`${PORTAL_API}/logout`, {
    method: "POST",
    headers: portalHeaders(token),
  });
}

export async function listPortalProjects(token: string): Promise<PortalProject[]> {
  return portalFetch<PortalProject[]>("/projects", {
    headers: portalHeaders(token),
  });
}

export async function getPortalProject(
  token: string,
  projectId: number,
): Promise<PortalProjectDetail> {
  return portalFetch<PortalProjectDetail>(`/projects/${projectId}`, {
    headers: portalHeaders(token),
  });
}

export async function listPortalPayments(token: string): Promise<PortalPayment[]> {
  return portalFetch<PortalPayment[]>("/payments", {
    headers: portalHeaders(token),
  });
}

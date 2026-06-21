import type {
  PortalSession,
  PortalOrder,
  PortalOrderDetail,
  PortalCreateOrderFormData,
} from "../types";

const PORTAL_API = "/api/portal";

function portalHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-portal-token": token,
  };
}

export async function portalLogin(cuit: string): Promise<PortalSession> {
  const res = await fetch(`${PORTAL_API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cuit }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Login failed" }));
    throw new Error(body.error ?? "Login failed");
  }
  return res.json();
}

export async function portalLogout(token: string): Promise<void> {
  await fetch(`${PORTAL_API}/logout`, {
    method: "POST",
    headers: portalHeaders(token),
  });
}

export async function createPortalOrder(
  token: string,
  payload: PortalCreateOrderFormData,
): Promise<PortalOrder> {
  const res = await fetch(`${PORTAL_API}/orders`, {
    method: "POST",
    headers: portalHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Order creation failed" }));
    throw new Error(body.error ?? "Order creation failed");
  }
  return res.json();
}

export async function listPortalOrders(token: string): Promise<PortalOrder[]> {
  const res = await fetch(`${PORTAL_API}/orders`, {
    method: "GET",
    headers: portalHeaders(token),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Failed to load orders" }));
    throw new Error(body.error ?? "Failed to load orders");
  }
  return res.json();
}

export async function getPortalOrder(
  token: string,
  orderId: number,
): Promise<PortalOrderDetail> {
  const res = await fetch(`${PORTAL_API}/orders/${orderId}`, {
    method: "GET",
    headers: portalHeaders(token),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Order not found" }));
    throw new Error(body.error ?? "Order not found");
  }
  return res.json();
}

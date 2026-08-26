import type { ClientStatus } from "./types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function getClientStatusLabel(status: ClientStatus) {
  return status === "ACTIVE" ? "Activo" : "Baja";
}

export function getClientStatusBadgeVariant(status: ClientStatus) {
  return status === "ACTIVE" ? "default" : "destructive";
}

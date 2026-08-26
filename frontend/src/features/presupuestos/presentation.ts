import type { BudgetStatus } from "./types";

export const STATUS_LABEL: Record<BudgetStatus, string> = {
  BORRADOR: "Borrador",
  ENVIADO: "Enviado",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
  VENCIDO: "Vencido",
};

export const STATUS_VARIANT: Record<
  BudgetStatus,
  "outline" | "secondary" | "default" | "destructive"
> = {
  BORRADOR: "outline",
  ENVIADO: "secondary",
  APROBADO: "default",
  RECHAZADO: "destructive",
  VENCIDO: "destructive",
};

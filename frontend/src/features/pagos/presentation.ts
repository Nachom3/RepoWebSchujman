import type { PaymentMethod, PaymentType } from "./types";

export const TYPE_LABEL: Record<PaymentType, string> = {
  COBRO: "Cobro",
  GASTO: "Gasto",
};

export const TYPE_VARIANT: Record<
  PaymentType,
  "default" | "destructive" | "outline" | "secondary"
> = {
  COBRO: "default",
  GASTO: "destructive",
};

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
  CHEQUE: "Cheque",
  TARJETA: "Tarjeta",
  OTRO: "Otro",
};

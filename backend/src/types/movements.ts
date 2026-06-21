import type { CuentaCorrienteMovimiento } from "@prisma/client";

export type CreateMovementDto = {
  tipo: "DEBITO" | "CREDITO";
  monto: number;
  referencia?: string;
};

export type MovementResponse = Pick<
  CuentaCorrienteMovimiento,
  "id" | "tipo" | "monto" | "fecha" | "referencia" | "clientId"
>;

export type MovementListResponse = MovementResponse[];
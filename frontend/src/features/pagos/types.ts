import { z } from "zod";

export type PaymentType = "COBRO" | "GASTO";
export type PaymentMethod =
  | "EFECTIVO"
  | "TRANSFERENCIA"
  | "CHEQUE"
  | "TARJETA"
  | "OTRO";

export interface Payment {
  id: number;
  type: PaymentType;
  method: PaymentMethod;
  amount: number;
  date: string;
  reference: string | null;
  notes: string | null;
  clientId: number | null;
  projectId: number | null;
  createdAt: string;
}

export const createPaymentSchema = z.object({
  type: z.enum(["COBRO", "GASTO"]),
  method: z
    .enum(["EFECTIVO", "TRANSFERENCIA", "CHEQUE", "TARJETA", "OTRO"])
    .optional(),
  amount: z.number().positive("Amount must be greater than 0"),
  date: z.string().optional(),
  reference: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  clientId: z.number().int().positive().optional(),
  projectId: z.number().int().positive().optional(),
});

export type CreatePaymentFormData = z.infer<typeof createPaymentSchema>;

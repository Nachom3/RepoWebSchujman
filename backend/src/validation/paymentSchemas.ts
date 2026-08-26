import { z } from "zod";

const paymentType = z.enum(["COBRO", "GASTO"]);
const paymentMethod = z.enum(["EFECTIVO", "TRANSFERENCIA", "CHEQUE", "TARJETA", "OTRO"]);

const dateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const createPaymentBodySchema = z.object({
  type: paymentType,
  method: paymentMethod.optional(),
  amount: z.number().positive("Amount must be greater than 0"),
  date: dateField,
  reference: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  clientId: z.number().int().positive().optional(),
  projectId: z.number().int().positive().optional(),
});

export const updatePaymentBodySchema = z.object({
  type: paymentType.optional(),
  method: paymentMethod.optional(),
  amount: z.number().positive().optional(),
  date: dateField,
  reference: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  clientId: z.number().int().positive().nullable().optional(),
  projectId: z.number().int().positive().nullable().optional(),
});

export const listPaymentsQuerySchema = z.object({
  type: paymentType.optional(),
  clientId: z.coerce.number().int().positive().optional(),
  projectId: z.coerce.number().int().positive().optional(),
});

export type CreatePaymentBody = z.infer<typeof createPaymentBodySchema>;
export type UpdatePaymentBody = z.infer<typeof updatePaymentBodySchema>;
export type ListPaymentsQuery = z.infer<typeof listPaymentsQuerySchema>;

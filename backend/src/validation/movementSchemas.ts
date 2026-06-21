import { z } from "zod";

export const createMovementBodySchema = z.object({
  tipo: z.enum(["DEBITO", "CREDITO"]),
  monto: z.number().positive("Monto must be greater than 0"),
  referencia: z.string().trim().optional(),
});

export type CreateMovementBody = z.infer<typeof createMovementBodySchema>;
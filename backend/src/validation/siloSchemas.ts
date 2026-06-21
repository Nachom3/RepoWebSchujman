import { z } from "zod";

export const createSiloBodySchema = z.object({
  material: z.string().trim().min(1, "Material name is required"),
  quantity: z.number().min(0, "Quantity must be >= 0"),
  unit: z.string().trim().min(1, "Unit is required"),
  alertMin: z.number().min(0).default(0),
});

export const updateSiloBodySchema = z.object({
  material: z.string().trim().min(1).optional(),
  quantity: z.number().min(0).optional(),
  unit: z.string().trim().min(1).optional(),
  alertMin: z.number().min(0).optional(),
});

export type CreateSiloBody = z.infer<typeof createSiloBodySchema>;
export type UpdateSiloBody = z.infer<typeof updateSiloBodySchema>;

import { z } from "zod";

export const createFormulaBodySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  recipe: z.string().trim().optional(),
  pricePerCubicMeter: z.number().positive("Price must be greater than 0"),
});

export const updateFormulaBodySchema = z.object({
  name: z.string().trim().min(1).optional(),
  recipe: z.string().trim().optional(),
  pricePerCubicMeter: z.number().positive().optional(),
});

export const addMaterialBodySchema = z.object({
  siloStockId: z.number().int().positive(),
  kgPerCubicMeter: z.number().positive("kgPerCubicMeter must be greater than 0"),
});

export type CreateFormulaBody = z.infer<typeof createFormulaBodySchema>;
export type UpdateFormulaBody = z.infer<typeof updateFormulaBodySchema>;
export type AddMaterialBody = z.infer<typeof addMaterialBodySchema>;

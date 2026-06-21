import { z } from "zod";

export interface Formula {
  id: number;
  name: string;
  recipe: string | null;
  pricePerCubicMeter: number;
}

export interface FormulaMaterial {
  id: number;
  formulaId: number;
  siloStockId: number;
  kgPerCubicMeter: number;
}

export interface FormulaDetail extends Formula {
  materials: (FormulaMaterial & {
    siloStock: { id: number; material: string; unit: string };
  })[];
}

export interface SiloStock {
  id: number;
  material: string;
  quantity: number;
  unit: string;
  alertMin: number;
  isLow: boolean;
}

export const createFormulaSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  recipe: z.string().trim().optional(),
  pricePerCubicMeter: z.number().positive("Price must be greater than 0"),
});

export const updateFormulaSchema = z.object({
  name: z.string().trim().min(1).optional(),
  recipe: z.string().trim().optional(),
  pricePerCubicMeter: z.number().positive().optional(),
});

export const createSiloSchema = z.object({
  material: z.string().trim().min(1, "Material name is required"),
  quantity: z.number().min(0, "Quantity must be >= 0"),
  unit: z.string().trim().min(1, "Unit is required"),
  alertMin: z.number().min(0).default(0),
});

export const updateSiloSchema = z.object({
  material: z.string().trim().min(1).optional(),
  quantity: z.number().min(0).optional(),
  unit: z.string().trim().min(1).optional(),
  alertMin: z.number().min(0).optional(),
});

export type CreateFormulaFormData = z.infer<typeof createFormulaSchema>;
export type UpdateFormulaFormData = z.infer<typeof updateFormulaSchema>;
export type CreateSiloFormData = z.infer<typeof createSiloSchema>;
export type UpdateSiloFormData = z.infer<typeof updateSiloSchema>;

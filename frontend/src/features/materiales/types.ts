import { z } from "zod";

export type MaterialUnit =
  | "KG"
  | "TN"
  | "M3"
  | "LT"
  | "UNIDAD"
  | "BOLSA"
  | "M2"
  | "ML"
  | "OTRO";

export type MaterialCategory =
  | "Estructural"
  | "Mampostería"
  | "Sanitario"
  | "Eléctrico"
  | "Pintura"
  | "Herrería"
  | "Pisos y revestimientos"
  | "Aberturas"
  | "Cubiertas"
  | "Otro";

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  "Estructural",
  "Mampostería",
  "Sanitario",
  "Eléctrico",
  "Pintura",
  "Herrería",
  "Pisos y revestimientos",
  "Aberturas",
  "Cubiertas",
  "Otro",
];

export interface Material {
  id: number;
  name: string;
  category: string | null;
  unit: MaterialUnit;
  stock: number;
  alertMin: number;
  minStock: number;
  unitCost: number;
  location: string | null;
  supplierId: number | null;
  notes: string | null;
  isLow: boolean;
  supplier: {
    id: number;
    name: string;
  } | null;
}

export interface MaterialSupplierOption {
  id: number;
  name: string;
}

const trimmedOptional = z
  .string()
  .trim()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const createMaterialSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  category: trimmedOptional,
  unit: z
    .enum(["KG", "TN", "M3", "LT", "UNIDAD", "BOLSA", "M2", "ML", "OTRO"])
    .optional(),
  stock: z.number().min(0).optional(),
  alertMin: z.number().min(0).optional(),
  minStock: z.number().min(0).optional(),
  unitCost: z.number().min(0).optional(),
  location: trimmedOptional,
  supplierId: z.number().int().positive().nullable().optional(),
  notes: trimmedOptional,
});

export const updateMaterialSchema = createMaterialSchema.partial();

export type CreateMaterialFormData = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialFormData = z.infer<typeof updateMaterialSchema>;

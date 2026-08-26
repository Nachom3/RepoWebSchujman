import { z } from "zod";

const materialUnit = z.enum([
  "KG",
  "TN",
  "M3",
  "LT",
  "UNIDAD",
  "BOLSA",
  "M2",
  "ML",
  "OTRO",
]);

const optionalNumber = z
  .preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }
    return value;
  }, z.number().min(0).optional());

const optionalNullableNumber = z
  .preprocess((value) => {
    if (value === "" || value === null || value === undefined) return null;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }
    return value;
  }, z.number().int().positive().nullable().optional());

const trimmedString = z
  .string()
  .trim()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const createMaterialBodySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  category: trimmedString,
  unit: materialUnit.optional(),
  stock: optionalNumber,
  alertMin: optionalNumber,
  minStock: optionalNumber,
  unitCost: optionalNumber,
  location: trimmedString,
  supplierId: optionalNullableNumber,
  notes: trimmedString,
});

export const updateMaterialBodySchema = createMaterialBodySchema.partial();

export type CreateMaterialBody = z.infer<typeof createMaterialBodySchema>;
export type UpdateMaterialBody = z.infer<typeof updateMaterialBodySchema>;

import { z } from "zod";

const budgetStatus = z.enum([
  "BORRADOR",
  "ENVIADO",
  "APROBADO",
  "RECHAZADO",
  "VENCIDO",
]);

const budgetItemSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  category: z.string().trim().min(1, "Category is required"),
  quantity: z.number().positive("Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Unit price must be >= 0"),
  total: z.number().min(0),
});

const dateField = z
  .string()
  .datetime()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const createBudgetBodySchema = z.object({
  projectId: z.number().int().positive(),
  status: budgetStatus.optional(),
  notes: z.string().trim().optional(),
  expiresAt: dateField,
  items: z.array(budgetItemSchema).optional(),
});

export const updateBudgetBodySchema = z.object({
  status: budgetStatus.optional(),
  notes: z.string().trim().optional(),
  expiresAt: dateField,
  items: z.array(budgetItemSchema).optional(),
});

export const listBudgetsQuerySchema = z.object({
  projectId: z.coerce.number().int().positive().optional(),
  status: budgetStatus.optional(),
});

export type CreateBudgetBody = z.infer<typeof createBudgetBodySchema>;
export type UpdateBudgetBody = z.infer<typeof updateBudgetBodySchema>;
export type ListBudgetsQuery = z.infer<typeof listBudgetsQuerySchema>;

import { z } from "zod";

export type BudgetStatus =
  | "BORRADOR"
  | "ENVIADO"
  | "APROBADO"
  | "RECHAZADO"
  | "VENCIDO";

export interface BudgetItem {
  id: number;
  budgetId: number;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Budget {
  id: number;
  projectId: number;
  status: BudgetStatus;
  total: number;
  notes: string | null;
  approvedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: BudgetItem[];
}

export const BUDGET_CATEGORIES = [
  "MATERIAL",
  "MANO_OBRA",
  "SERVICIO",
  "MAQUINARIA",
  "TRANSPORTE",
  "OTRO",
] as const;

export type BudgetCategory = (typeof BUDGET_CATEGORIES)[number];

export const createBudgetSchema = z.object({
  projectId: z.number().int().positive(),
  status: z
    .enum(["BORRADOR", "ENVIADO", "APROBADO", "RECHAZADO", "VENCIDO"])
    .optional(),
  notes: z.string().trim().optional(),
  items: z
    .array(
      z.object({
        description: z.string().trim().min(1),
        category: z.string().trim().min(1),
        quantity: z.number().positive(),
        unitPrice: z.number().min(0),
      }),
    )
    .optional(),
});

export type CreateBudgetFormData = z.infer<typeof createBudgetSchema>;

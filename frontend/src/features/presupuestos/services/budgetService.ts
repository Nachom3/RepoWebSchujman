import { api } from "@/lib/api";
import type { Budget } from "../types";

export async function getBudgets(params?: { projectId?: number }): Promise<Budget[]> {
  const { data } = await api.get<Budget[]>("/budgets", { params });
  return data;
}

export async function getBudgetById(id: number): Promise<Budget> {
  const { data } = await api.get<Budget>(`/budgets/${id}`);
  return data;
}

export async function createBudget(payload: {
  projectId: number;
  status?: string;
  notes?: string;
  items?: Array<{
    description: string;
    category: string;
    quantity: number;
    unitPrice: number;
  }>;
}): Promise<Budget> {
  const items = payload.items?.map((item) => ({
    ...item,
    total: Number((item.quantity * item.unitPrice).toFixed(2)),
  }));

  const { data } = await api.post<Budget>("/budgets", {
    ...payload,
    items,
  });
  return data;
}

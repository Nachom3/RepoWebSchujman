import { api } from "@/lib/api";
import type { Payment } from "../types";

export async function getPayments(params?: {
  type?: "COBRO" | "GASTO";
  clientId?: number;
  projectId?: number;
}): Promise<Payment[]> {
  const { data } = await api.get<Payment[]>("/payments", { params });
  return data;
}

export async function createPayment(payload: {
  type: "COBRO" | "GASTO";
  method?: string;
  amount: number;
  date?: string;
  reference?: string;
  notes?: string;
  clientId?: number;
  projectId?: number;
}): Promise<Payment> {
  const { data } = await api.post<Payment>("/payments", payload);
  return data;
}

import { api } from "@/lib/api";
import type { SiloStock } from "../types";

export async function getSilos(): Promise<SiloStock[]> {
  const { data } = await api.get<SiloStock[]>("/silos");
  return data;
}

export async function getSiloById(id: number): Promise<SiloStock> {
  const { data } = await api.get<SiloStock>(`/silos/${id}`);
  return data;
}

export async function createSilo(payload: {
  material: string;
  quantity: number;
  unit: string;
  alertMin?: number;
}): Promise<SiloStock> {
  const { data } = await api.post<SiloStock>("/silos", payload);
  return data;
}

export async function updateSilo(
  id: number,
  payload: Partial<{ material: string; quantity: number; unit: string; alertMin: number }>,
): Promise<SiloStock> {
  const { data } = await api.patch<SiloStock>(`/silos/${id}`, payload);
  return data;
}

export async function deleteSilo(id: number): Promise<SiloStock> {
  const { data } = await api.delete<SiloStock>(`/silos/${id}`);
  return data;
}

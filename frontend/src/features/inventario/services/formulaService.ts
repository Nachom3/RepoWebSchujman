import { api } from "@/lib/api";
import type { Formula, FormulaDetail } from "../types";

export async function getFormulas(): Promise<Formula[]> {
  const { data } = await api.get<Formula[]>("/formulas");
  return data;
}

export async function getFormulaById(id: number): Promise<FormulaDetail> {
  const { data } = await api.get<FormulaDetail>(`/formulas/${id}`);
  return data;
}

export async function createFormula(payload: {
  name: string;
  recipe?: string;
  pricePerCubicMeter: number;
}): Promise<FormulaDetail> {
  const { data } = await api.post<FormulaDetail>("/formulas", payload);
  return data;
}

export async function updateFormula(
  id: number,
  payload: Partial<{ name: string; recipe: string; pricePerCubicMeter: number }>,
): Promise<FormulaDetail> {
  const { data } = await api.patch<FormulaDetail>(`/formulas/${id}`, payload);
  return data;
}

export async function deleteFormula(id: number): Promise<Formula> {
  const { data } = await api.delete<Formula>(`/formulas/${id}`);
  return data;
}

export async function addMaterial(
  formulaId: number,
  payload: { siloStockId: number; kgPerCubicMeter: number },
): Promise<unknown> {
  const { data } = await api.post(`/formulas/${formulaId}/materials`, payload);
  return data;
}

export async function removeMaterial(formulaId: number, materialId: number): Promise<void> {
  await api.delete(`/formulas/${formulaId}/materials/${materialId}`);
}

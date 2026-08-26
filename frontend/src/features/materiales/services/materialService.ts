import { api } from "@/lib/api";
import type { Material, MaterialSupplierOption } from "../types";

export async function getMaterials(): Promise<Material[]> {
  const { data } = await api.get<Material[]>("/materials");
  return data;
}

export async function getMaterialById(id: number): Promise<Material> {
  const { data } = await api.get<Material>(`/materials/${id}`);
  return data;
}

export async function createMaterial(payload: {
  name: string;
  category?: string;
  unit?: string;
  stock?: number;
  alertMin?: number;
  minStock?: number;
  unitCost?: number;
  location?: string;
  supplierId?: number | null;
  notes?: string;
}): Promise<Material> {
  const { data } = await api.post<Material>("/materials", payload);
  return data;
}

export async function updateMaterial(
  id: number,
  payload: Partial<{
    name: string;
    category: string;
    unit: string;
    stock: number;
    alertMin: number;
    minStock: number;
    unitCost: number;
    location: string;
    supplierId: number | null;
    notes: string;
  }>,
): Promise<Material> {
  const { data } = await api.patch<Material>(`/materials/${id}`, payload);
  return data;
}

export async function deleteMaterial(id: number): Promise<Material> {
  const { data } = await api.delete<Material>(`/materials/${id}`);
  return data;
}

export async function getSuppliersForSelect(): Promise<MaterialSupplierOption[]> {
  const { data } = await api.get<MaterialSupplierOption[]>("/suppliers");
  return data;
}

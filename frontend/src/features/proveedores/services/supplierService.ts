import { api } from "@/lib/api";
import type {
  CreateSupplierFormData,
  Supplier,
  UpdateSupplierFormData,
} from "../types";

export async function getSuppliers(): Promise<Supplier[]> {
  const { data } = await api.get<Supplier[]>("/suppliers");
  return data;
}

export async function getSupplierById(id: number): Promise<Supplier> {
  const { data } = await api.get<Supplier>(`/suppliers/${id}`);
  return data;
}

export async function createSupplier(
  payload: CreateSupplierFormData,
): Promise<Supplier> {
  const { data } = await api.post<Supplier>("/suppliers", payload);
  return data;
}

export async function updateSupplier(
  id: number,
  payload: UpdateSupplierFormData,
): Promise<Supplier> {
  const { data } = await api.patch<Supplier>(`/suppliers/${id}`, payload);
  return data;
}

export async function deleteSupplier(id: number): Promise<Supplier> {
  const { data } = await api.delete<Supplier>(`/suppliers/${id}`);
  return data;
}

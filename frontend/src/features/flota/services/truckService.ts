import { api } from "@/lib/api";
import type { Truck } from "../types";

export async function getTrucks(): Promise<Truck[]> {
  const { data } = await api.get<Truck[]>("/trucks");
  return data;
}

export async function getTruckById(id: number): Promise<Truck> {
  const { data } = await api.get<Truck>(`/trucks/${id}`);
  return data;
}

export async function createTruck(payload: {
  patente: string;
  capacity: number;
}): Promise<Truck> {
  const { data } = await api.post<Truck>("/trucks", payload);
  return data;
}

export async function updateTruck(
  id: number,
  payload: Partial<{ patente: string; capacity: number }>,
): Promise<Truck> {
  const { data } = await api.patch<Truck>(`/trucks/${id}`, payload);
  return data;
}

export async function toggleTruckStatus(id: number): Promise<Truck> {
  const { data } = await api.post<Truck>(`/trucks/${id}/toggle-status`);
  return data;
}

export async function deleteTruck(id: number): Promise<Truck> {
  const { data } = await api.delete<Truck>(`/trucks/${id}`);
  return data;
}

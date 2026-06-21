import { api } from "@/lib/api";
import type { Movement, MovementTipo } from "../types";

export async function createMovement(
  clientId: number,
  payload: { tipo: MovementTipo; monto: number; referencia?: string },
): Promise<Movement> {
  const { data } = await api.post<Movement>(`/clients/${clientId}/movements`, payload);
  return data;
}

export async function getMovements(clientId: number): Promise<Movement[]> {
  const { data } = await api.get<Movement[]>(`/clients/${clientId}/movements`);
  return data;
}
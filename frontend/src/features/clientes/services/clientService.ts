import { api } from "@/lib/api";
import type { Client, ClientDetail, ClientStatus } from "../types";

export async function getClients(status?: ClientStatus): Promise<Client[]> {
  const params = status ? { status } : undefined;
  const { data } = await api.get<Client[]>("/clients", { params });
  return data;
}

export async function getClientById(id: number): Promise<ClientDetail> {
  const { data } = await api.get<ClientDetail>(`/clients/${id}`);
  return data;
}

export async function createClient(
  payload: Omit<Client, "id" | "saldo" | "status" | "createdAt" | "updatedAt">,
): Promise<Client> {
  const { data } = await api.post<Client>("/clients", payload);
  return data;
}

export async function updateClient(
  id: number,
  payload: Partial<Omit<Client, "id" | "cuit" | "saldo" | "status" | "createdAt" | "updatedAt">>,
): Promise<Client> {
  const { data } = await api.patch<Client>(`/clients/${id}`, payload);
  return data;
}

export async function disableClient(id: number): Promise<Client> {
  const { data } = await api.delete<Client>(`/clients/${id}`);
  return data;
}
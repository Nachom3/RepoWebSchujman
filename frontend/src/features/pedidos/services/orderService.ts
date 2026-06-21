import { api } from "@/lib/api";
import type { Order, OrderDetail, OrderStatus } from "../types";

export async function getOrders(status?: OrderStatus, clientId?: number): Promise<Order[]> {
  const params: Record<string, unknown> = {};
  if (status) params.status = status;
  if (clientId) params.clientId = clientId;
  const { data } = await api.get<Order[]>("/orders", { params });
  return data;
}

export async function getOrderById(id: number): Promise<OrderDetail> {
  const { data } = await api.get<OrderDetail>(`/orders/${id}`);
  return data;
}

export async function createOrder(payload: {
  clientId: number;
  formulaId: number;
  quantity: number;
  deliveryDate?: string;
}): Promise<OrderDetail> {
  const { data } = await api.post<OrderDetail>("/orders", payload);
  return data;
}

export async function approveOrder(id: number): Promise<OrderDetail> {
  const { data } = await api.post<OrderDetail>(`/orders/${id}/approve`);
  return data;
}

export async function completeOrder(id: number): Promise<OrderDetail> {
  const { data } = await api.post<OrderDetail>(`/orders/${id}/complete`);
  return data;
}

export async function cancelOrder(id: number): Promise<Order> {
  const { data } = await api.delete<Order>(`/orders/${id}`);
  return data;
}

export async function assignTruck(orderId: number, truckId: number | null): Promise<OrderDetail> {
  const { data } = await api.patch<OrderDetail>(`/orders/${orderId}`, { truckId });
  return data;
}

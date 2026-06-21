import { z } from "zod";

export type OrderStatus = "PENDIENTE" | "APROBADA" | "COMPLETADA" | "CANCELADA";

export interface Order {
  id: number;
  clientId: number;
  formulaId: number;
  truckId: number | null;
  quantity: number;
  priceSnapshot: number | null;
  status: OrderStatus;
  createdAt: string;
  deliveryDate: string | null;
  completedAt: string | null;
}

export interface OrderDetail extends Order {
  client: { id: number; razonSocial: string; cuit: string };
  formula: { id: number; name: string; pricePerCubicMeter: number };
  truck: { id: number; patente: string; capacity: number } | null;
}

export const createOrderSchema = z.object({
  clientId: z.number().int().positive(),
  formulaId: z.number().int().positive(),
  quantity: z.number().positive("Quantity must be greater than 0"),
  deliveryDate: z.string().optional(),
});

export const updateOrderSchema = z.object({
  truckId: z.number().int().positive().nullable().optional(),
  deliveryDate: z.string().optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;

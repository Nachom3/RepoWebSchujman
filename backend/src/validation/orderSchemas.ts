import { z } from "zod";

export const createOrderBodySchema = z.object({
  clientId: z.number().int().positive(),
  formulaId: z.number().int().positive(),
  quantity: z.number().positive("Quantity must be greater than 0"),
  deliveryDate: z.string().datetime().optional(),
});

export const updateOrderBodySchema = z.object({
  truckId: z.number().int().positive().nullable().optional(),
  deliveryDate: z.string().datetime().optional(),
});

export const listOrdersQuerySchema = z.object({
  status: z.enum(["PENDIENTE", "APROBADA", "COMPLETADA", "CANCELADA"]).optional(),
  clientId: z.coerce.number().int().positive().optional(),
});

export type CreateOrderBody = z.infer<typeof createOrderBodySchema>;
export type UpdateOrderBody = z.infer<typeof updateOrderBodySchema>;
export type ListOrdersQuery = z.infer<typeof listOrdersQuerySchema>;

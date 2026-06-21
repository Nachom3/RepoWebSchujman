import { z } from "zod";

export const createTruckBodySchema = z.object({
  patente: z.string().trim().min(1, "Patente is required"),
  capacity: z.number().positive("Capacity must be greater than 0"),
});

export const updateTruckBodySchema = z.object({
  patente: z.string().trim().min(1).optional(),
  capacity: z.number().positive().optional(),
});

export type CreateTruckBody = z.infer<typeof createTruckBodySchema>;
export type UpdateTruckBody = z.infer<typeof updateTruckBodySchema>;

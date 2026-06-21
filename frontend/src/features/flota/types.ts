import { z } from "zod";

export type TruckStatus = "DISPONIBLE" | "EN_RECORRIDO";

export interface Truck {
  id: number;
  patente: string;
  capacity: number;
  status: TruckStatus;
}

export const createTruckSchema = z.object({
  patente: z.string().trim().min(1, "Patente is required"),
  capacity: z.number().positive("Capacity must be greater than 0"),
});

export const updateTruckSchema = z.object({
  patente: z.string().trim().min(1).optional(),
  capacity: z.number().positive().optional(),
});

export type CreateTruckFormData = z.infer<typeof createTruckSchema>;
export type UpdateTruckFormData = z.infer<typeof updateTruckSchema>;

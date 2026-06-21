import type { Truck } from "@prisma/client";

export type CreateTruckDto = {
  patente: string;
  capacity: number;
};

export type UpdateTruckDto = {
  patente?: string;
  capacity?: number;
};

export type TruckResponse = Pick<
  Truck,
  "id" | "patente" | "capacity" | "status"
>;

export type TruckListResponse = TruckResponse[];

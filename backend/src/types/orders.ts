import type { Order, Client, Formula, Truck } from "@prisma/client";

export type CreateOrderDto = {
  clientId: number;
  formulaId: number;
  quantity: number;
  deliveryDate?: string;
};

export type UpdateOrderDto = {
  truckId?: number | null;
  deliveryDate?: string;
};

export type OrderResponse = Pick<
  Order,
  "id" | "clientId" | "formulaId" | "truckId" | "quantity" | "priceSnapshot" | "status" | "createdAt" | "deliveryDate" | "completedAt"
>;

export type OrderDetailResponse = Order & {
  client: Pick<Client, "id" | "razonSocial" | "cuit">;
  formula: Pick<Formula, "id" | "name" | "pricePerCubicMeter">;
  truck: Pick<Truck, "id" | "patente" | "capacity"> | null;
};

export type OrderListResponse = OrderResponse[];

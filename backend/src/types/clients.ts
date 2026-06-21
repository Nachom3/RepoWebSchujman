import type { Client } from "@prisma/client";

export type CreateClientDto = {
  cuit: string;
  razonSocial: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  contacto?: string;
  condicionIVA?: string;
};

export type UpdateClientDto = Partial<Omit<CreateClientDto, "cuit">>;

export type ClientResponse = Pick<
  Client,
  | "id"
  | "cuit"
  | "razonSocial"
  | "saldo"
  | "status"
  | "createdAt"
  | "updatedAt"
>;

export type ClientListResponse = ClientResponse[];

export type ClientDetailResponse = Client & {
  movements: { id: number; tipo: string; monto: number; fecha: Date; referencia: string | null }[];
  orders: { id: number; quantity: number; status: string; deliveryDate: Date | null }[];
};
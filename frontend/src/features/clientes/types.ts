import { z } from "zod";

export type ClientStatus = "active" | "disabled";
export type MovementTipo = "DEBITO" | "CREDITO";

export interface Client {
  id: number;
  cuit: string;
  razonSocial: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  contacto?: string;
  condicionIVA?: string;
  saldo: number;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Movement {
  id: number;
  tipo: MovementTipo;
  monto: number;
  fecha: string;
  referencia?: string;
  clientId: number;
}

export interface ClientDetail extends Client {
  movements: Movement[];
  orders: { id: number; quantity: number; status: string; deliveryDate?: string }[];
}

const cuitRegex = /^\d{2}-?\d{8}-?\d{1}$/;

export const createClientSchema = z.object({
  cuit: z
    .string()
    .trim()
    .regex(cuitRegex, "Invalid CUIT format (XX-XXXXXXXX-X)"),
  razonSocial: z.string().trim().min(1, "Razón social is required"),
  direccion: z.string().trim().optional(),
  telefono: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email format").optional(),
  contacto: z.string().trim().optional(),
  condicionIVA: z.string().trim().optional(),
});

export const updateClientSchema = z.object({
  razonSocial: z.string().trim().min(1).optional(),
  direccion: z.string().trim().optional(),
  telefono: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email format").optional(),
  contacto: z.string().trim().optional(),
  condicionIVA: z.string().trim().optional(),
});

export const createMovementSchema = z.object({
  tipo: z.enum(["DEBITO", "CREDITO"]),
  monto: z.number().positive("Monto must be greater than 0"),
  referencia: z.string().trim().optional(),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
export type CreateMovementFormData = z.infer<typeof createMovementSchema>;
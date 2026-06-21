import { z } from "zod";

export interface PortalSession {
  sessionToken: string;
  client: PortalClient;
}

export interface PortalClient {
  id: number;
  razonSocial: string;
  cuit: string;
}

export interface PortalOrder {
  id: number;
  formulaId: number;
  quantity: number;
  obraAddress: string | null;
  scheduledDate: string | null;
  priceSnapshot: number | null;
  status: string;
  createdAt: string;
}

export interface PortalOrderDetail extends PortalOrder {
  truck: { id: number; patente: string } | null;
  completedAt: string | null;
  statusHistory: { status: string; timestamp: string }[];
}

const cuitRegex = /^\d{2}-?\d{8}-?\d{1}$/;

export const portalLoginSchema = z.object({
  cuit: z
    .string()
    .trim()
    .regex(cuitRegex, "Formato de CUIT inválido (XX-XXXXXXXX-X)"),
});

export const portalCreateOrderSchema = z.object({
  formulaId: z.number().int().positive("Fórmula es requerida"),
  quantity: z.number().positive("La cantidad debe ser mayor a 0"),
  obraAddress: z.string().trim().min(1, "Dirección de obra es requerida"),
  scheduledDate: z.string().optional(),
});

export type PortalLoginFormData = z.infer<typeof portalLoginSchema>;
export type PortalCreateOrderFormData = z.infer<typeof portalCreateOrderSchema>;

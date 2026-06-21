import { z } from "zod";

const cuitRegex = /^\d{2}-?\d{8}-?\d{1}$/;

export const portalLoginBodySchema = z.object({
  cuit: z
    .string()
    .trim()
    .regex(cuitRegex, "Invalid CUIT format (XX-XXXXXXXX-X)"),
});

export const portalCreateOrderBodySchema = z.object({
  formulaId: z.number().int().positive(),
  quantity: z.number().positive("Quantity must be greater than 0"),
  obraAddress: z.string().trim().min(1, "Obra address is required"),
  scheduledDate: z.string().datetime().optional(),
});

export type PortalLoginBody = z.infer<typeof portalLoginBodySchema>;
export type PortalCreateOrderBody = z.infer<typeof portalCreateOrderBodySchema>;

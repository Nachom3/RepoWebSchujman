import { z } from "zod";

const cuitRegex = /^\d{2}-?\d{8}-?\d{1}$/;

export const createClientBodySchema = z.object({
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

export const updateClientBodySchema = z.object({
  razonSocial: z.string().trim().min(1).optional(),
  direccion: z.string().trim().optional(),
  telefono: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email format").optional(),
  contacto: z.string().trim().optional(),
  condicionIVA: z.string().trim().optional(),
});

export const listClientsQuerySchema = z.object({
  status: z.enum(["active", "disabled"]).optional(),
});

export type CreateClientBody = z.infer<typeof createClientBodySchema>;
export type UpdateClientBody = z.infer<typeof updateClientBodySchema>;
export type ListClientsQuery = z.infer<typeof listClientsQuerySchema>;
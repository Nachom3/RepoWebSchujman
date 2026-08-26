import { z } from "zod";

const optionalTaxId = z
  .string()
  .trim()
  .min(8, "Tax ID too short")
  .max(20, "Tax ID too long")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const createClientBodySchema = z.object({
  taxId: optionalTaxId,
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email format").optional().or(z.literal("").transform(() => undefined)),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  contactName: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const updateClientBodySchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email("Invalid email format").optional().or(z.literal("").transform(() => undefined)),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  contactName: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const listClientsQuerySchema = z.object({
  status: z
    .enum(["ACTIVE", "DISABLED", "active", "disabled"])
    .transform((status) => status.toUpperCase() as "ACTIVE" | "DISABLED")
    .optional(),
});

export type CreateClientBody = z.infer<typeof createClientBodySchema>;
export type UpdateClientBody = z.infer<typeof updateClientBodySchema>;
export type ListClientsQuery = z.infer<typeof listClientsQuerySchema>;

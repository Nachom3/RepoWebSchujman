import { z } from "zod";

export type ClientStatus = "ACTIVE" | "DISABLED";

export interface Client {
  id: number;
  taxId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ClientDetail extends Client {
  address: string | null;
  contactName: string | null;
  notes: string | null;
  projects: {
    id: number;
    name: string;
    status: string;
    progressPercent: number;
  }[];
}

const taxIdSchema = z
  .string()
  .trim()
  .min(8, "Tax ID too short")
  .max(20, "Tax ID too long")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const createClientSchema = z.object({
  taxId: taxIdSchema,
  name: z.string().trim().min(1, "Name is required"),
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  contactName: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const updateClientSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  contactName: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;

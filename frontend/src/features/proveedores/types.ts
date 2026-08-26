import { z } from "zod";

export interface Supplier {
  id: number;
  name: string;
  taxId: string | null;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  category: string | null;
  paymentTerms: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  materialsCount: number;
}

const trimmedOptional = z
  .string()
  .trim()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const createSupplierSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  taxId: trimmedOptional,
  contactName: trimmedOptional,
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  phone: trimmedOptional,
  website: z
    .string()
    .trim()
    .url("Invalid URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  address: trimmedOptional,
  category: trimmedOptional,
  paymentTerms: trimmedOptional,
  notes: trimmedOptional,
});

export const updateSupplierSchema = createSupplierSchema.partial();

export type CreateSupplierFormData = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierFormData = z.infer<typeof updateSupplierSchema>;

import { z } from "zod";

const trimmedOptional = z
  .string()
  .trim()
  .optional()
  .or(z.literal("").transform(() => undefined));

const trimmedRequired = z.string().trim().min(1, "Name is required");

export const createSupplierBodySchema = z.object({
  name: trimmedRequired,
  taxId: trimmedOptional,
  contactName: trimmedOptional,
  email: z
    .string()
    .trim()
    .email("Invalid email format")
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

export const updateSupplierBodySchema = createSupplierBodySchema.partial();

export type CreateSupplierBody = z.infer<typeof createSupplierBodySchema>;
export type UpdateSupplierBody = z.infer<typeof updateSupplierBodySchema>;

import type { Supplier } from "@prisma/client";
export type SupplierResponse = Supplier & {
  materialsCount: number;
};
export type SupplierListResponse = SupplierResponse[];

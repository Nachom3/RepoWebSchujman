import type { Material, Supplier } from "@prisma/client";

export type MaterialResponse = Material & {
  isLow: boolean;
  supplier: Pick<Supplier, "id" | "name"> | null;
};
export type MaterialListResponse = MaterialResponse[];

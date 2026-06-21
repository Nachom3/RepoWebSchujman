import type { SiloStock } from "@prisma/client";

export type CreateSiloDto = {
  material: string;
  quantity: number;
  unit: string;
  alertMin?: number;
};

export type UpdateSiloDto = {
  material?: string;
  quantity?: number;
  unit?: string;
  alertMin?: number;
};

export type SiloResponse = Pick<
  SiloStock,
  "id" | "material" | "quantity" | "unit" | "alertMin"
> & {
  isLow: boolean;
};

export type SiloListResponse = SiloResponse[];

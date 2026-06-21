import type { Formula, FormulaMaterial, SiloStock } from "@prisma/client";

export type CreateFormulaDto = {
  name: string;
  recipe?: string;
  pricePerCubicMeter: number;
};

export type UpdateFormulaDto = {
  name?: string;
  recipe?: string;
  pricePerCubicMeter?: number;
};

export type FormulaResponse = Pick<
  Formula,
  "id" | "name" | "recipe" | "pricePerCubicMeter"
>;

export type FormulaDetailResponse = Formula & {
  materials: (FormulaMaterial & {
    siloStock: Pick<SiloStock, "id" | "material" | "unit">;
  })[];
};

export type FormulaListResponse = FormulaResponse[];

export type FormulaMaterialResponse = FormulaMaterial & {
  siloStock: Pick<SiloStock, "id" | "material" | "unit">;
};

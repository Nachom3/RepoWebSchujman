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

export type AddFormulaMaterialDto = {
  siloStockId: number;
  kgPerCubicMeter: number;
};

export type FormulaResponse = {
  id: number;
  name: string;
  recipe: string | null;
  pricePerCubicMeter: number;
};

export type FormulaMaterialSiloStockResponse = {
  id: number;
  material: string;
  unit: string;
};

export type FormulaMaterialResponse = {
  id: number;
  formulaId: number;
  siloStockId: number;
  kgPerCubicMeter: number;
  siloStock: FormulaMaterialSiloStockResponse;
};

export type FormulaDetailResponse = FormulaResponse & {
  materials: FormulaMaterialResponse[];
};

export type FormulaListResponse = FormulaResponse[];

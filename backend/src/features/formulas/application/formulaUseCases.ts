import type {
  AddFormulaMaterialDto,
  CreateFormulaDto,
  FormulaDetailResponse,
  FormulaListResponse,
  FormulaMaterialResponse,
  FormulaResponse,
  UpdateFormulaDto,
} from "../../../types/formulas";

type UseCaseResult<T, E extends string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type FormulaRepository = {
  createFormula(data: CreateFormulaDto): Promise<FormulaDetailResponse>;
  listFormulas(): Promise<FormulaListResponse>;
  findFormulaById(id: number): Promise<FormulaDetailResponse | null>;
  updateFormula(id: number, data: UpdateFormulaDto): Promise<FormulaDetailResponse | null>;
  deleteFormulaWithMaterials(id: number): Promise<FormulaResponse | null>;
  formulaExists(id: number): Promise<boolean>;
  siloStockExists(id: number): Promise<boolean>;
  createFormulaMaterial(
    formulaId: number,
    data: AddFormulaMaterialDto,
  ): Promise<
    | { type: "created"; material: FormulaMaterialResponse }
    | { type: "already_linked" }
  >;
  deleteFormulaMaterial(materialId: number): Promise<boolean>;
};

export async function createFormulaUseCase(
  repository: FormulaRepository,
  data: CreateFormulaDto,
): Promise<FormulaDetailResponse> {
  return repository.createFormula(data);
}

export async function listFormulasUseCase(
  repository: FormulaRepository,
): Promise<FormulaListResponse> {
  return repository.listFormulas();
}

export async function getFormulaUseCase(
  repository: FormulaRepository,
  id: number,
): Promise<UseCaseResult<FormulaDetailResponse, "formula_not_found">> {
  const formula = await repository.findFormulaById(id);
  if (!formula) {
    return { ok: false, error: "formula_not_found" };
  }
  return { ok: true, value: formula };
}

export async function updateFormulaUseCase(
  repository: FormulaRepository,
  id: number,
  data: UpdateFormulaDto,
): Promise<UseCaseResult<FormulaDetailResponse, "formula_not_found">> {
  const formula = await repository.updateFormula(id, data);
  if (!formula) {
    return { ok: false, error: "formula_not_found" };
  }
  return { ok: true, value: formula };
}

export async function deleteFormulaUseCase(
  repository: FormulaRepository,
  id: number,
): Promise<UseCaseResult<FormulaResponse, "formula_not_found">> {
  const formula = await repository.deleteFormulaWithMaterials(id);
  if (!formula) {
    return { ok: false, error: "formula_not_found" };
  }
  return { ok: true, value: formula };
}

export async function addFormulaMaterialUseCase(
  repository: FormulaRepository,
  formulaId: number,
  data: AddFormulaMaterialDto,
): Promise<
  UseCaseResult<
    FormulaMaterialResponse,
    "formula_not_found" | "silo_stock_not_found" | "material_already_linked"
  >
> {
  if (!(await repository.formulaExists(formulaId))) {
    return { ok: false, error: "formula_not_found" };
  }

  if (!(await repository.siloStockExists(data.siloStockId))) {
    return { ok: false, error: "silo_stock_not_found" };
  }

  const result = await repository.createFormulaMaterial(formulaId, data);
  if (result.type === "already_linked") {
    return { ok: false, error: "material_already_linked" };
  }
  return { ok: true, value: result.material };
}

export async function deleteFormulaMaterialUseCase(
  repository: FormulaRepository,
  materialId: number,
): Promise<UseCaseResult<void, "material_not_found">> {
  const deleted = await repository.deleteFormulaMaterial(materialId);
  if (!deleted) {
    return { ok: false, error: "material_not_found" };
  }
  return { ok: true, value: undefined };
}

import { Router, type Request, type Response } from "express";

import { authenticateToken } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import {
  addMaterialBodySchema,
  createFormulaBodySchema,
  type AddMaterialBody,
  type CreateFormulaBody,
  type UpdateFormulaBody,
  updateFormulaBodySchema,
} from "../validation/formulaSchemas";
import type { ApiErrorResponse } from "../types/auth";
import type {
  FormulaDetailResponse,
  FormulaListResponse,
  FormulaMaterialResponse,
  FormulaResponse,
} from "../types/formulas";
import {
  addFormulaMaterialUseCase,
  createFormulaUseCase,
  deleteFormulaMaterialUseCase,
  deleteFormulaUseCase,
  getFormulaUseCase,
  listFormulasUseCase,
  updateFormulaUseCase,
} from "../features/formulas/application/formulaUseCases";
import * as formulaRepository from "../features/formulas/infrastructure/formulaRepository";

export const formulasRouter = Router();

formulasRouter.use(authenticateToken);

function parseRouteId(value: string): number | null {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
}

formulasRouter.post(
  "/",
  validateBody(createFormulaBodySchema),
  async (
    req: Request<unknown, FormulaDetailResponse | ApiErrorResponse, CreateFormulaBody>,
    res: Response<FormulaDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const formula = await createFormulaUseCase(formulaRepository, req.body);
      res.status(201).json(formula);
    } catch (err) {
      console.error("[create formula]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

formulasRouter.get(
  "/",
  async (
    _req: Request,
    res: Response<FormulaListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      res.json(await listFormulasUseCase(formulaRepository));
    } catch (err) {
      console.error("[list formulas]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

formulasRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, FormulaDetailResponse | ApiErrorResponse>,
    res: Response<FormulaDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseRouteId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid formula ID" });
      return;
    }

    try {
      const result = await getFormulaUseCase(formulaRepository, id);
      if (!result.ok) {
        res.status(404).json({ error: "Formula not found" });
        return;
      }
      res.json(result.value);
    } catch (err) {
      console.error("[get formula]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

formulasRouter.patch(
  "/:id",
  validateBody(updateFormulaBodySchema),
  async (
    req: Request<{ id: string }, FormulaDetailResponse | ApiErrorResponse, UpdateFormulaBody>,
    res: Response<FormulaDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseRouteId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid formula ID" });
      return;
    }

    try {
      const result = await updateFormulaUseCase(formulaRepository, id, req.body);
      if (!result.ok) {
        res.status(404).json({ error: "Formula not found" });
        return;
      }
      res.json(result.value);
    } catch (err) {
      console.error("[update formula]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

formulasRouter.delete(
  "/:id",
  requireRole("ADMIN"),
  async (
    req: Request<{ id: string }, FormulaResponse | ApiErrorResponse>,
    res: Response<FormulaResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseRouteId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid formula ID" });
      return;
    }

    try {
      const result = await deleteFormulaUseCase(formulaRepository, id);
      if (!result.ok) {
        res.status(404).json({ error: "Formula not found" });
        return;
      }
      res.json(result.value);
    } catch (err) {
      console.error("[delete formula]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

formulasRouter.post(
  "/:id/materials",
  validateBody(addMaterialBodySchema),
  async (
    req: Request<{ id: string }, FormulaMaterialResponse | ApiErrorResponse, AddMaterialBody>,
    res: Response<FormulaMaterialResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const formulaId = parseRouteId(req.params.id);
    if (formulaId === null) {
      res.status(400).json({ error: "Invalid formula ID" });
      return;
    }

    try {
      const result = await addFormulaMaterialUseCase(formulaRepository, formulaId, req.body);
      if (!result.ok) {
        if (result.error === "formula_not_found") {
          res.status(404).json({ error: "Formula not found" });
          return;
        }
        if (result.error === "silo_stock_not_found") {
          res.status(404).json({ error: "SiloStock not found" });
          return;
        }
        res.status(409).json({ error: "Material already linked to this formula" });
        return;
      }
      res.status(201).json(result.value);
    } catch (err) {
      console.error("[add material]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

formulasRouter.delete(
  "/:id/materials/:materialId",
  async (
    req: Request<{ id: string; materialId: string }, void | ApiErrorResponse>,
    res: Response<void | ApiErrorResponse>,
  ): Promise<void> => {
    const formulaId = parseRouteId(req.params.id);
    const materialId = parseRouteId(req.params.materialId);
    if (formulaId === null || materialId === null) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    try {
      const result = await deleteFormulaMaterialUseCase(formulaRepository, materialId);
      if (!result.ok) {
        res.status(404).json({ error: "Material not found" });
        return;
      }
      res.status(204).send();
    } catch (err) {
      console.error("[delete material]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

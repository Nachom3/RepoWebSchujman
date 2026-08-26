import { Router, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import {
  createMaterialBodySchema,
  updateMaterialBodySchema,
  type CreateMaterialBody,
  type UpdateMaterialBody,
} from "../validation/materialSchemas";
import type { ApiErrorResponse } from "../types/auth";
import type { MaterialResponse, MaterialListResponse } from "../types/materials";
import {
  CreateMaterialUseCase,
  DeleteMaterialUseCase,
  DuplicateMaterialNameError,
  GetMaterialUseCase,
  ListMaterialsUseCase,
  MaterialNotFoundError,
  MaterialSupplierNotFoundError,
  UpdateMaterialUseCase,
} from "../features/materials/application/materialUseCases";
import { PrismaMaterialsRepository } from "../features/materials/infrastructure/prismaMaterialsRepository";

export const materialsRouter = Router();

const repository = new PrismaMaterialsRepository();
const createUseCase = new CreateMaterialUseCase(repository);
const listUseCase = new ListMaterialsUseCase(repository);
const getUseCase = new GetMaterialUseCase(repository);
const updateUseCase = new UpdateMaterialUseCase(repository);
const deleteUseCase = new DeleteMaterialUseCase(repository);

materialsRouter.use(authenticateToken);

function parseId(value: string): number | null {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
}

materialsRouter.post(
  "/",
  requireRole("ADMIN"),
  validateBody(createMaterialBodySchema),
  async (
    req: Request<unknown, MaterialResponse | ApiErrorResponse, CreateMaterialBody>,
    res: Response<MaterialResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const material = await createUseCase.execute(req.body);
      res.status(201).json(material);
    } catch (err) {
      if (err instanceof DuplicateMaterialNameError) {
        res.status(409).json({ error: err.message });
        return;
      }
      if (err instanceof MaterialSupplierNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[create material]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

materialsRouter.get(
  "/",
  async (
    _req: Request,
    res: Response<MaterialListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      res.json(await listUseCase.execute());
    } catch (err) {
      console.error("[list materials]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

materialsRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, MaterialResponse | ApiErrorResponse>,
    res: Response<MaterialResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid material ID" });
      return;
    }
    try {
      res.json(await getUseCase.execute(id));
    } catch (err) {
      if (err instanceof MaterialNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[get material]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

materialsRouter.patch(
  "/:id",
  requireRole("ADMIN"),
  validateBody(updateMaterialBodySchema),
  async (
    req: Request<{ id: string }, MaterialResponse | ApiErrorResponse, UpdateMaterialBody>,
    res: Response<MaterialResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid material ID" });
      return;
    }
    try {
      res.json(await updateUseCase.execute(id, req.body));
    } catch (err) {
      if (err instanceof MaterialNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err instanceof DuplicateMaterialNameError) {
        res.status(409).json({ error: err.message });
        return;
      }
      if (err instanceof MaterialSupplierNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[update material]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

materialsRouter.delete(
  "/:id",
  requireRole("ADMIN"),
  async (
    req: Request<{ id: string }, MaterialResponse | ApiErrorResponse>,
    res: Response<MaterialResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid material ID" });
      return;
    }
    try {
      res.json(await deleteUseCase.execute(id));
    } catch (err) {
      if (err instanceof MaterialNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[delete material]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

import { Router, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import {
  createSupplierBodySchema,
  updateSupplierBodySchema,
  type CreateSupplierBody,
  type UpdateSupplierBody,
} from "../validation/supplierSchemas";
import type { ApiErrorResponse } from "../types/auth";
import type { SupplierResponse, SupplierListResponse } from "../types/suppliers";
import {
  CreateSupplierUseCase,
  DeleteSupplierUseCase,
  GetSupplierUseCase,
  ListSuppliersUseCase,
  SupplierNotFoundError,
  UpdateSupplierUseCase,
} from "../features/suppliers/application/supplierUseCases";
import { PrismaSuppliersRepository } from "../features/suppliers/infrastructure/prismaSuppliersRepository";

export const suppliersRouter = Router();

const repository = new PrismaSuppliersRepository();
const createUseCase = new CreateSupplierUseCase(repository);
const listUseCase = new ListSuppliersUseCase(repository);
const getUseCase = new GetSupplierUseCase(repository);
const updateUseCase = new UpdateSupplierUseCase(repository);
const deleteUseCase = new DeleteSupplierUseCase(repository);

suppliersRouter.use(authenticateToken);
suppliersRouter.use(requireRole("ADMIN"));

function parseId(value: string): number | null {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
}

suppliersRouter.post(
  "/",
  validateBody(createSupplierBodySchema),
  async (
    req: Request<unknown, SupplierResponse | ApiErrorResponse, CreateSupplierBody>,
    res: Response<SupplierResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      res.status(201).json(await createUseCase.execute(req.body));
    } catch (err) {
      console.error("[create supplier]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

suppliersRouter.get(
  "/",
  async (
    _req: Request,
    res: Response<SupplierListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      res.json(await listUseCase.execute());
    } catch (err) {
      console.error("[list suppliers]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

suppliersRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, SupplierResponse | ApiErrorResponse>,
    res: Response<SupplierResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid supplier ID" });
      return;
    }
    try {
      res.json(await getUseCase.execute(id));
    } catch (err) {
      if (err instanceof SupplierNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[get supplier]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

suppliersRouter.patch(
  "/:id",
  validateBody(updateSupplierBodySchema),
  async (
    req: Request<{ id: string }, SupplierResponse | ApiErrorResponse, UpdateSupplierBody>,
    res: Response<SupplierResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid supplier ID" });
      return;
    }
    try {
      res.json(await updateUseCase.execute(id, req.body));
    } catch (err) {
      if (err instanceof SupplierNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[update supplier]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

suppliersRouter.delete(
  "/:id",
  requireRole("ADMIN"),
  async (
    req: Request<{ id: string }, SupplierResponse | ApiErrorResponse>,
    res: Response<SupplierResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid supplier ID" });
      return;
    }
    try {
      res.json(await deleteUseCase.execute(id));
    } catch (err) {
      if (err instanceof SupplierNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[delete supplier]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

import { Router, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import {
  createBudgetBodySchema,
  updateBudgetBodySchema,
  listBudgetsQuerySchema,
  type CreateBudgetBody,
  type UpdateBudgetBody,
  type ListBudgetsQuery,
} from "../validation/budgetSchemas";
import type { ApiErrorResponse } from "../types/auth";
import type { BudgetResponse, BudgetListResponse } from "../types/budgets";
import {
  BudgetNotFoundError,
  BudgetProjectNotFoundError,
  CreateBudgetUseCase,
  DeleteBudgetUseCase,
  GetBudgetUseCase,
  ListBudgetsUseCase,
  UpdateBudgetUseCase,
} from "../features/budgets/application/budgetUseCases";
import { PrismaBudgetsRepository } from "../features/budgets/infrastructure/prismaBudgetsRepository";

export const budgetsRouter = Router();

const repository = new PrismaBudgetsRepository();
const createUseCase = new CreateBudgetUseCase(repository);
const listUseCase = new ListBudgetsUseCase(repository);
const getUseCase = new GetBudgetUseCase(repository);
const updateUseCase = new UpdateBudgetUseCase(repository);
const deleteUseCase = new DeleteBudgetUseCase(repository);

budgetsRouter.use(authenticateToken);
budgetsRouter.use(requireRole("ADMIN"));

function parseId(value: string): number | null {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
}

budgetsRouter.post(
  "/",
  validateBody(createBudgetBodySchema),
  async (
    req: Request<unknown, BudgetResponse | ApiErrorResponse, CreateBudgetBody>,
    res: Response<BudgetResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const input = {
        ...req.body,
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined,
      };
      res.status(201).json(await createUseCase.execute(input));
    } catch (err) {
      if (err instanceof BudgetProjectNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[create budget]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

budgetsRouter.get(
  "/",
  async (
    req: Request<unknown, BudgetListResponse | ApiErrorResponse, unknown, ListBudgetsQuery>,
    res: Response<BudgetListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const queryResult = listBudgetsQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({ error: "Validation failed", details: queryResult.error.flatten() });
      return;
    }
    try {
      res.json(await listUseCase.execute(queryResult.data));
    } catch (err) {
      console.error("[list budgets]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

budgetsRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, BudgetResponse | ApiErrorResponse>,
    res: Response<BudgetResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid budget ID" });
      return;
    }
    try {
      res.json(await getUseCase.execute(id));
    } catch (err) {
      if (err instanceof BudgetNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[get budget]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

budgetsRouter.patch(
  "/:id",
  validateBody(updateBudgetBodySchema),
  async (
    req: Request<{ id: string }, BudgetResponse | ApiErrorResponse, UpdateBudgetBody>,
    res: Response<BudgetResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid budget ID" });
      return;
    }
    try {
      const input = {
        ...req.body,
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined,
      };
      res.json(await updateUseCase.execute(id, input));
    } catch (err) {
      if (err instanceof BudgetNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[update budget]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

budgetsRouter.delete(
  "/:id",
  async (
    req: Request<{ id: string }, BudgetResponse | ApiErrorResponse>,
    res: Response<BudgetResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid budget ID" });
      return;
    }
    try {
      res.json(await deleteUseCase.execute(id));
    } catch (err) {
      if (err instanceof BudgetNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[delete budget]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

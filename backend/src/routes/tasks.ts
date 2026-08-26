import { Router, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import {
  createTaskBodySchema,
  updateTaskBodySchema,
  listTasksQuerySchema,
  type CreateTaskBody,
  type UpdateTaskBody,
  type ListTasksQuery,
} from "../validation/taskSchemas";
import type { ApiErrorResponse } from "../types/auth";
import type { TaskResponse, TaskListResponse } from "../types/tasks";
import {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskUseCase,
  ListTasksUseCase,
  TaskNotFoundError,
  TaskProjectNotFoundError,
  UpdateTaskUseCase,
} from "../features/tasks/application/taskUseCases";
import { PrismaTasksRepository } from "../features/tasks/infrastructure/prismaTasksRepository";

export const tasksRouter = Router();

const repository = new PrismaTasksRepository();
const createUseCase = new CreateTaskUseCase(repository);
const listUseCase = new ListTasksUseCase(repository);
const getUseCase = new GetTaskUseCase(repository);
const updateUseCase = new UpdateTaskUseCase(repository);
const deleteUseCase = new DeleteTaskUseCase(repository);

tasksRouter.use(authenticateToken);

function parseId(value: string): number | null {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
}

tasksRouter.post(
  "/",
  requireRole("ADMIN"),
  validateBody(createTaskBodySchema),
  async (
    req: Request<unknown, TaskResponse | ApiErrorResponse, CreateTaskBody>,
    res: Response<TaskResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const input = {
        ...req.body,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      };
      res.status(201).json(await createUseCase.execute(input));
    } catch (err) {
      if (err instanceof TaskProjectNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[create task]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

tasksRouter.get(
  "/",
  async (
    req: Request<unknown, TaskListResponse | ApiErrorResponse, unknown, ListTasksQuery>,
    res: Response<TaskListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const queryResult = listTasksQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({ error: "Validation failed", details: queryResult.error.flatten() });
      return;
    }
    try {
      res.json(await listUseCase.execute(queryResult.data));
    } catch (err) {
      console.error("[list tasks]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

tasksRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, TaskResponse | ApiErrorResponse>,
    res: Response<TaskResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }
    try {
      res.json(await getUseCase.execute(id));
    } catch (err) {
      if (err instanceof TaskNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[get task]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

tasksRouter.patch(
  "/:id",
  requireRole("ADMIN"),
  validateBody(updateTaskBodySchema),
  async (
    req: Request<{ id: string }, TaskResponse | ApiErrorResponse, UpdateTaskBody>,
    res: Response<TaskResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }
    try {
      const input = {
        ...req.body,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      };
      res.json(await updateUseCase.execute(id, input));
    } catch (err) {
      if (err instanceof TaskNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[update task]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

tasksRouter.delete(
  "/:id",
  requireRole("ADMIN"),
  async (
    req: Request<{ id: string }, TaskResponse | ApiErrorResponse>,
    res: Response<TaskResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }
    try {
      res.json(await deleteUseCase.execute(id));
    } catch (err) {
      if (err instanceof TaskNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[delete task]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

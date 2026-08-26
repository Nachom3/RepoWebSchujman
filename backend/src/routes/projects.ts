import { Router, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import {
  createProjectBodySchema,
  updateProjectBodySchema,
  listProjectsQuerySchema,
  type CreateProjectBody,
  type UpdateProjectBody,
  type ListProjectsQuery,
} from "../validation/projectSchemas";
import type {
  ProjectResponse,
  ProjectListResponse,
  ProjectDetailResponse,
} from "../types/projects";
import type { ApiErrorResponse } from "../types/auth";
import {
  CreateProjectUseCase,
  DeleteProjectUseCase,
  GetProjectDetailUseCase,
  ListProjectsUseCase,
  UpdateProjectUseCase,
  ClientForProjectNotFoundError,
  ProjectNotFoundError,
} from "../features/projects/application/projectUseCases";
import { PrismaProjectsRepository } from "../features/projects/infrastructure/prismaProjectsRepository";

export const projectsRouter = Router();

const repository = new PrismaProjectsRepository();
const createUseCase = new CreateProjectUseCase(repository);
const listUseCase = new ListProjectsUseCase(repository);
const detailUseCase = new GetProjectDetailUseCase(repository);
const updateUseCase = new UpdateProjectUseCase(repository);
const deleteUseCase = new DeleteProjectUseCase(repository);

projectsRouter.use(authenticateToken);

function parseId(value: string): number | null {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
}

projectsRouter.post(
  "/",
  requireRole("ADMIN"),
  validateBody(createProjectBodySchema),
  async (
    req: Request<unknown, ProjectResponse | ApiErrorResponse, CreateProjectBody>,
    res: Response<ProjectResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const input = {
        ...req.body,
        estimatedStart: req.body.estimatedStart ? new Date(req.body.estimatedStart) : undefined,
        estimatedEnd: req.body.estimatedEnd ? new Date(req.body.estimatedEnd) : undefined,
      };
      const project = await createUseCase.execute(input);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof ClientForProjectNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[create project]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

projectsRouter.get(
  "/",
  async (
    req: Request<unknown, ProjectListResponse | ApiErrorResponse, unknown, ListProjectsQuery>,
    res: Response<ProjectListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const queryResult = listProjectsQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({
        error: "Validation failed",
        details: queryResult.error.flatten(),
      });
      return;
    }
    const projects = await listUseCase.execute(queryResult.data);
    res.json(projects);
  },
);

projectsRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, ProjectDetailResponse | ApiErrorResponse>,
    res: Response<ProjectDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }
    try {
      const project = await detailUseCase.execute(id);
      res.json(project);
    } catch (err) {
      if (err instanceof ProjectNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[get project]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

projectsRouter.patch(
  "/:id",
  requireRole("ADMIN"),
  validateBody(updateProjectBodySchema),
  async (
    req: Request<{ id: string }, ProjectResponse | ApiErrorResponse, UpdateProjectBody>,
    res: Response<ProjectResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }
    try {
      const input = {
        ...req.body,
        estimatedStart: req.body.estimatedStart ? new Date(req.body.estimatedStart) : undefined,
        estimatedEnd: req.body.estimatedEnd ? new Date(req.body.estimatedEnd) : undefined,
      };
      const project = await updateUseCase.execute(id, input);
      res.json(project);
    } catch (err) {
      if (err instanceof ProjectNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[update project]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

projectsRouter.delete(
  "/:id",
  requireRole("ADMIN"),
  async (
    req: Request<{ id: string }, ProjectResponse | ApiErrorResponse>,
    res: Response<ProjectResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }
    try {
      const project = await deleteUseCase.execute(id);
      res.json(project);
    } catch (err) {
      if (err instanceof ProjectNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[delete project]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

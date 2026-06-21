import { Router, type Request, type Response } from "express";

import { authenticateToken } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import {
  createSiloBodySchema,
  type CreateSiloBody,
  type UpdateSiloBody,
  updateSiloBodySchema,
} from "../validation/siloSchemas";
import type { ApiErrorResponse } from "../types/auth";
import type { SiloListResponse, SiloResponse } from "../types/silos";
import {
  createSiloUseCase,
  deleteSiloUseCase,
  getSiloUseCase,
  listSilosUseCase,
  updateSiloUseCase,
} from "../features/silos/application/siloUseCases";
import * as siloRepository from "../features/silos/infrastructure/siloRepository";

export const silosRouter = Router();

silosRouter.use(authenticateToken);

function parseRouteId(value: string): number | null {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
}

silosRouter.post(
  "/",
  validateBody(createSiloBodySchema),
  async (
    req: Request<unknown, SiloResponse | ApiErrorResponse, CreateSiloBody>,
    res: Response<SiloResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const silo = await createSiloUseCase(siloRepository, req.body);
      res.status(201).json(silo);
    } catch (err) {
      console.error("[create silo]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

silosRouter.get(
  "/",
  async (
    _req: Request,
    res: Response<SiloListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      res.json(await listSilosUseCase(siloRepository));
    } catch (err) {
      console.error("[list silos]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

silosRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, SiloResponse | ApiErrorResponse>,
    res: Response<SiloResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseRouteId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid silo ID" });
      return;
    }

    try {
      const result = await getSiloUseCase(siloRepository, id);
      if (!result.ok) {
        res.status(404).json({ error: "Silo not found" });
        return;
      }
      res.json(result.value);
    } catch (err) {
      console.error("[get silo]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

silosRouter.patch(
  "/:id",
  validateBody(updateSiloBodySchema),
  async (
    req: Request<{ id: string }, SiloResponse | ApiErrorResponse, UpdateSiloBody>,
    res: Response<SiloResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseRouteId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid silo ID" });
      return;
    }

    try {
      const result = await updateSiloUseCase(siloRepository, id, req.body);
      if (!result.ok) {
        res.status(404).json({ error: "Silo not found" });
        return;
      }
      res.json(result.value);
    } catch (err) {
      console.error("[update silo]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

silosRouter.delete(
  "/:id",
  requireRole("ADMIN"),
  async (
    req: Request<{ id: string }, SiloResponse | ApiErrorResponse>,
    res: Response<SiloResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseRouteId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid silo ID" });
      return;
    }

    try {
      const result = await deleteSiloUseCase(siloRepository, id);
      if (!result.ok) {
        res.status(404).json({ error: "Silo not found" });
        return;
      }
      res.json(result.value);
    } catch (err) {
      console.error("[delete silo]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

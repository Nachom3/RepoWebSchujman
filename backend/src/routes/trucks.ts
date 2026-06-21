import { Router, type Request, type Response } from "express";

import { authenticateToken } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import {
  createTruckBodySchema,
  type CreateTruckBody,
  type UpdateTruckBody,
  updateTruckBodySchema,
} from "../validation/truckSchemas";
import type { ApiErrorResponse } from "../types/auth";
import type { TruckListResponse, TruckResponse } from "../types/trucks";
import {
  createTruckUseCase,
  deleteTruckUseCase,
  getTruckUseCase,
  listTrucksUseCase,
  toggleTruckStatusUseCase,
  updateTruckUseCase,
} from "../features/trucks/application/truckUseCases";
import * as truckRepository from "../features/trucks/infrastructure/truckRepository";

export const trucksRouter = Router();

trucksRouter.use(authenticateToken);

function parseRouteId(value: string): number | null {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
}

trucksRouter.post(
  "/",
  validateBody(createTruckBodySchema),
  async (
    req: Request<unknown, TruckResponse | ApiErrorResponse, CreateTruckBody>,
    res: Response<TruckResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const result = await createTruckUseCase(truckRepository, req.body);
      if (!result.ok) {
        res.status(409).json({ error: "Patente already registered" });
        return;
      }
      res.status(201).json(result.value);
    } catch (err) {
      console.error("[create truck]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

trucksRouter.get(
  "/",
  async (
    _req: Request,
    res: Response<TruckListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      res.json(await listTrucksUseCase(truckRepository));
    } catch (err) {
      console.error("[list trucks]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

trucksRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, TruckResponse | ApiErrorResponse>,
    res: Response<TruckResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseRouteId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid truck ID" });
      return;
    }

    try {
      const result = await getTruckUseCase(truckRepository, id);
      if (!result.ok) {
        res.status(404).json({ error: "Truck not found" });
        return;
      }
      res.json(result.value);
    } catch (err) {
      console.error("[get truck]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

trucksRouter.patch(
  "/:id",
  validateBody(updateTruckBodySchema),
  async (
    req: Request<{ id: string }, TruckResponse | ApiErrorResponse, UpdateTruckBody>,
    res: Response<TruckResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseRouteId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid truck ID" });
      return;
    }

    try {
      const result = await updateTruckUseCase(truckRepository, id, req.body);
      if (!result.ok) {
        if (result.error === "truck_not_found") {
          res.status(404).json({ error: "Truck not found" });
          return;
        }
        res.status(409).json({ error: "Patente already registered" });
        return;
      }
      res.json(result.value);
    } catch (err) {
      console.error("[update truck]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

trucksRouter.post(
  "/:id/toggle-status",
  async (
    req: Request<{ id: string }, TruckResponse | ApiErrorResponse>,
    res: Response<TruckResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseRouteId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid truck ID" });
      return;
    }

    try {
      const result = await toggleTruckStatusUseCase(truckRepository, id);
      if (!result.ok) {
        res.status(404).json({ error: "Truck not found" });
        return;
      }
      res.json(result.value);
    } catch (err) {
      console.error("[toggle truck status]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

trucksRouter.delete(
  "/:id",
  requireRole("ADMIN"),
  async (
    req: Request<{ id: string }, TruckResponse | ApiErrorResponse>,
    res: Response<TruckResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseRouteId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid truck ID" });
      return;
    }

    try {
      const result = await deleteTruckUseCase(truckRepository, id);
      if (!result.ok) {
        res.status(404).json({ error: "Truck not found" });
        return;
      }
      res.json(result.value);
    } catch (err) {
      console.error("[delete truck]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

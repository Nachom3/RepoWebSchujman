import { Router, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  createMovementBodySchema,
  type CreateMovementBody,
} from "../validation/movementSchemas";
import type {
  MovementResponse,
  MovementListResponse,
} from "../types/movements";
import type { ApiErrorResponse } from "../types/auth";
import {
  CreateClientMovementUseCase,
  ListClientMovementsUseCase,
} from "../features/client-movements/application/clientMovementUseCases";
import { PrismaClientMovementsRepository } from "../features/client-movements/infrastructure/prismaClientMovementsRepository";

export const clientMovementsRouter = Router({ mergeParams: true });

const clientMovementsRepository = new PrismaClientMovementsRepository();
const createClientMovementUseCase = new CreateClientMovementUseCase(clientMovementsRepository);
const listClientMovementsUseCase = new ListClientMovementsUseCase(clientMovementsRepository);

clientMovementsRouter.use(authenticateToken);

clientMovementsRouter.post(
  "/",
  validateBody(createMovementBodySchema),
  async (
    req: Request<{ id: string }, MovementResponse | ApiErrorResponse, CreateMovementBody>,
    res: Response<MovementResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const clientId = parseInt(req.params.id, 10);
    if (isNaN(clientId)) {
      res.status(400).json({ error: "Invalid client ID" });
      return;
    }

    try {
      const result = await createClientMovementUseCase.execute(clientId, req.body);
      if (result.kind === "client-not-found") {
        res.status(404).json({ error: "Client not found" });
        return;
      }
      if (result.kind === "reference-order-not-found") {
        res.status(400).json({ error: "Referencia order not found" });
        return;
      }
      if (result.kind === "reference-order-client-mismatch") {
        res.status(400).json({ error: "Referencia order does not belong to this client" });
        return;
      }

      res.status(201).json(result.movement);
    } catch (err) {
      console.error("[create movement]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

clientMovementsRouter.get(
  "/",
  async (
    req: Request<{ id: string }, MovementListResponse | ApiErrorResponse>,
    res: Response<MovementListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const clientId = parseInt(req.params.id, 10);
    if (isNaN(clientId)) {
      res.status(400).json({ error: "Invalid client ID" });
      return;
    }

    const result = await listClientMovementsUseCase.execute(clientId);
    if (result.kind === "client-not-found") {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    res.json(result.movements);
  },
);

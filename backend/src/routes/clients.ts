import { Router, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  createClientBodySchema,
  updateClientBodySchema,
  listClientsQuerySchema,
  type CreateClientBody,
  type UpdateClientBody,
  type ListClientsQuery,
} from "../validation/clientSchemas";
import type {
  ClientResponse,
  ClientListResponse,
  ClientDetailResponse,
} from "../types/clients";
import type { ApiErrorResponse } from "../types/auth";
import {
  CreateClientUseCase,
  DisableClientUseCase,
  GetClientDetailUseCase,
  ListClientsUseCase,
  UpdateClientUseCase,
} from "../features/clients/application/clientUseCases";
import { PrismaClientsRepository } from "../features/clients/infrastructure/prismaClientsRepository";

export const clientsRouter = Router();

const clientsRepository = new PrismaClientsRepository();
const createClientUseCase = new CreateClientUseCase(clientsRepository);
const listClientsUseCase = new ListClientsUseCase(clientsRepository);
const getClientDetailUseCase = new GetClientDetailUseCase(clientsRepository);
const updateClientUseCase = new UpdateClientUseCase(clientsRepository);
const disableClientUseCase = new DisableClientUseCase(clientsRepository);

clientsRouter.use(authenticateToken);

clientsRouter.post(
  "/",
  validateBody(createClientBodySchema),
  async (
    req: Request<unknown, ClientResponse | ApiErrorResponse, CreateClientBody>,
    res: Response<ClientResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const result = await createClientUseCase.execute(req.body);
      if (result.kind === "duplicate-cuit") {
        res.status(409).json({ error: "CUIT already registered" });
        return;
      }

      res.status(201).json(result.client);
    } catch (err) {
      console.error("[create client]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

clientsRouter.get(
  "/",
  async (
    req: Request<unknown, ClientListResponse | ApiErrorResponse, unknown, ListClientsQuery>,
    res: Response<ClientListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const queryResult = listClientsQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({
        error: "Validation failed",
        details: queryResult.error.flatten(),
      });
      return;
    }
    const { status } = queryResult.data;
    const clients = await listClientsUseCase.execute({ status });
    res.json(clients);
  },
);

clientsRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, ClientDetailResponse | ApiErrorResponse>,
    res: Response<ClientDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid client ID" });
      return;
    }

    const result = await getClientDetailUseCase.execute(id);
    if (result.kind === "not-found") {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    res.json(result.client);
  },
);

clientsRouter.patch(
  "/:id",
  validateBody(updateClientBodySchema),
  async (
    req: Request<{ id: string }, ClientResponse | ApiErrorResponse, UpdateClientBody>,
    res: Response<ClientResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid client ID" });
      return;
    }
    try {
      const result = await updateClientUseCase.execute(id, req.body);
      if (result.kind === "not-found") {
        res.status(404).json({ error: "Client not found" });
        return;
      }

      res.json(result.client);
    } catch (err) {
      console.error("[update client]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

clientsRouter.delete(
  "/:id",
  async (
    req: Request<{ id: string }, ClientResponse | ApiErrorResponse>,
    res: Response<ClientResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid client ID" });
      return;
    }
    try {
      const result = await disableClientUseCase.execute(id);
      if (result.kind === "not-found") {
        res.status(404).json({ error: "Client not found" });
        return;
      }

      res.json(result.client);
    } catch (err) {
      console.error("[disable client]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

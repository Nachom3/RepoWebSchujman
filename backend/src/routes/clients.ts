import { Router, type Request, type Response } from "express";
import prismaPkg from "@prisma/client";
const { Prisma } = prismaPkg;
import { prisma } from "../db/prisma";
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

export const clientsRouter = Router();

clientsRouter.use(authenticateToken);

clientsRouter.post(
  "/",
  validateBody(createClientBodySchema),
  async (
    req: Request<unknown, ClientResponse | ApiErrorResponse, CreateClientBody>,
    res: Response<ClientResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const client = await prisma.client.create({
        data: req.body,
        select: {
          id: true,
          cuit: true,
          razonSocial: true,
          saldo: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.status(201).json(client);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        res.status(409).json({ error: "CUIT already registered" });
        return;
      }
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
    const where = status ? { status } : undefined;
    const clients = await prisma.client.findMany({
      where,
      select: {
        id: true,
        cuit: true,
        razonSocial: true,
        saldo: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
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
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        movements: {
          orderBy: { fecha: "desc" },
          select: {
            id: true,
            tipo: true,
            monto: true,
            fecha: true,
            referencia: true,
          },
        },
        orders: {
          select: {
            id: true,
            quantity: true,
            status: true,
            deliveryDate: true,
          },
        },
      },
    });
    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }
    res.json(client);
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
      const client = await prisma.client.update({
        where: { id },
        data: req.body,
        select: {
          id: true,
          cuit: true,
          razonSocial: true,
          saldo: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.json(client);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        res.status(404).json({ error: "Client not found" });
        return;
      }
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
      const client = await prisma.client.update({
        where: { id },
        data: { status: "disabled" },
        select: {
          id: true,
          cuit: true,
          razonSocial: true,
          saldo: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.json(client);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        res.status(404).json({ error: "Client not found" });
        return;
      }
      console.error("[disable client]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);
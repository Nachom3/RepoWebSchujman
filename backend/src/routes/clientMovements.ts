import { Router, type Request, type Response } from "express";
import { prisma } from "../db/prisma";
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

export const clientMovementsRouter = Router({ mergeParams: true });

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

    const { tipo, monto, referencia } = req.body;

    try {
      const client = await prisma.client.findUnique({
        where: { id: clientId },
        select: { id: true, saldo: true },
      });
      if (!client) {
        res.status(404).json({ error: "Client not found" });
        return;
      }

      if (tipo === "CREDITO" && referencia && /^\d+$/.test(referencia)) {
        const orderId = parseInt(referencia, 10);
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          select: { id: true, clientId: true },
        });
        if (!order) {
          res.status(400).json({ error: "Referencia order not found" });
          return;
        }
        if (order.clientId !== clientId) {
          res.status(400).json({ error: "Referencia order does not belong to this client" });
          return;
        }
      }

      const newSaldo =
        tipo === "DEBITO" ? client.saldo + monto : client.saldo - monto;

      const [movement] = await prisma.$transaction([
        prisma.cuentaCorrienteMovimiento.create({
          data: {
            tipo,
            monto,
            clientId,
            referencia,
          },
        }),
        prisma.client.update({
          where: { id: clientId },
          data: { saldo: newSaldo },
        }),
      ]);

      res.status(201).json(movement);
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

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true },
    });
    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    const movements = await prisma.cuentaCorrienteMovimiento.findMany({
      where: { clientId },
      orderBy: { fecha: "desc" },
      select: {
        id: true,
        tipo: true,
        monto: true,
        fecha: true,
        referencia: true,
        clientId: true,
      },
    });
    res.json(movements);
  },
);
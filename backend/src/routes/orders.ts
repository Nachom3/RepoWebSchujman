import { Router, type Request, type Response } from "express";
import prismaPkg from "@prisma/client";
const { Prisma } = prismaPkg;
import { prisma } from "../db/prisma";
import { authenticateToken } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  createOrderBodySchema,
  updateOrderBodySchema,
  listOrdersQuerySchema,
  type CreateOrderBody,
  type UpdateOrderBody,
  type ListOrdersQuery,
} from "../validation/orderSchemas";
import type {
  OrderResponse,
  OrderDetailResponse,
  OrderListResponse,
} from "../types/orders";
import type { ApiErrorResponse } from "../types/auth";

export const ordersRouter = Router();

ordersRouter.use(authenticateToken);

ordersRouter.post(
  "/",
  validateBody(createOrderBodySchema),
  async (
    req: Request<unknown, OrderDetailResponse | ApiErrorResponse, CreateOrderBody>,
    res: Response<OrderDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const { clientId, formulaId, quantity, deliveryDate } = req.body;

      const [client, formula] = await Promise.all([
        prisma.client.findUnique({ where: { id: clientId } }),
        prisma.formula.findUnique({ where: { id: formulaId } }),
      ]);

      if (!client) {
        res.status(404).json({ error: "Client not found" });
        return;
      }
      if (!formula) {
        res.status(404).json({ error: "Formula not found" });
        return;
      }

      const order = await prisma.order.create({
        data: {
          clientId,
          formulaId,
          quantity,
          priceSnapshot: formula.pricePerCubicMeter,
          deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
        },
        include: {
          client: { select: { id: true, razonSocial: true, cuit: true } },
          formula: { select: { id: true, name: true, pricePerCubicMeter: true } },
          truck: { select: { id: true, patente: true, capacity: true } },
        },
      });

      res.status(201).json(order);
    } catch (err) {
      console.error("[create order]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

ordersRouter.get(
  "/",
  async (
    req: Request<unknown, OrderListResponse | ApiErrorResponse, unknown, ListOrdersQuery>,
    res: Response<OrderListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const queryResult = listOrdersQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({
        error: "Validation failed",
        details: queryResult.error.flatten(),
      });
      return;
    }
    const { status, clientId } = queryResult.data;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    const orders = await prisma.order.findMany({
      where,
      select: {
        id: true,
        clientId: true,
        formulaId: true,
        truckId: true,
        quantity: true,
        priceSnapshot: true,
        status: true,
        createdAt: true,
        deliveryDate: true,
        completedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  },
);

ordersRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, OrderDetailResponse | ApiErrorResponse>,
    res: Response<OrderDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, razonSocial: true, cuit: true } },
        formula: { select: { id: true, name: true, pricePerCubicMeter: true } },
        truck: { select: { id: true, patente: true, capacity: true } },
      },
    });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  },
);

ordersRouter.patch(
  "/:id",
  validateBody(updateOrderBodySchema),
  async (
    req: Request<{ id: string }, OrderDetailResponse | ApiErrorResponse, UpdateOrderBody>,
    res: Response<OrderDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    try {
      const { truckId, ...rest } = req.body;

      if (truckId !== undefined) {
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
          res.status(404).json({ error: "Order not found" });
          return;
        }
        if (order.status !== "APROBADA") {
          res.status(409).json({ error: "Order must be APROBADA to assign truck" });
          return;
        }

        if (truckId !== null) {
          const truck = await prisma.truck.findUnique({ where: { id: truckId } });
          if (!truck) {
            res.status(404).json({ error: "Truck not found" });
            return;
          }
          if (truck.status !== "DISPONIBLE") {
            res.status(409).json({ error: "Truck is not available" });
            return;
          }

          const [updatedOrder] = await prisma.$transaction([
            prisma.order.update({
              where: { id },
              data: { truckId },
              include: {
                client: { select: { id: true, razonSocial: true, cuit: true } },
                formula: { select: { id: true, name: true, pricePerCubicMeter: true } },
                truck: { select: { id: true, patente: true, capacity: true } },
              },
            }),
            prisma.truck.update({
              where: { id: truckId },
              data: { status: "EN_RECORRIDO" },
            }),
          ]);
          res.json(updatedOrder);
          return;
        }
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: rest,
        include: {
          client: { select: { id: true, razonSocial: true, cuit: true } },
          formula: { select: { id: true, name: true, pricePerCubicMeter: true } },
          truck: { select: { id: true, patente: true, capacity: true } },
        },
      });
      res.json(updatedOrder);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      console.error("[update order]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

ordersRouter.post(
  "/:id/approve",
  async (
    req: Request<{ id: string }, OrderDetailResponse | ApiErrorResponse>,
    res: Response<OrderDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          formula: {
            include: {
              materials: true,
            },
          },
        },
      });

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      if (order.status !== "PENDIENTE") {
        res.status(409).json({ error: "Order must be PENDIENTE to approve" });
        return;
      }

      const payment = await prisma.cuentaCorrienteMovimiento.findFirst({
        where: {
          clientId: order.clientId,
          tipo: "CREDITO",
          referencia: String(id),
        },
      });

      if (!payment) {
        res.status(422).json({ error: "Payment required" });
        return;
      }

      const updatedOrder = await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id },
          data: { status: "APROBADA" },
        });

        for (const mat of order.formula.materials) {
          const decrement = (mat.kgPerCubicMeter * order.quantity) / 1000;
          const silo = await tx.siloStock.findUnique({ where: { id: mat.siloStockId } });
          if (!silo || silo.quantity < decrement) {
            throw new Error(`Insufficient stock: ${silo?.material ?? "unknown"}`);
          }
          await tx.siloStock.update({
            where: { id: mat.siloStockId },
            data: { quantity: { decrement } },
          });
        }

        return tx.order.findUnique({
          where: { id },
          include: {
            client: { select: { id: true, razonSocial: true, cuit: true } },
            formula: { select: { id: true, name: true, pricePerCubicMeter: true } },
            truck: { select: { id: true, patente: true, capacity: true } },
          },
        });
      });

      res.json(updatedOrder!);
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("Insufficient stock")) {
        res.status(422).json({ error: err.message });
        return;
      }
      console.error("[approve order]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

ordersRouter.post(
  "/:id/complete",
  async (
    req: Request<{ id: string }, OrderDetailResponse | ApiErrorResponse>,
    res: Response<OrderDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    try {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      if (order.status !== "APROBADA") {
        res.status(409).json({ error: "Order must be APROBADA to complete" });
        return;
      }

      const updatedOrder = await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id },
          data: { status: "COMPLETADA", completedAt: new Date() },
        });

        if (order.truckId) {
          await tx.truck.update({
            where: { id: order.truckId },
            data: { status: "DISPONIBLE" },
          });
        }

        return tx.order.findUnique({
          where: { id },
          include: {
            client: { select: { id: true, razonSocial: true, cuit: true } },
            formula: { select: { id: true, name: true, pricePerCubicMeter: true } },
            truck: { select: { id: true, patente: true, capacity: true } },
          },
        });
      });

      res.json(updatedOrder!);
    } catch (err) {
      console.error("[complete order]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

ordersRouter.delete(
  "/:id",
  async (
    req: Request<{ id: string }, OrderResponse | ApiErrorResponse>,
    res: Response<OrderResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    try {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      if (order.status !== "PENDIENTE") {
        res.status(409).json({ error: "Only PENDIENTE orders can be cancelled" });
        return;
      }

      const cancelled = await prisma.order.update({
        where: { id },
        data: { status: "CANCELADA" },
        select: {
          id: true,
          clientId: true,
          formulaId: true,
          truckId: true,
          quantity: true,
          priceSnapshot: true,
          status: true,
          createdAt: true,
          deliveryDate: true,
          completedAt: true,
        },
      });
      res.json(cancelled);
    } catch (err) {
      console.error("[cancel order]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

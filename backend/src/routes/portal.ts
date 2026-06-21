import { Router, type Request, type Response } from "express";
import crypto from "crypto";
import { prisma } from "../db/prisma";
import { authenticatePortal } from "../middleware/authenticatePortal";
import { validateBody } from "../middleware/validate";
import {
  portalLoginBodySchema,
  portalCreateOrderBodySchema,
  type PortalLoginBody,
  type PortalCreateOrderBody,
} from "../validation/portalSchemas";
import type {
  PortalLoginResponse,
  PortalOrderResponse,
  PortalOrderDetailResponse,
} from "../types/portal";
import type { ApiErrorResponse } from "../types/auth";

export const portalRouter = Router();

portalRouter.post(
  "/login",
  validateBody(portalLoginBodySchema),
  async (
    req: Request<
      unknown,
      PortalLoginResponse | ApiErrorResponse,
      PortalLoginBody
    >,
    res: Response<PortalLoginResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const { cuit } = req.body;
      const client = await prisma.client.findFirst({
        where: { cuit, status: "ACTIVE" },
        select: { id: true, razonSocial: true, cuit: true },
      });
      if (!client) {
        res
          .status(401)
          .json({ error: "Client not found or inactive" });
        return;
      }
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await prisma.portalSession.create({
        data: { clientId: client.id, token, expiresAt },
      });
      res.status(200).json({
        sessionToken: token,
        client: {
          id: client.id,
          razonSocial: client.razonSocial,
          cuit: client.cuit,
        },
      });
    } catch (err) {
      console.error("[portal login]", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

portalRouter.post(
  "/logout",
  authenticatePortal,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers["x-portal-token"] as string;
      await prisma.portalSession.deleteMany({ where: { token } });
      res.status(200).json({ message: "Logged out" });
    } catch (err) {
      console.error("[portal logout]", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

portalRouter.post(
  "/orders",
  authenticatePortal,
  validateBody(portalCreateOrderBodySchema),
  async (
    req: Request<
      unknown,
      PortalOrderResponse | ApiErrorResponse,
      PortalCreateOrderBody
    >,
    res: Response<PortalOrderResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const clientId = req.portalClientId!;
      const formula = await prisma.formula.findUnique({
        where: { id: req.body.formulaId },
        select: { id: true, pricePerCubicMeter: true },
      });
      if (!formula) {
        res.status(400).json({ error: "Invalid formula" });
        return;
      }
      const order = await prisma.order.create({
        data: {
          clientId,
          formulaId: req.body.formulaId,
          quantity: req.body.quantity,
          obraAddress: req.body.obraAddress,
          scheduledDate: req.body.scheduledDate
            ? new Date(req.body.scheduledDate)
            : null,
          status: "PENDIENTE",
          priceSnapshot: formula.pricePerCubicMeter,
        },
      });
      res.status(201).json({
        id: order.id,
        formulaId: order.formulaId,
        quantity: order.quantity,
        obraAddress: order.obraAddress,
        scheduledDate: order.scheduledDate?.toISOString() ?? null,
        priceSnapshot: order.priceSnapshot,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      });
    } catch (err) {
      console.error("[portal create order]", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

portalRouter.get(
  "/orders",
  authenticatePortal,
  async (
    req: Request,
    res: Response<PortalOrderResponse[] | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const clientId = req.portalClientId!;
      const orders = await prisma.order.findMany({
        where: { clientId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          formulaId: true,
          quantity: true,
          obraAddress: true,
          scheduledDate: true,
          priceSnapshot: true,
          status: true,
          createdAt: true,
          truckId: true,
          truck: { select: { id: true, patente: true } },
        },
      });
      res.json(
        orders.map((o) => ({
          id: o.id,
          formulaId: o.formulaId,
          quantity: o.quantity,
          obraAddress: o.obraAddress,
          scheduledDate: o.scheduledDate?.toISOString() ?? null,
          priceSnapshot: o.priceSnapshot,
          status: o.status,
          createdAt: o.createdAt.toISOString(),
          truck: o.truck ? { id: o.truck.id, patente: o.truck.patente } : null,
        })),
      );
    } catch (err) {
      console.error("[portal list orders]", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

portalRouter.get(
  "/orders/:id",
  authenticatePortal,
  async (
    req: Request<{ id: string }>,
    res: Response<PortalOrderDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const clientId = req.portalClientId!;
      const orderId = parseInt(req.params.id, 10);
      if (isNaN(orderId)) {
        res.status(400).json({ error: "Invalid order ID" });
        return;
      }
      const order = await prisma.order.findFirst({
        where: { id: orderId, clientId },
      });
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json({
        id: order.id,
        formulaId: order.formulaId,
        quantity: order.quantity,
        obraAddress: order.obraAddress,
        scheduledDate: order.scheduledDate?.toISOString() ?? null,
        priceSnapshot: order.priceSnapshot,
        status: order.status,
        truck: null,
        createdAt: order.createdAt.toISOString(),
        completedAt: null,
        statusHistory: [{ status: order.status, timestamp: order.createdAt.toISOString() }],
      });
    } catch (err) {
      console.error("[portal get order]", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

import { Router, type Request, type Response } from "express";
import prismaPkg from "@prisma/client";
const { Prisma } = prismaPkg;
import { prisma } from "../db/prisma";
import { authenticateToken } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  createTruckBodySchema,
  updateTruckBodySchema,
  type CreateTruckBody,
  type UpdateTruckBody,
} from "../validation/truckSchemas";
import type { TruckResponse, TruckListResponse } from "../types/trucks";
import type { ApiErrorResponse } from "../types/auth";

export const trucksRouter = Router();

trucksRouter.use(authenticateToken);

trucksRouter.post(
  "/",
  validateBody(createTruckBodySchema),
  async (
    req: Request<unknown, TruckResponse | ApiErrorResponse, CreateTruckBody>,
    res: Response<TruckResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const truck = await prisma.truck.create({
        data: req.body,
        select: { id: true, patente: true, capacity: true, status: true },
      });
      res.status(201).json(truck);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        res.status(409).json({ error: "Patente already registered" });
        return;
      }
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
    const trucks = await prisma.truck.findMany({
      select: { id: true, patente: true, capacity: true, status: true },
      orderBy: { patente: "asc" },
    });
    res.json(trucks);
  },
);

trucksRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, TruckResponse | ApiErrorResponse>,
    res: Response<TruckResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid truck ID" });
      return;
    }
    const truck = await prisma.truck.findUnique({
      where: { id },
      select: { id: true, patente: true, capacity: true, status: true },
    });
    if (!truck) {
      res.status(404).json({ error: "Truck not found" });
      return;
    }
    res.json(truck);
  },
);

trucksRouter.patch(
  "/:id",
  validateBody(updateTruckBodySchema),
  async (
    req: Request<{ id: string }, TruckResponse | ApiErrorResponse, UpdateTruckBody>,
    res: Response<TruckResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid truck ID" });
      return;
    }
    try {
      const truck = await prisma.truck.update({
        where: { id },
        data: req.body,
        select: { id: true, patente: true, capacity: true, status: true },
      });
      res.json(truck);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        res.status(404).json({ error: "Truck not found" });
        return;
      }
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        res.status(409).json({ error: "Patente already registered" });
        return;
      }
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
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid truck ID" });
      return;
    }

    try {
      const truck = await prisma.truck.findUnique({ where: { id } });
      if (!truck) {
        res.status(404).json({ error: "Truck not found" });
        return;
      }

      const newStatus = truck.status === "DISPONIBLE" ? "EN_RECORRIDO" : "DISPONIBLE";
      const updated = await prisma.truck.update({
        where: { id },
        data: { status: newStatus },
        select: { id: true, patente: true, capacity: true, status: true },
      });
      res.json(updated);
    } catch (err) {
      console.error("[toggle truck status]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

trucksRouter.delete(
  "/:id",
  async (
    req: Request<{ id: string }, TruckResponse | ApiErrorResponse>,
    res: Response<TruckResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid truck ID" });
      return;
    }
    try {
      const truck = await prisma.truck.delete({
        where: { id },
        select: { id: true, patente: true, capacity: true, status: true },
      });
      res.json(truck);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        res.status(404).json({ error: "Truck not found" });
        return;
      }
      console.error("[delete truck]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

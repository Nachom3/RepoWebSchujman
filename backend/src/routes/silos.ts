import { Router, type Request, type Response } from "express";
import prismaPkg from "@prisma/client";
const { Prisma } = prismaPkg;
import { prisma } from "../db/prisma";
import { authenticateToken } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  createSiloBodySchema,
  updateSiloBodySchema,
  type CreateSiloBody,
  type UpdateSiloBody,
} from "../validation/siloSchemas";
import type { SiloResponse, SiloListResponse } from "../types/silos";
import type { ApiErrorResponse } from "../types/auth";

export const silosRouter = Router();

silosRouter.use(authenticateToken);

silosRouter.post(
  "/",
  validateBody(createSiloBodySchema),
  async (
    req: Request<unknown, SiloResponse | ApiErrorResponse, CreateSiloBody>,
    res: Response<SiloResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const silo = await prisma.siloStock.create({ data: req.body });
      res.status(201).json({ ...silo, isLow: silo.quantity < silo.alertMin });
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
    const silos = await prisma.siloStock.findMany({
      orderBy: { material: "asc" },
    });
    res.json(
      silos.map((s) => ({
        id: s.id,
        material: s.material,
        quantity: s.quantity,
        unit: s.unit,
        alertMin: s.alertMin,
        isLow: s.quantity < s.alertMin,
      })),
    );
  },
);

silosRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, SiloResponse | ApiErrorResponse>,
    res: Response<SiloResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid silo ID" });
      return;
    }
    const silo = await prisma.siloStock.findUnique({ where: { id } });
    if (!silo) {
      res.status(404).json({ error: "Silo not found" });
      return;
    }
    res.json({ ...silo, isLow: silo.quantity < silo.alertMin });
  },
);

silosRouter.patch(
  "/:id",
  validateBody(updateSiloBodySchema),
  async (
    req: Request<{ id: string }, SiloResponse | ApiErrorResponse, UpdateSiloBody>,
    res: Response<SiloResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid silo ID" });
      return;
    }
    try {
      const silo = await prisma.siloStock.update({
        where: { id },
        data: req.body,
      });
      res.json({ ...silo, isLow: silo.quantity < silo.alertMin });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        res.status(404).json({ error: "Silo not found" });
        return;
      }
      console.error("[update silo]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

silosRouter.delete(
  "/:id",
  async (
    req: Request<{ id: string }, SiloResponse | ApiErrorResponse>,
    res: Response<SiloResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid silo ID" });
      return;
    }
    try {
      const silo = await prisma.siloStock.delete({ where: { id } });
      res.json({ ...silo, isLow: silo.quantity < silo.alertMin });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        res.status(404).json({ error: "Silo not found" });
        return;
      }
      console.error("[delete silo]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

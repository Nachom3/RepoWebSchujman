import { Router, type Request, type Response } from "express";
import prismaPkg from "@prisma/client";
const { Prisma } = prismaPkg;
import { prisma } from "../db/prisma";
import { authenticateToken } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  createFormulaBodySchema,
  updateFormulaBodySchema,
  addMaterialBodySchema,
  type CreateFormulaBody,
  type UpdateFormulaBody,
  type AddMaterialBody,
} from "../validation/formulaSchemas";
import type {
  FormulaResponse,
  FormulaDetailResponse,
  FormulaListResponse,
  FormulaMaterialResponse,
} from "../types/formulas";
import type { ApiErrorResponse } from "../types/auth";

export const formulasRouter = Router();

formulasRouter.use(authenticateToken);

formulasRouter.post(
  "/",
  validateBody(createFormulaBodySchema),
  async (
    req: Request<unknown, FormulaDetailResponse | ApiErrorResponse, CreateFormulaBody>,
    res: Response<FormulaDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const formula = await prisma.formula.create({
        data: req.body,
        include: {
          materials: {
            include: {
              siloStock: { select: { id: true, material: true, unit: true } },
            },
          },
        },
      });
      res.status(201).json(formula);
    } catch (err) {
      console.error("[create formula]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

formulasRouter.get(
  "/",
  async (
    _req: Request,
    res: Response<FormulaListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const formulas = await prisma.formula.findMany({
      select: {
        id: true,
        name: true,
        recipe: true,
        pricePerCubicMeter: true,
      },
      orderBy: { name: "asc" },
    });
    res.json(formulas);
  },
);

formulasRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, FormulaDetailResponse | ApiErrorResponse>,
    res: Response<FormulaDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid formula ID" });
      return;
    }
    const formula = await prisma.formula.findUnique({
      where: { id },
      include: {
        materials: {
          include: {
            siloStock: { select: { id: true, material: true, unit: true } },
          },
        },
      },
    });
    if (!formula) {
      res.status(404).json({ error: "Formula not found" });
      return;
    }
    res.json(formula);
  },
);

formulasRouter.patch(
  "/:id",
  validateBody(updateFormulaBodySchema),
  async (
    req: Request<{ id: string }, FormulaDetailResponse | ApiErrorResponse, UpdateFormulaBody>,
    res: Response<FormulaDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid formula ID" });
      return;
    }
    try {
      const formula = await prisma.formula.update({
        where: { id },
        data: req.body,
        include: {
          materials: {
            include: {
              siloStock: { select: { id: true, material: true, unit: true } },
            },
          },
        },
      });
      res.json(formula);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        res.status(404).json({ error: "Formula not found" });
        return;
      }
      console.error("[update formula]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

formulasRouter.delete(
  "/:id",
  async (
    req: Request<{ id: string }, FormulaResponse | ApiErrorResponse>,
    res: Response<FormulaResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid formula ID" });
      return;
    }
    try {
      await prisma.formulaMaterial.deleteMany({ where: { formulaId: id } });
      const formula = await prisma.formula.delete({
        where: { id },
        select: { id: true, name: true, recipe: true, pricePerCubicMeter: true },
      });
      res.json(formula);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        res.status(404).json({ error: "Formula not found" });
        return;
      }
      console.error("[delete formula]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

formulasRouter.post(
  "/:id/materials",
  validateBody(addMaterialBodySchema),
  async (
    req: Request<{ id: string }, FormulaMaterialResponse | ApiErrorResponse, AddMaterialBody>,
    res: Response<FormulaMaterialResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const formulaId = parseInt(req.params.id, 10);
    if (isNaN(formulaId)) {
      res.status(400).json({ error: "Invalid formula ID" });
      return;
    }

    const formula = await prisma.formula.findUnique({ where: { id: formulaId } });
    if (!formula) {
      res.status(404).json({ error: "Formula not found" });
      return;
    }

    const silo = await prisma.siloStock.findUnique({ where: { id: req.body.siloStockId } });
    if (!silo) {
      res.status(404).json({ error: "SiloStock not found" });
      return;
    }

    try {
      const material = await prisma.formulaMaterial.create({
        data: { formulaId, ...req.body },
        include: {
          siloStock: { select: { id: true, material: true, unit: true } },
        },
      });
      res.status(201).json(material);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        res.status(409).json({ error: "Material already linked to this formula" });
        return;
      }
      console.error("[add material]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

formulasRouter.delete(
  "/:id/materials/:materialId",
  async (
    req: Request<{ id: string; materialId: string }, FormulaResponse | ApiErrorResponse>,
    res: Response<FormulaResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const formulaId = parseInt(req.params.id, 10);
    const materialId = parseInt(req.params.materialId, 10);
    if (isNaN(formulaId) || isNaN(materialId)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    try {
      await prisma.formulaMaterial.delete({
        where: { id: materialId },
      });
      res.status(204).send();
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        res.status(404).json({ error: "Material not found" });
        return;
      }
      console.error("[delete material]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

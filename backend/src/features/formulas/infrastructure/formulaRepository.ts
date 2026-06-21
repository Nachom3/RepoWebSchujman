import prismaPkg from "@prisma/client";

import { prisma } from "../../../db/prisma";
import type {
  AddFormulaMaterialDto,
  CreateFormulaDto,
  FormulaDetailResponse,
  FormulaListResponse,
  FormulaMaterialResponse,
  FormulaResponse,
  UpdateFormulaDto,
} from "../../../types/formulas";

const { Prisma } = prismaPkg;

const formulaSelect = {
  id: true,
  name: true,
  recipe: true,
  pricePerCubicMeter: true,
};

const formulaDetailInclude = {
  materials: {
    include: {
      siloStock: { select: { id: true, material: true, unit: true } },
    },
  },
};

const formulaMaterialInclude = {
  siloStock: { select: { id: true, material: true, unit: true } },
};

function isKnownPrismaError(err: unknown, code: string): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === code;
}

export async function createFormula(
  data: CreateFormulaDto,
): Promise<FormulaDetailResponse> {
  return prisma.formula.create({ data, include: formulaDetailInclude });
}

export async function listFormulas(): Promise<FormulaListResponse> {
  return prisma.formula.findMany({
    select: formulaSelect,
    orderBy: { name: "asc" },
  });
}

export async function findFormulaById(
  id: number,
): Promise<FormulaDetailResponse | null> {
  return prisma.formula.findUnique({
    where: { id },
    include: formulaDetailInclude,
  });
}

export async function updateFormula(
  id: number,
  data: UpdateFormulaDto,
): Promise<FormulaDetailResponse | null> {
  try {
    return await prisma.formula.update({
      where: { id },
      data,
      include: formulaDetailInclude,
    });
  } catch (err) {
    if (isKnownPrismaError(err, "P2025")) {
      return null;
    }
    throw err;
  }
}

export async function deleteFormulaWithMaterials(
  id: number,
): Promise<FormulaResponse | null> {
  try {
    return await prisma.$transaction(async (tx) => {
      await tx.formulaMaterial.deleteMany({ where: { formulaId: id } });
      return tx.formula.delete({ where: { id }, select: formulaSelect });
    });
  } catch (err) {
    if (isKnownPrismaError(err, "P2025")) {
      return null;
    }
    throw err;
  }
}

export async function formulaExists(id: number): Promise<boolean> {
  const formula = await prisma.formula.findUnique({
    where: { id },
    select: { id: true },
  });
  return formula !== null;
}

export async function siloStockExists(id: number): Promise<boolean> {
  const silo = await prisma.siloStock.findUnique({
    where: { id },
    select: { id: true },
  });
  return silo !== null;
}

export async function createFormulaMaterial(
  formulaId: number,
  data: AddFormulaMaterialDto,
): Promise<
  | { type: "created"; material: FormulaMaterialResponse }
  | { type: "already_linked" }
> {
  try {
    const material = await prisma.formulaMaterial.create({
      data: { formulaId, ...data },
      include: formulaMaterialInclude,
    });
    return { type: "created", material };
  } catch (err) {
    if (isKnownPrismaError(err, "P2002")) {
      return { type: "already_linked" };
    }
    throw err;
  }
}

export async function deleteFormulaMaterial(materialId: number): Promise<boolean> {
  try {
    await prisma.formulaMaterial.delete({ where: { id: materialId } });
    return true;
  } catch (err) {
    if (isKnownPrismaError(err, "P2025")) {
      return false;
    }
    throw err;
  }
}

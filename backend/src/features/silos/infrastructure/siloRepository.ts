import prismaPkg from "@prisma/client";

import { prisma } from "../../../db/prisma";
import type { CreateSiloDto, UpdateSiloDto } from "../../../types/silos";
import type { SiloRecord } from "../application/siloUseCases";

const { Prisma } = prismaPkg;

function isNotFoundError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
}

export async function createSilo(data: CreateSiloDto): Promise<SiloRecord> {
  return prisma.siloStock.create({ data });
}

export async function listSilos(): Promise<SiloRecord[]> {
  return prisma.siloStock.findMany({ orderBy: { material: "asc" } });
}

export async function findSiloById(id: number): Promise<SiloRecord | null> {
  return prisma.siloStock.findUnique({ where: { id } });
}

export async function updateSilo(
  id: number,
  data: UpdateSiloDto,
): Promise<SiloRecord | null> {
  try {
    return await prisma.siloStock.update({ where: { id }, data });
  } catch (err) {
    if (isNotFoundError(err)) {
      return null;
    }
    throw err;
  }
}

export async function deleteSilo(id: number): Promise<SiloRecord | null> {
  try {
    return await prisma.siloStock.delete({ where: { id } });
  } catch (err) {
    if (isNotFoundError(err)) {
      return null;
    }
    throw err;
  }
}

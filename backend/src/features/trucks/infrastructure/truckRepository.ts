import prismaPkg from "@prisma/client";

import { prisma } from "../../../db/prisma";
import type {
  CreateTruckDto,
  TruckResponse,
  TruckStatus,
  UpdateTruckDto,
} from "../../../types/trucks";

const { Prisma } = prismaPkg;

const truckSelect = {
  id: true,
  patente: true,
  capacity: true,
  status: true,
};

function isKnownPrismaError(err: unknown, code: string): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === code;
}

export async function createTruck(
  data: CreateTruckDto,
): Promise<{ type: "created"; truck: TruckResponse } | { type: "patente_conflict" }> {
  try {
    const truck = await prisma.truck.create({ data, select: truckSelect });
    return { type: "created", truck };
  } catch (err) {
    if (isKnownPrismaError(err, "P2002")) {
      return { type: "patente_conflict" };
    }
    throw err;
  }
}

export async function listTrucks(): Promise<TruckResponse[]> {
  return prisma.truck.findMany({
    select: truckSelect,
    orderBy: { patente: "asc" },
  });
}

export async function findTruckById(id: number): Promise<TruckResponse | null> {
  return prisma.truck.findUnique({ where: { id }, select: truckSelect });
}

export async function updateTruck(
  id: number,
  data: UpdateTruckDto,
): Promise<
  | { type: "updated"; truck: TruckResponse }
  | { type: "not_found" }
  | { type: "patente_conflict" }
> {
  try {
    const truck = await prisma.truck.update({ where: { id }, data, select: truckSelect });
    return { type: "updated", truck };
  } catch (err) {
    if (isKnownPrismaError(err, "P2025")) {
      return { type: "not_found" };
    }
    if (isKnownPrismaError(err, "P2002")) {
      return { type: "patente_conflict" };
    }
    throw err;
  }
}

export async function updateTruckStatus(
  id: number,
  status: TruckStatus,
): Promise<TruckResponse | null> {
  try {
    return await prisma.truck.update({
      where: { id },
      data: { status },
      select: truckSelect,
    });
  } catch (err) {
    if (isKnownPrismaError(err, "P2025")) {
      return null;
    }
    throw err;
  }
}

export async function deleteTruck(id: number): Promise<TruckResponse | null> {
  try {
    return await prisma.truck.delete({ where: { id }, select: truckSelect });
  } catch (err) {
    if (isKnownPrismaError(err, "P2025")) {
      return null;
    }
    throw err;
  }
}

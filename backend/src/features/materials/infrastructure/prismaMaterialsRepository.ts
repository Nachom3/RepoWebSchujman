import prismaPkg from "@prisma/client";
import { prisma } from "../../../db/prisma";
import type {
  CreateMaterialInput,
  MaterialRecord,
  MaterialsRepository,
  UpdateMaterialInput,
} from "../application/materialUseCases";

const { Prisma } = prismaPkg;

function isNotFoundError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
}

function isUniqueConstraintError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

export class PrismaMaterialsRepository implements MaterialsRepository {
  create(input: CreateMaterialInput): Promise<MaterialRecord> {
    const minStock = input.minStock ?? input.alertMin ?? 0;
    const alertMin = input.alertMin ?? input.minStock ?? 0;
    return prisma.material.create({
      data: {
        name: input.name,
        category: input.category,
        unit: input.unit ?? "UNIDAD",
        stock: input.stock ?? 0,
        alertMin,
        minStock,
        unitCost: input.unitCost ?? 0,
        location: input.location,
        supplierId: input.supplierId ?? null,
        notes: input.notes,
      },
      include: { supplier: { select: { id: true, name: true } } },
    });
  }

  list(): Promise<MaterialRecord[]> {
    return prisma.material.findMany({
      orderBy: { name: "asc" },
      include: { supplier: { select: { id: true, name: true } } },
    });
  }

  findById(id: number): Promise<MaterialRecord | null> {
    return prisma.material.findUnique({
      where: { id },
      include: { supplier: { select: { id: true, name: true } } },
    });
  }

  async update(id: number, input: UpdateMaterialInput): Promise<MaterialRecord> {
    try {
      const data: prismaPkg.Prisma.MaterialUpdateInput = {};
      if (input.name !== undefined) data.name = input.name;
      if (input.category !== undefined) data.category = input.category;
      if (input.unit !== undefined) data.unit = input.unit;
      if (input.stock !== undefined) data.stock = input.stock;
      if (input.alertMin !== undefined) {
        data.alertMin = input.alertMin;
        if (input.minStock === undefined) data.minStock = input.alertMin;
      }
      if (input.minStock !== undefined) {
        data.minStock = input.minStock;
        if (input.alertMin === undefined) data.alertMin = input.minStock;
      }
      if (input.unitCost !== undefined) data.unitCost = input.unitCost;
      if (input.location !== undefined) data.location = input.location;
      if (input.supplierId !== undefined) {
        data.supplier =
          input.supplierId === null
            ? { disconnect: true }
            : { connect: { id: input.supplierId } };
      }
      if (input.notes !== undefined) data.notes = input.notes;

      return await prisma.material.update({
        where: { id },
        data,
        include: { supplier: { select: { id: true, name: true } } },
      });
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("MATERIAL_NOT_FOUND");
      }
      if (isUniqueConstraintError(err)) {
        throw new Error("DUPLICATE_NAME");
      }
      throw err;
    }
  }

  async delete(id: number): Promise<MaterialRecord> {
    try {
      return await prisma.material.delete({
        where: { id },
        include: { supplier: { select: { id: true, name: true } } },
      });
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("MATERIAL_NOT_FOUND");
      }
      throw err;
    }
  }

  async existsByName(name: string, excludeId?: number): Promise<boolean> {
    const found = await prisma.material.findFirst({
      where: { name, NOT: excludeId ? { id: excludeId } : undefined },
      select: { id: true },
    });
    return found !== null;
  }

  async supplierExists(id: number): Promise<boolean> {
    const found = await prisma.supplier.findUnique({ where: { id }, select: { id: true } });
    return found !== null;
  }
}

import prismaPkg from "@prisma/client";
import { prisma } from "../../../db/prisma";
import type {
  CreateSupplierInput,
  SupplierRecord,
  SuppliersRepository,
  UpdateSupplierInput,
} from "../application/supplierUseCases";

const { Prisma } = prismaPkg;

function isNotFoundError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
}

export class PrismaSuppliersRepository implements SuppliersRepository {
  create(input: CreateSupplierInput): Promise<SupplierRecord> {
    return prisma.supplier.create({
      data: {
        name: input.name,
        taxId: input.taxId,
        contactName: input.contactName,
        email: input.email,
        phone: input.phone,
        website: input.website,
        address: input.address,
        category: input.category,
        paymentTerms: input.paymentTerms,
        notes: input.notes,
      },
    });
  }

  list(): Promise<SupplierRecord[]> {
    return prisma.supplier.findMany({ orderBy: { name: "asc" } });
  }

  findById(id: number): Promise<SupplierRecord | null> {
    return prisma.supplier.findUnique({ where: { id } });
  }

  async update(id: number, input: UpdateSupplierInput): Promise<SupplierRecord> {
    try {
      const data: prismaPkg.Prisma.SupplierUpdateInput = {};
      if (input.name !== undefined) data.name = input.name;
      if (input.taxId !== undefined) data.taxId = input.taxId;
      if (input.contactName !== undefined) data.contactName = input.contactName;
      if (input.email !== undefined) data.email = input.email;
      if (input.phone !== undefined) data.phone = input.phone;
      if (input.website !== undefined) data.website = input.website;
      if (input.address !== undefined) data.address = input.address;
      if (input.category !== undefined) data.category = input.category;
      if (input.paymentTerms !== undefined) data.paymentTerms = input.paymentTerms;
      if (input.notes !== undefined) data.notes = input.notes;
      return await prisma.supplier.update({ where: { id }, data });
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("SUPPLIER_NOT_FOUND");
      }
      throw err;
    }
  }

  async delete(id: number): Promise<SupplierRecord> {
    try {
      return await prisma.supplier.delete({ where: { id } });
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("SUPPLIER_NOT_FOUND");
      }
      throw err;
    }
  }

  async countMaterialsFor(supplierId: number): Promise<number> {
    return prisma.material.count({ where: { supplierId } });
  }
}

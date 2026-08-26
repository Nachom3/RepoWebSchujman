import type { Supplier } from "@prisma/client";

export type SupplierRecord = Supplier;

export type SupplierResponse = Supplier & {
  materialsCount: number;
};

export type CreateSupplierInput = {
  name: string;
  taxId?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  category?: string;
  paymentTerms?: string;
  notes?: string;
};

export type UpdateSupplierInput = Partial<CreateSupplierInput>;

export type SuppliersRepository = {
  create(input: CreateSupplierInput): Promise<SupplierRecord>;
  list(): Promise<SupplierRecord[]>;
  findById(id: number): Promise<SupplierRecord | null>;
  update(id: number, input: UpdateSupplierInput): Promise<SupplierRecord>;
  delete(id: number): Promise<SupplierRecord>;
  countMaterialsFor(supplierId: number): Promise<number>;
};

export class SupplierNotFoundError extends Error {
  constructor() {
    super("Supplier not found");
  }
}

export class CreateSupplierUseCase {
  constructor(private readonly suppliers: SuppliersRepository) {}

  async execute(input: CreateSupplierInput): Promise<SupplierResponse> {
    const record = await this.suppliers.create(input);
    const count = await this.suppliers.countMaterialsFor(record.id);
    return { ...record, materialsCount: count };
  }
}

export class ListSuppliersUseCase {
  constructor(private readonly suppliers: SuppliersRepository) {}

  async execute(): Promise<SupplierResponse[]> {
    const list = await this.suppliers.list();
    return Promise.all(
      list.map(async (supplier) => ({
        ...supplier,
        materialsCount: await this.suppliers.countMaterialsFor(supplier.id),
      })),
    );
  }
}

export class GetSupplierUseCase {
  constructor(private readonly suppliers: SuppliersRepository) {}

  async execute(id: number): Promise<SupplierResponse> {
    const supplier = await this.suppliers.findById(id);
    if (!supplier) {
      throw new SupplierNotFoundError();
    }
    const count = await this.suppliers.countMaterialsFor(supplier.id);
    return { ...supplier, materialsCount: count };
  }
}

export class UpdateSupplierUseCase {
  constructor(private readonly suppliers: SuppliersRepository) {}

  async execute(id: number, input: UpdateSupplierInput): Promise<SupplierResponse> {
    try {
      const supplier = await this.suppliers.update(id, input);
      const count = await this.suppliers.countMaterialsFor(id);
      return { ...supplier, materialsCount: count };
    } catch {
      throw new SupplierNotFoundError();
    }
  }
}

export class DeleteSupplierUseCase {
  constructor(private readonly suppliers: SuppliersRepository) {}

  async execute(id: number): Promise<SupplierResponse> {
    try {
      const supplier = await this.suppliers.delete(id);
      return { ...supplier, materialsCount: 0 };
    } catch {
      throw new SupplierNotFoundError();
    }
  }
}

import type { Material, Supplier } from "@prisma/client";

export type MaterialUnit =
  | "KG"
  | "TN"
  | "M3"
  | "LT"
  | "UNIDAD"
  | "BOLSA"
  | "M2"
  | "ML"
  | "OTRO";

export type MaterialRecord = Material & {
  supplier: Pick<Supplier, "id" | "name"> | null;
};

export type MaterialResponse = MaterialRecord & {
  isLow: boolean;
};

export type CreateMaterialInput = {
  name: string;
  category?: string;
  unit?: MaterialUnit;
  stock?: number;
  alertMin?: number;
  minStock?: number;
  unitCost?: number;
  location?: string;
  supplierId?: number | null;
  notes?: string;
};

export type UpdateMaterialInput = Partial<CreateMaterialInput>;

export type MaterialsRepository = {
  create(input: CreateMaterialInput): Promise<MaterialRecord>;
  list(): Promise<MaterialRecord[]>;
  findById(id: number): Promise<MaterialRecord | null>;
  update(id: number, input: UpdateMaterialInput): Promise<MaterialRecord>;
  delete(id: number): Promise<MaterialRecord>;
  existsByName(name: string, excludeId?: number): Promise<boolean>;
  supplierExists(id: number): Promise<boolean>;
};

export class DuplicateMaterialNameError extends Error {
  constructor() {
    super("Material name already exists");
  }
}

export class MaterialNotFoundError extends Error {
  constructor() {
    super("Material not found");
  }
}

export class MaterialSupplierNotFoundError extends Error {
  constructor() {
    super("Supplier not found");
  }
}

function toResponse(record: MaterialRecord): MaterialResponse {
  return {
    ...record,
    isLow: record.stock < (record.alertMin > 0 ? record.alertMin : record.minStock),
  };
}

export class CreateMaterialUseCase {
  constructor(private readonly materials: MaterialsRepository) {}

  async execute(input: CreateMaterialInput): Promise<MaterialResponse> {
    if (await this.materials.existsByName(input.name)) {
      throw new DuplicateMaterialNameError();
    }
    if (input.supplierId && !(await this.materials.supplierExists(input.supplierId))) {
      throw new MaterialSupplierNotFoundError();
    }
    const created = await this.materials.create(input);
    const material = await this.materials.findById(created.id);
    if (!material) {
      throw new MaterialNotFoundError();
    }
    return toResponse(material);
  }
}

export class ListMaterialsUseCase {
  constructor(private readonly materials: MaterialsRepository) {}

  async execute(): Promise<MaterialResponse[]> {
    const list = await this.materials.list();
    return list.map(toResponse);
  }
}

export class GetMaterialUseCase {
  constructor(private readonly materials: MaterialsRepository) {}

  async execute(id: number): Promise<MaterialResponse> {
    const material = await this.materials.findById(id);
    if (!material) {
      throw new MaterialNotFoundError();
    }
    return toResponse(material);
  }
}

export class UpdateMaterialUseCase {
  constructor(private readonly materials: MaterialsRepository) {}

  async execute(id: number, input: UpdateMaterialInput): Promise<MaterialResponse> {
    if (input.name && (await this.materials.existsByName(input.name, id))) {
      throw new DuplicateMaterialNameError();
    }
    if (input.supplierId && !(await this.materials.supplierExists(input.supplierId))) {
      throw new MaterialSupplierNotFoundError();
    }
    try {
      await this.materials.update(id, input);
      const material = await this.materials.findById(id);
      if (!material) {
        throw new MaterialNotFoundError();
      }
      return toResponse(material);
    } catch (err) {
      if (err instanceof MaterialNotFoundError) throw err;
      if (err instanceof DuplicateMaterialNameError) throw err;
      throw new MaterialNotFoundError();
    }
  }
}

export class DeleteMaterialUseCase {
  constructor(private readonly materials: MaterialsRepository) {}

  async execute(id: number): Promise<MaterialResponse> {
    try {
      const material = await this.materials.delete(id);
      return toResponse(material);
    } catch {
      throw new MaterialNotFoundError();
    }
  }
}

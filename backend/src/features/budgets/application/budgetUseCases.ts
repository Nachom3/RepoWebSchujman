import type { Budget, BudgetItem } from "@prisma/client";

export type BudgetStatusValue =
  | "BORRADOR"
  | "ENVIADO"
  | "APROBADO"
  | "RECHAZADO"
  | "VENCIDO";

export type BudgetItemInput = {
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type CreateBudgetInput = {
  projectId: number;
  status?: BudgetStatusValue;
  notes?: string;
  expiresAt?: Date | null;
  items?: BudgetItemInput[];
};

export type UpdateBudgetInput = {
  status?: BudgetStatusValue;
  notes?: string;
  expiresAt?: Date | null;
  items?: BudgetItemInput[];
};

// The repository's BudgetRecord includes the joined items, which TypeScript
// cannot infer from the Prisma generated types directly. We accept any
// superset of Budget that also includes items, since the route/response
// layer only cares about the JSON shape that Prisma returns.
export type BudgetRecord = Budget & { items: BudgetItem[] };

export type BudgetsRepository = {
  create(input: CreateBudgetInput): Promise<BudgetRecord>;
  list(input: { projectId?: number; status?: BudgetStatusValue }): Promise<BudgetRecord[]>;
  findById(id: number): Promise<BudgetRecord | null>;
  update(id: number, input: UpdateBudgetInput): Promise<BudgetRecord>;
  delete(id: number): Promise<BudgetRecord>;
  projectExists(id: number): Promise<boolean>;
};

export class BudgetNotFoundError extends Error {
  constructor() {
    super("Budget not found");
  }
}

export class BudgetProjectNotFoundError extends Error {
  constructor() {
    super("Project not found");
  }
}

function computeItemTotal(item: { quantity: number; unitPrice: number }): number {
  return Number((item.quantity * item.unitPrice).toFixed(2));
}

function computeTotal(items: BudgetItemInput[]): number {
  return Number(items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0).toFixed(2));
}

export class CreateBudgetUseCase {
  constructor(private readonly budgets: BudgetsRepository) {}

  async execute(input: CreateBudgetInput): Promise<BudgetRecord> {
    if (!(await this.budgets.projectExists(input.projectId))) {
      throw new BudgetProjectNotFoundError();
    }
    return this.budgets.create(input);
  }
}

export class ListBudgetsUseCase {
  constructor(private readonly budgets: BudgetsRepository) {}

  execute(input: { projectId?: number; status?: BudgetStatusValue }): Promise<BudgetRecord[]> {
    return this.budgets.list(input);
  }
}

export class GetBudgetUseCase {
  constructor(private readonly budgets: BudgetsRepository) {}

  async execute(id: number): Promise<BudgetRecord> {
    const budget = await this.budgets.findById(id);
    if (!budget) {
      throw new BudgetNotFoundError();
    }
    return budget;
  }
}

export class UpdateBudgetUseCase {
  constructor(private readonly budgets: BudgetsRepository) {}

  async execute(id: number, input: UpdateBudgetInput): Promise<BudgetRecord> {
    try {
      return await this.budgets.update(id, input);
    } catch {
      throw new BudgetNotFoundError();
    }
  }
}

export class DeleteBudgetUseCase {
  constructor(private readonly budgets: BudgetsRepository) {}

  async execute(id: number): Promise<BudgetRecord> {
    try {
      return await this.budgets.delete(id);
    } catch {
      throw new BudgetNotFoundError();
    }
  }
}

export { computeItemTotal, computeTotal };

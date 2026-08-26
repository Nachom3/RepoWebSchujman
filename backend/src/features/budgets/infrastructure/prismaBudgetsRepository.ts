import prismaPkg from "@prisma/client";
import { prisma } from "../../../db/prisma";
import {
  computeItemTotal,
  computeTotal,
  type BudgetsRepository,
  type CreateBudgetInput,
  type UpdateBudgetInput,
} from "../application/budgetUseCases";

const { Prisma } = prismaPkg;

const budgetInclude = {
  items: true,
} satisfies prismaPkg.Prisma.BudgetInclude;

type BudgetWithItems = prismaPkg.Prisma.BudgetGetPayload<{
  include: typeof budgetInclude;
}>;

function isNotFoundError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
}

export class PrismaBudgetsRepository implements BudgetsRepository {
  async create(input: CreateBudgetInput): Promise<BudgetWithItems> {
    const items = (input.items ?? []).map((item) => ({
      ...item,
      total: computeItemTotal(item),
    }));
    const total = computeTotal(items);

    return prisma.budget.create({
      data: {
        projectId: input.projectId,
        status: input.status ?? "BORRADOR",
        notes: input.notes,
        expiresAt: input.expiresAt,
        total,
        items: { create: items },
      },
      include: budgetInclude,
    });
  }

  async list(input: { projectId?: number; status?: string }): Promise<BudgetWithItems[]> {
    const where: prismaPkg.Prisma.BudgetWhereInput = {};
    if (input.projectId) where.projectId = input.projectId;
    if (input.status) where.status = input.status as prismaPkg.Prisma.BudgetWhereInput["status"];

    return prisma.budget.findMany({
      where,
      include: budgetInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: number): Promise<BudgetWithItems | null> {
    return prisma.budget.findUnique({
      where: { id },
      include: budgetInclude,
    });
  }

  async update(id: number, input: UpdateBudgetInput): Promise<BudgetWithItems> {
    try {
      const data: prismaPkg.Prisma.BudgetUpdateInput = {};
      if (input.status !== undefined) data.status = input.status;
      if (input.notes !== undefined) data.notes = input.notes;
      if (input.expiresAt !== undefined) data.expiresAt = input.expiresAt;

      if (input.items) {
        const items = input.items.map((item) => ({
          ...item,
          total: computeItemTotal(item),
        }));
        data.total = computeTotal(items);
        data.items = {
          deleteMany: { budgetId: id },
          create: items,
        };
      }

      if (input.status === "APROBADO") {
        data.approvedAt = new Date();
      }

      return await prisma.budget.update({
        where: { id },
        data,
        include: budgetInclude,
      });
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("BUDGET_NOT_FOUND");
      }
      throw err;
    }
  }

  async delete(id: number): Promise<BudgetWithItems> {
    try {
      return await prisma.budget.delete({
        where: { id },
        include: budgetInclude,
      });
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("BUDGET_NOT_FOUND");
      }
      throw err;
    }
  }

  async projectExists(id: number): Promise<boolean> {
    const project = await prisma.project.findUnique({ where: { id }, select: { id: true } });
    return project !== null;
  }
}

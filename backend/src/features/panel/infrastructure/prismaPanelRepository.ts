import type { PaymentType } from "@prisma/client";
import { prisma } from "../../../db/prisma";
import type { PanelRepository } from "../application/getPanelSummary";

export const prismaPanelRepository: PanelRepository = {
  countProjectsByStatus: async () => {
    const grouped = await prisma.project.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    return grouped.map((row) => ({
      status: row.status,
      _count: { _all: row._count._all },
    }));
  },

  sumPaymentsSince: async ({ type, since }: { type: PaymentType; since: Date }) => {
    const result = await prisma.payment.aggregate({
      where: { type, date: { gte: since } },
      _sum: { amount: true },
    });
    return result._sum.amount ?? 0;
  },

  countOverdueTasks: () =>
    prisma.task.count({ where: { status: "ATRASADA" } }),

  countLowStockMaterials: async () => {
    // Prisma can't compare two columns in a single where, so we fetch the
    // pair and filter in-memory. Cheap for the day-1 dataset sizes.
    const materials = await prisma.material.findMany({
      select: { stock: true, alertMin: true },
    });
    return materials.filter((m) => m.stock < m.alertMin).length;
  },
};

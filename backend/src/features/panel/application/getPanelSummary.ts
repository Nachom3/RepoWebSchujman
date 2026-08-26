import type { PaymentType } from "@prisma/client";

export type PanelSummaryResponse = {
  activeProjects: number;
  pendingProjects: number;
  finishedProjects: number;
  totalProjects: number;
  monthlyIncome: number;
  monthlyExpense: number;
  pendingPayments: number;
  lowStockMaterials: number;
  overdueTasks: number;
};

export type PanelRepository = {
  countProjectsByStatus(): Promise<{ status: string; _count: { _all: number } }[]>;
  sumPaymentsSince(input: { type: PaymentType; since: Date }): Promise<number>;
  countOverdueTasks(): Promise<number>;
  countLowStockMaterials(): Promise<number>;
};

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export const getPanelSummary = async (
  repository: PanelRepository,
  now = new Date(),
): Promise<PanelSummaryResponse> => {
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [projectsByStatus, monthlyIncome, monthlyExpense, overdueTasks, lowStock] =
    await Promise.all([
      repository.countProjectsByStatus(),
      repository.sumPaymentsSince({ type: "COBRO", since: startOfMonth }),
      repository.sumPaymentsSince({ type: "GASTO", since: startOfMonth }),
      repository.countOverdueTasks(),
      repository.countLowStockMaterials(),
    ]);

  const counts: Record<string, number> = {};
  for (const row of projectsByStatus) {
    counts[row.status] = row._count._all;
  }

  const totalProjects = projectsByStatus.reduce((acc, row) => acc + row._count._all, 0);

  return {
    activeProjects: counts["EN_CURSO"] ?? 0,
    pendingProjects: counts["PENDIENTE"] ?? 0,
    finishedProjects: counts["FINALIZADA"] ?? 0,
    totalProjects,
    monthlyIncome,
    monthlyExpense,
    pendingPayments: Math.max(monthlyIncome - monthlyExpense, 0),
    lowStockMaterials: lowStock,
    overdueTasks,
  };
};

// Re-export constant for callers that need to compute their own windows
export { MILLISECONDS_PER_DAY };

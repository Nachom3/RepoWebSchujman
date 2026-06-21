import type { PanelSummaryResponse } from "../../../types/panel";

type PanelRepository = {
  findCompletedOrdersSince(date: Date): Promise<
    {
      quantity: number;
      priceSnapshot: number | null;
      completedAt: Date | null;
    }[]
  >;
  findMovementAmountsSince(input: { type: "CREDITO" | "DEBITO"; date: Date }): Promise<{ monto: number }[]>;
  findCompletedOrderTimesSince(date: Date): Promise<{ completedAt: Date | null }[]>;
};

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const DISPATCHED_VOLUME_WINDOW_DAYS = 7;
const PEAK_HOURS_WINDOW_DAYS = 30;
const PEAK_HOURS_LIMIT = 3;

export const getPanelSummary = async (
  repository: PanelRepository,
  now = new Date(),
): Promise<PanelSummaryResponse> => {
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sevenDaysAgo = new Date(
    now.getTime() - DISPATCHED_VOLUME_WINDOW_DAYS * MILLISECONDS_PER_DAY,
  );
  const thirtyDaysAgo = new Date(
    now.getTime() - PEAK_HOURS_WINDOW_DAYS * MILLISECONDS_PER_DAY,
  );

  const [completedOrders, recentPayments, pendingDebits] = await Promise.all([
    repository.findCompletedOrdersSince(sevenDaysAgo),
    repository.findMovementAmountsSince({ type: "CREDITO", date: startOfMonth }),
    repository.findMovementAmountsSince({ type: "DEBITO", date: startOfMonth }),
  ]);

  const monthlyIncome = completedOrders.reduce(
    (sum, order) => sum + (order.priceSnapshot ?? 0) * order.quantity,
    0,
  );

  const m3DispatchedThisWeek = completedOrders.reduce((sum, order) => sum + order.quantity, 0);

  const peakOrders = await repository.findCompletedOrderTimesSince(thirtyDaysAgo);
  const hourCounts = new Map<number, number>();
  for (const order of peakOrders) {
    if (order.completedAt) {
      const hour = order.completedAt.getHours();
      hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
    }
  }

  const peakHours = [...hourCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, PEAK_HOURS_LIMIT)
    .map(([hour, count]) => ({ hour, count }));

  const paid = recentPayments.reduce((sum, payment) => sum + payment.monto, 0);
  const pending = pendingDebits.reduce((sum, debit) => sum + debit.monto, 0);

  return {
    monthlyIncome,
    m3DispatchedThisWeek,
    peakHours,
    paymentStatus: { paid, pending },
  };
};

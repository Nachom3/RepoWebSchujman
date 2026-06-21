import { Router, type Request, type Response } from "express";
import { prisma } from "../db/prisma";
import { authenticateToken } from "../middleware/auth";
import type { PanelSummaryResponse } from "../types/panel";
import type { ApiErrorResponse } from "../types/auth";

export const panelRouter = Router();

panelRouter.use(authenticateToken);

panelRouter.get(
  "/summary",
  async (
    _req: Request,
    res: Response<PanelSummaryResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [completedOrders, recentPayments, pendingDebits] = await Promise.all([
        prisma.order.findMany({
          where: {
            status: "COMPLETADA",
            completedAt: { gte: sevenDaysAgo },
          },
          select: { quantity: true, priceSnapshot: true, completedAt: true },
        }),
        prisma.cuentaCorrienteMovimiento.findMany({
          where: {
            tipo: "CREDITO",
            fecha: { gte: startOfMonth },
          },
          select: { monto: true },
        }),
        prisma.cuentaCorrienteMovimiento.findMany({
          where: {
            tipo: "DEBITO",
            fecha: { gte: startOfMonth },
          },
          select: { monto: true },
        }),
      ]);

      const monthlyIncome = completedOrders.reduce(
        (sum, o) => sum + (o.priceSnapshot ?? 0) * o.quantity,
        0,
      );

      const m3DispatchedThisWeek = completedOrders.reduce(
        (sum, o) => sum + o.quantity,
        0,
      );

      const peakOrders = await prisma.order.findMany({
        where: {
          status: "COMPLETADA",
          completedAt: { gte: thirtyDaysAgo },
        },
        select: { completedAt: true },
      });

      const hourCounts = new Map<number, number>();
      for (const o of peakOrders) {
        if (o.completedAt) {
          const hour = o.completedAt.getHours();
          hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
        }
      }
      const peakHours = [...hourCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([hour, count]) => ({ hour, count }));

      const paid = recentPayments.reduce((sum, p) => sum + p.monto, 0);
      const pending = pendingDebits.reduce((sum, d) => sum + d.monto, 0);

      res.json({
        monthlyIncome,
        m3DispatchedThisWeek,
        peakHours,
        paymentStatus: { paid, pending },
      });
    } catch (err) {
      console.error("[panel summary]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

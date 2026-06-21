import { prisma } from "../../../db/prisma";

export const prismaPanelRepository = {
  findCompletedOrdersSince: (date: Date) =>
    prisma.order.findMany({
      where: {
        status: "COMPLETADA",
        completedAt: { gte: date },
      },
      select: { quantity: true, priceSnapshot: true, completedAt: true },
    }),

  findMovementAmountsSince: (input: { type: "CREDITO" | "DEBITO"; date: Date }) =>
    prisma.cuentaCorrienteMovimiento.findMany({
      where: {
        tipo: input.type,
        fecha: { gte: input.date },
      },
      select: { monto: true },
    }),

  findCompletedOrderTimesSince: (date: Date) =>
    prisma.order.findMany({
      where: {
        status: "COMPLETADA",
        completedAt: { gte: date },
      },
      select: { completedAt: true },
    }),
};

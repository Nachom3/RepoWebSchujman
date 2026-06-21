import prismaPkg from "@prisma/client";
import { prisma } from "../../../db/prisma";
import { OrderUseCaseError, type ListOrdersInput } from "../application/orderUseCases";

const { Prisma } = prismaPkg;

const orderSelect = {
  id: true,
  clientId: true,
  formulaId: true,
  truckId: true,
  quantity: true,
  priceSnapshot: true,
  status: true,
  createdAt: true,
  deliveryDate: true,
  completedAt: true,
} satisfies prismaPkg.Prisma.OrderSelect;

const orderInclude = {
  client: { select: { id: true, razonSocial: true, cuit: true } },
  formula: { select: { id: true, name: true, pricePerCubicMeter: true } },
  truck: { select: { id: true, patente: true, capacity: true } },
} satisfies prismaPkg.Prisma.OrderInclude;

const isMissingRecordError = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";

export const prismaOrderRepository = {
  findClientById: (id: number) =>
    prisma.client.findUnique({ where: { id }, select: { id: true } }),

  findFormulaById: (id: number) =>
    prisma.formula.findUnique({
      where: { id },
      select: { id: true, pricePerCubicMeter: true },
    }),

  createOrder: (input: {
    clientId: number;
    formulaId: number;
    quantity: number;
    priceSnapshot: number;
    deliveryDate?: Date;
  }) =>
    prisma.order.create({
      data: input,
      include: orderInclude,
    }),

  listOrders: (input: ListOrdersInput) =>
    prisma.order.findMany({
      where: input,
      select: orderSelect,
      orderBy: { createdAt: "desc" },
    }),

  findOrderDetail: (id: number) =>
    prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    }),

  findOrderById: (id: number) =>
    prisma.order.findUnique({
      where: { id },
      select: orderSelect,
    }),

  findTruckById: (id: number) =>
    prisma.truck.findUnique({
      where: { id },
      select: { id: true, status: true },
    }),

  updateOrder: async (id: number, input: { deliveryDate?: string }) => {
    try {
      return await prisma.order.update({
        where: { id },
        data: input,
        include: orderInclude,
      });
    } catch (error) {
      if (isMissingRecordError(error)) {
        return null;
      }
      throw error;
    }
  },

  assignTruck: async (input: { orderId: number; truckId: number }) => {
    const [updatedOrder] = await prisma.$transaction([
      prisma.order.update({
        where: { id: input.orderId },
        data: { truckId: input.truckId },
        include: orderInclude,
      }),
      prisma.truck.update({
        where: { id: input.truckId },
        data: { status: "EN_RECORRIDO" },
      }),
    ]);

    return updatedOrder;
  },

  findOrderForApproval: (id: number) =>
    prisma.order.findUnique({
      where: { id },
      include: {
        formula: {
          include: {
            materials: {
              select: { siloStockId: true, kgPerCubicMeter: true },
            },
          },
        },
      },
    }),

  hasCreditPayment: async (input: { clientId: number; reference: string }) => {
    const payment = await prisma.cuentaCorrienteMovimiento.findFirst({
      where: {
        clientId: input.clientId,
        tipo: "CREDITO",
        referencia: input.reference,
      },
      select: { id: true },
    });

    return payment !== null;
  },

  approveOrder: (input: { orderId: number; stockDecrements: { siloStockId: number; quantity: number }[] }) =>
    prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: input.orderId },
        data: { status: "APROBADA" },
      });

      for (const decrement of input.stockDecrements) {
        const silo = await tx.siloStock.findUnique({ where: { id: decrement.siloStockId } });
        if (!silo || silo.quantity < decrement.quantity) {
          throw new OrderUseCaseError(
            "INSUFFICIENT_STOCK",
            `Insufficient stock: ${silo?.material ?? "unknown"}`,
          );
        }

        await tx.siloStock.update({
          where: { id: decrement.siloStockId },
          data: { quantity: { decrement: decrement.quantity } },
        });
      }

      return tx.order.findUniqueOrThrow({
        where: { id: input.orderId },
        include: orderInclude,
      });
    }),

  completeOrder: (input: { orderId: number; truckId: number | null; completedAt: Date }) =>
    prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: input.orderId },
        data: { status: "COMPLETADA", completedAt: input.completedAt },
      });

      if (input.truckId) {
        await tx.truck.update({
          where: { id: input.truckId },
          data: { status: "DISPONIBLE" },
        });
      }

      return tx.order.findUniqueOrThrow({
        where: { id: input.orderId },
        include: orderInclude,
      });
    }),

  cancelOrder: async (id: number) => {
    try {
      return await prisma.order.update({
        where: { id },
        data: { status: "CANCELADA" },
        select: orderSelect,
      });
    } catch (error) {
      if (isMissingRecordError(error)) {
        return null;
      }
      throw error;
    }
  },
};

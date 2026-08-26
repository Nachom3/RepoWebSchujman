import prismaPkg from "@prisma/client";
import { prisma } from "../../../db/prisma";
import type {
  CreatePaymentInput,
  PaymentRecord,
  PaymentsRepository,
  UpdatePaymentInput,
} from "../application/paymentUseCases";

const { Prisma } = prismaPkg;

function isNotFoundError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
}

export class PrismaPaymentsRepository implements PaymentsRepository {
  create(input: CreatePaymentInput): Promise<PaymentRecord> {
    return prisma.payment.create({
      data: {
        type: input.type,
        method: input.method ?? "EFECTIVO",
        amount: input.amount,
        date: input.date ?? new Date(),
        reference: input.reference,
        notes: input.notes,
        clientId: input.clientId,
        projectId: input.projectId,
      },
    });
  }

  list(input: { type?: string; clientId?: number; projectId?: number }): Promise<PaymentRecord[]> {
    const where: prismaPkg.Prisma.PaymentWhereInput = {};
    if (input.type) where.type = input.type as prismaPkg.Prisma.PaymentWhereInput["type"];
    if (input.clientId) where.clientId = input.clientId;
    if (input.projectId) where.projectId = input.projectId;

    return prisma.payment.findMany({
      where,
      orderBy: { date: "desc" },
    });
  }

  listByClient(clientId: number): Promise<PaymentRecord[]> {
    return prisma.payment.findMany({
      where: { clientId },
      orderBy: { date: "desc" },
    });
  }

  findById(id: number): Promise<PaymentRecord | null> {
    return prisma.payment.findUnique({ where: { id } });
  }

  async update(id: number, input: UpdatePaymentInput): Promise<PaymentRecord> {
    try {
      return await prisma.payment.update({ where: { id }, data: input });
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("PAYMENT_NOT_FOUND");
      }
      throw err;
    }
  }

  async delete(id: number): Promise<PaymentRecord> {
    try {
      return await prisma.payment.delete({ where: { id } });
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("PAYMENT_NOT_FOUND");
      }
      throw err;
    }
  }

  async clientExists(id: number): Promise<boolean> {
    const client = await prisma.client.findUnique({ where: { id }, select: { id: true } });
    return client !== null;
  }

  async projectExists(id: number): Promise<boolean> {
    const project = await prisma.project.findUnique({ where: { id }, select: { id: true } });
    return project !== null;
  }
}

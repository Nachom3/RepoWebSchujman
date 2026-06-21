import { prisma } from "../../../db/prisma";
import type {
  ClientMovementRepository,
  Movement,
  MovementTipoValue,
} from "../application/clientMovementUseCases";

const movementSelect = {
  id: true,
  tipo: true,
  monto: true,
  fecha: true,
  referencia: true,
  clientId: true,
} as const;

export class PrismaClientMovementsRepository implements ClientMovementRepository {
  async findClientBalance(clientId: number): Promise<{ id: number; saldo: number } | null> {
    return prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, saldo: true },
    });
  }

  async findOrderOwner(orderId: number): Promise<{ id: number; clientId: number } | null> {
    return prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, clientId: true },
    });
  }

  async createMovementAndUpdateBalance(input: {
    clientId: number;
    tipo: MovementTipoValue;
    monto: number;
    referencia?: string;
    newSaldo: number;
  }): Promise<Movement> {
    const [movement] = await prisma.$transaction([
      prisma.cuentaCorrienteMovimiento.create({
        data: {
          tipo: input.tipo,
          monto: input.monto,
          clientId: input.clientId,
          referencia: input.referencia,
        },
        select: movementSelect,
      }),
      prisma.client.update({
        where: { id: input.clientId },
        data: { saldo: input.newSaldo },
      }),
    ]);

    return movement;
  }

  async clientExists(clientId: number): Promise<boolean> {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true },
    });

    return client !== null;
  }

  listByClient(clientId: number): Promise<Movement[]> {
    return prisma.cuentaCorrienteMovimiento.findMany({
      where: { clientId },
      orderBy: { fecha: "desc" },
      select: movementSelect,
    });
  }
}

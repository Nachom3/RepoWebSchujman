import { prisma } from "../../../db/prisma";
import type { PortalRepository } from "../application/portalUseCases";

export const prismaPortalRepository: PortalRepository = {
  findActiveClient: async (identifier) => {
    if ("id" in identifier) {
      return prisma.client.findFirst({
        where: { id: identifier.id, status: "ACTIVE" },
        select: { id: true, name: true, taxId: true },
      });
    }
    if ("normalizedTaxId" in identifier) {
      const activeClients = await prisma.client.findMany({
        where: { status: "ACTIVE", NOT: { taxId: null } },
        select: { id: true, name: true, taxId: true },
      });

      return (
        activeClients.find(
          (client) => client.taxId?.replace(/\D+/g, "") === identifier.normalizedTaxId,
        ) ?? null
      );
    }
    return prisma.client.findFirst({
      where: { taxId: identifier.taxId, status: "ACTIVE" },
      select: { id: true, name: true, taxId: true },
    });
  },

  createSession: async (data) => {
    await prisma.portalSession.create({ data });
  },

  deleteSession: async (token) => {
    await prisma.portalSession.deleteMany({ where: { token } });
  },

  listProjectsByClient: (clientId) =>
    prisma.project.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        status: true,
        type: true,
        address: true,
        progressPercent: true,
        estimatedEnd: true,
      },
    }),

  findProjectForClient: ({ projectId, clientId }) =>
    prisma.project.findFirst({
      where: { id: projectId, clientId },
      include: {
        tasks: {
          select: { id: true, title: true, status: true, progress: true },
          orderBy: { createdAt: "asc" },
        },
      },
    }),

  listPaymentsByClient: (clientId) =>
    prisma.payment.findMany({
      where: { clientId, type: "COBRO" },
      orderBy: { date: "desc" },
      select: {
        id: true,
        type: true,
        method: true,
        amount: true,
        date: true,
        projectId: true,
      },
    }),
};

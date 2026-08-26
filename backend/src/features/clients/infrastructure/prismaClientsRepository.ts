import prismaPkg from "@prisma/client";
import { prisma } from "../../../db/prisma";
import {
  ClientNotFoundError,
  DuplicateClientTaxIdError,
  type ClientDetail,
  type ClientStatusValue,
  type ClientSummary,
  type ClientsRepository,
  type CreateClientInput,
  type UpdateClientInput,
} from "../application/clientUseCases";

const { Prisma } = prismaPkg;

const clientSummarySelect = {
  id: true,
  taxId: true,
  name: true,
  email: true,
  phone: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class PrismaClientsRepository implements ClientsRepository {
  async create(input: CreateClientInput): Promise<ClientSummary> {
    try {
      return await prisma.client.create({
        data: {
          taxId: input.taxId,
          name: input.name,
          email: input.email,
          phone: input.phone,
          address: input.address,
          contactName: input.contactName,
          notes: input.notes,
        },
        select: clientSummarySelect,
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new DuplicateClientTaxIdError();
      }
      throw err;
    }
  }

  list(input: { status?: ClientStatusValue }): Promise<ClientSummary[]> {
    const where = input.status ? { status: input.status } : undefined;

    return prisma.client.findMany({
      where,
      select: clientSummarySelect,
      orderBy: { createdAt: "desc" },
    });
  }

  findDetail(id: number): Promise<ClientDetail | null> {
    return prisma.client.findUnique({
      where: { id },
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
            progressPercent: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async update(id: number, input: UpdateClientInput): Promise<ClientSummary> {
    try {
      return await prisma.client.update({
        where: { id },
        data: input,
        select: clientSummarySelect,
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        throw new ClientNotFoundError();
      }
      throw err;
    }
  }

  async disable(id: number): Promise<ClientSummary> {
    try {
      return await prisma.client.update({
        where: { id },
        data: { status: "DISABLED" },
        select: clientSummarySelect,
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        throw new ClientNotFoundError();
      }
      throw err;
    }
  }
}

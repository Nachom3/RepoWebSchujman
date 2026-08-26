import prismaPkg from "@prisma/client";
import { prisma } from "../../../db/prisma";
import type {
  CreateProjectInput,
  ListProjectsInput,
  ProjectDetail,
  ProjectSummary,
  ProjectsRepository,
  UpdateProjectInput,
} from "../application/projectUseCases";

const { Prisma } = prismaPkg;

const projectSummarySelect = {
  id: true,
  name: true,
  type: true,
  status: true,
  address: true,
  progressPercent: true,
  clientId: true,
  estimatedStart: true,
  estimatedEnd: true,
  createdAt: true,
  updatedAt: true,
} as const;

function isNotFoundError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
}

export class PrismaProjectsRepository implements ProjectsRepository {
  create(input: CreateProjectInput): Promise<ProjectSummary> {
    return prisma.project.create({
      data: {
        name: input.name,
        type: input.type ?? "OTRO",
        status: input.status ?? "PENDIENTE",
        description: input.description,
        address: input.address,
        clientId: input.clientId,
        estimatedStart: input.estimatedStart,
        estimatedEnd: input.estimatedEnd,
      },
      select: projectSummarySelect,
    });
  }

  list(input: ListProjectsInput): Promise<ProjectSummary[]> {
    const where: prismaPkg.Prisma.ProjectWhereInput = {};
    if (input.status) where.status = input.status;
    if (input.clientId) where.clientId = input.clientId;

    return prisma.project.findMany({
      where,
      select: projectSummarySelect,
      orderBy: { createdAt: "desc" },
    });
  }

  findDetail(id: number): Promise<ProjectDetail | null> {
    return prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, taxId: true } },
      },
    });
  }

  findById(id: number): Promise<ProjectSummary | null> {
    return prisma.project.findUnique({
      where: { id },
      select: projectSummarySelect,
    });
  }

  async update(id: number, input: UpdateProjectInput): Promise<ProjectSummary> {
    try {
      return await prisma.project.update({
        where: { id },
        data: input,
        select: projectSummarySelect,
      });
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("PROJECT_NOT_FOUND");
      }
      throw err;
    }
  }

  async delete(id: number): Promise<ProjectSummary> {
    try {
      return await prisma.project.delete({
        where: { id },
        select: projectSummarySelect,
      });
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("PROJECT_NOT_FOUND");
      }
      throw err;
    }
  }

  async clientExists(id: number): Promise<boolean> {
    const client = await prisma.client.findUnique({
      where: { id },
      select: { id: true },
    });
    return client !== null;
  }
}

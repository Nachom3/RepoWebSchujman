import prismaPkg from "@prisma/client";
import { prisma } from "../../../db/prisma";
import type {
  CreateTaskInput,
  TaskRecord,
  TasksRepository,
  UpdateTaskInput,
} from "../application/taskUseCases";

const { Prisma } = prismaPkg;

function isNotFoundError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
}

export class PrismaTasksRepository implements TasksRepository {
  create(input: CreateTaskInput): Promise<TaskRecord> {
    return prisma.task.create({
      data: {
        projectId: input.projectId,
        title: input.title,
        description: input.description,
        status: input.status ?? "PENDIENTE",
        stage: input.stage,
        startDate: input.startDate,
        endDate: input.endDate,
        progress: input.progress ?? 0,
      },
    });
  }

  list(input: { projectId?: number; status?: string }): Promise<TaskRecord[]> {
    const where: prismaPkg.Prisma.TaskWhereInput = {};
    if (input.projectId) where.projectId = input.projectId;
    if (input.status) where.status = input.status as prismaPkg.Prisma.TaskWhereInput["status"];

    return prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: number): Promise<TaskRecord | null> {
    return prisma.task.findUnique({ where: { id } });
  }

  async update(id: number, input: UpdateTaskInput): Promise<TaskRecord> {
    try {
      return await prisma.task.update({ where: { id }, data: input });
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("TASK_NOT_FOUND");
      }
      throw err;
    }
  }

  async delete(id: number): Promise<TaskRecord> {
    try {
      return await prisma.task.delete({ where: { id } });
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("TASK_NOT_FOUND");
      }
      throw err;
    }
  }

  async projectExists(id: number): Promise<boolean> {
    const project = await prisma.project.findUnique({ where: { id }, select: { id: true } });
    return project !== null;
  }
}

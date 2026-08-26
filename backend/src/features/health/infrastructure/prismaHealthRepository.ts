import { prisma } from "../../../db/prisma";
import type { HealthCheckStatus, HealthRepository } from "../application/healthUseCases";

export class PrismaHealthRepository implements HealthRepository {
  async checkDatabase(): Promise<HealthCheckStatus> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return "ok";
    } catch {
      return "down";
    }
  }
}

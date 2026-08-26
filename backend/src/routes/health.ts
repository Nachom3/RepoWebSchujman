import { Router, type Request, type Response } from "express";
import { CheckHealthUseCase } from "../features/health/application/healthUseCases";
import { PrismaHealthRepository } from "../features/health/infrastructure/prismaHealthRepository";

const startedAt = Date.now();

type HealthStatus = "ok" | "degraded";

interface HealthResponse {
  status: HealthStatus;
  uptimeSeconds: number;
  timestamp: string;
  checks: {
    database: "ok" | "down";
  };
}

const healthRepository = new PrismaHealthRepository();
const checkHealthUseCase = new CheckHealthUseCase(healthRepository);

export const healthRouter = Router();

healthRouter.get(
  "/",
  async (_req: Request, res: Response<HealthResponse>): Promise<void> => {
    const result = await checkHealthUseCase.execute();

    const status: HealthStatus = result.database === "ok" ? "ok" : "degraded";
    const body: HealthResponse = {
      status,
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
      checks: { database: result.database },
    };

    res.status(status === "ok" ? 200 : 503).json(body);
  },
);

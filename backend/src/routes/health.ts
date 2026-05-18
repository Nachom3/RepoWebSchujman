import { Router, type Request, type Response } from "express";
import { prisma } from "../db/prisma";

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

export const healthRouter = Router();

healthRouter.get(
  "/",
  async (_req: Request, res: Response<HealthResponse>): Promise<void> => {
    let dbStatus: "ok" | "down" = "ok";

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (err) {
      console.error("[health] DB check failed", err);
      dbStatus = "down";
    }

    const status: HealthStatus = dbStatus === "ok" ? "ok" : "degraded";
    const body: HealthResponse = {
      status,
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
      checks: { database: dbStatus },
    };

    res.status(status === "ok" ? 200 : 503).json(body);
  },
);

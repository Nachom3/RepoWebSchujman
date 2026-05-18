import express, { type Request, type Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";
import { disconnectPrisma } from "./db/prisma";

const app = express();
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api/auth", authRouter);
app.use("/health", healthRouter);
app.use("/api/health", healthRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("Backend Auth API Running");
});

const server = app.listen(env.port, "0.0.0.0", () => {
  console.log(`API running on port ${env.port}`);
});

const shutdown = async (signal: string): Promise<void> => {
  console.log(`Received ${signal}, shutting down...`);
  server.close(() => {
    void disconnectPrisma().finally(() => process.exit(0));
  });
};

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

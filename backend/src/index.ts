import express, { type Request, type Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";
import { clientsRouter } from "./routes/clients";
import { clientMovementsRouter } from "./routes/clientMovements";
import { ordersRouter } from "./routes/orders";
import { formulasRouter } from "./routes/formulas";
import { silosRouter } from "./routes/silos";
import { trucksRouter } from "./routes/trucks";
import { panelRouter } from "./routes/panel";
import { disconnectPrisma } from "./db/prisma";

const app = express();
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api/auth", authRouter);
app.use("/health", healthRouter);
app.use("/api/health", healthRouter);
app.use("/clients", clientsRouter);
app.use("/api/clients", clientsRouter);
app.use("/clients/:id/movements", clientMovementsRouter);
app.use("/api/clients/:id/movements", clientMovementsRouter);
app.use("/orders", ordersRouter);
app.use("/api/orders", ordersRouter);
app.use("/formulas", formulasRouter);
app.use("/api/formulas", formulasRouter);
app.use("/silos", silosRouter);
app.use("/api/silos", silosRouter);
app.use("/trucks", trucksRouter);
app.use("/api/trucks", trucksRouter);
app.use("/panel", panelRouter);
app.use("/api/panel", panelRouter);

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

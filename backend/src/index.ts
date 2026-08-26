import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";
import { clientsRouter } from "./routes/clients";
import { clientPaymentsRouter } from "./routes/clientPayments";
import { projectsRouter } from "./routes/projects";
import { budgetsRouter } from "./routes/budgets";
import { materialsRouter } from "./routes/materials";
import { suppliersRouter } from "./routes/suppliers";
import { staffRouter, projectStaffRouter } from "./routes/staff";
import { tasksRouter } from "./routes/tasks";
import { paymentsRouter } from "./routes/payments";
import { panelRouter } from "./routes/panel";
import { portalRouter } from "./routes/portal";
import { disconnectPrisma } from "./db/prisma";

const app = express();

// Do NOT blindly trust the client-supplied X-Forwarded-For header: it made the
// auth rate limiter trivially bypassable. Enable trust proxy ONLY when deployed
// directly behind a trusted reverse proxy that overwrites that header.
// app.set("trust proxy", 1);

// Restrict CORS to known frontend origins instead of reflecting '*'.
const corsOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({ origin: corsOrigins, credentials: false }));
app.use(express.json());

// ---------------------------------------------------------------------------
// Auth & health
// ---------------------------------------------------------------------------
app.use("/auth", authRouter);
app.use("/api/auth", authRouter);
app.use("/health", healthRouter);
app.use("/api/health", healthRouter);

// ---------------------------------------------------------------------------
// Core modules
// ---------------------------------------------------------------------------
app.use("/clients", clientsRouter);
app.use("/api/clients", clientsRouter);

// Sub-resource: payments belonging to a specific client
app.use("/clients/:clientId/payments", clientPaymentsRouter);
app.use("/api/clients/:clientId/payments", clientPaymentsRouter);

app.use("/projects", projectsRouter);
app.use("/api/projects", projectsRouter);

app.use("/budgets", budgetsRouter);
app.use("/api/budgets", budgetsRouter);

app.use("/materials", materialsRouter);
app.use("/api/materials", materialsRouter);

app.use("/suppliers", suppliersRouter);
app.use("/api/suppliers", suppliersRouter);

app.use("/staff", staffRouter);
app.use("/api/staff", staffRouter);

app.use("/projects/:projectId/staff", projectStaffRouter);
app.use("/api/projects/:projectId/staff", projectStaffRouter);

app.use("/tasks", tasksRouter);
app.use("/api/tasks", tasksRouter);

app.use("/payments", paymentsRouter);
app.use("/api/payments", paymentsRouter);

app.use("/panel", panelRouter);
app.use("/api/panel", panelRouter);

// ---------------------------------------------------------------------------
// Client portal
// ---------------------------------------------------------------------------
app.use("/api/portal", portalRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("Backend Constructora API Running");
});

// Terminal error handler: log the full error server-side, but never leak stack
// traces, file paths, or internals to clients.
app.use(
  (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    console.error("[error handler]", err);
    const status =
      typeof err === "object" &&
      err !== null &&
      typeof (err as { status?: unknown }).status === "number"
        ? (err as { status: number }).status
        : 500;
    res
      .status(status >= 400 && status < 600 ? status : 500)
      .json({ error: status === 404 ? "Not found" : "Server error" });
  },
);

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

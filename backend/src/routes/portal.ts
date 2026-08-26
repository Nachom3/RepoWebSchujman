import { Router, type Request, type Response } from "express";
import { authenticatePortal } from "../middleware/authenticatePortal";
import { authLimiter } from "../middleware/rateLimit";
import { validateBody } from "../middleware/validate";
import {
  portalLoginBodySchema,
  type PortalLoginBody,
} from "../validation/portalSchemas";
import type {
  PortalLoginResponse,
  PortalPaymentResponse,
  PortalProjectDetailResponse,
  PortalProjectResponse,
} from "../types/portal";
import type { ApiErrorResponse } from "../types/auth";
import {
  portalGetProject,
  portalListPayments,
  portalListProjects,
  portalLogin,
  portalLogout,
  PortalUseCaseError,
} from "../features/portal/application/portalUseCases";
import { prismaPortalRepository } from "../features/portal/infrastructure/prismaPortalRepository";

export const portalRouter = Router();

const parseRouteId = (value: string): number | null => {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
};

const mapPortalError = (error: unknown): { status: number; body: ApiErrorResponse } => {
  if (error instanceof PortalUseCaseError) {
    switch (error.code) {
      case "CLIENT_NOT_FOUND_OR_INACTIVE":
        return { status: 401, body: { error: error.message } };
      case "PROJECT_NOT_FOUND":
      case "PAYMENT_NOT_FOUND":
        return { status: 404, body: { error: error.message } };
    }
  }
  return { status: 500, body: { error: "Internal server error" } };
};

const sendPortalError = (
  res: Response<ApiErrorResponse>,
  error: unknown,
  label: string,
): void => {
  console.error(`[portal ${label}]`, error);
  const mapped = mapPortalError(error);
  res.status(mapped.status).json(mapped.body);
};

portalRouter.post(
  "/login",
  authLimiter,
  validateBody(portalLoginBodySchema),
  async (
    req: Request<unknown, PortalLoginResponse | ApiErrorResponse, PortalLoginBody>,
    res: Response<PortalLoginResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const result = await portalLogin(prismaPortalRepository, req.body.identifier);
      res.status(200).json(result);
    } catch (err) {
      sendPortalError(res, err, "login");
    }
  },
);

portalRouter.post(
  "/logout",
  authenticatePortal,
  async (req: Request, res: Response<{ message: string } | ApiErrorResponse>): Promise<void> => {
    try {
      const token = req.headers["x-portal-token"] as string;
      await portalLogout(prismaPortalRepository, token);
      res.status(200).json({ message: "Logged out" });
    } catch (err) {
      sendPortalError(res, err, "logout");
    }
  },
);

portalRouter.get(
  "/projects",
  authenticatePortal,
  async (
    req: Request,
    res: Response<PortalProjectResponse[] | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const clientId = req.portalClientId!;
      res.json(await portalListProjects(prismaPortalRepository, clientId));
    } catch (err) {
      sendPortalError(res, err, "list projects");
    }
  },
);

portalRouter.get(
  "/projects/:id",
  authenticatePortal,
  async (
    req: Request<{ id: string }>,
    res: Response<PortalProjectDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const projectId = parseRouteId(req.params.id);
    if (projectId === null) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }
    try {
      const clientId = req.portalClientId!;
      res.json(await portalGetProject(prismaPortalRepository, clientId, projectId));
    } catch (err) {
      sendPortalError(res, err, "get project");
    }
  },
);

portalRouter.get(
  "/payments",
  authenticatePortal,
  async (
    req: Request,
    res: Response<PortalPaymentResponse[] | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const clientId = req.portalClientId!;
      res.json(await portalListPayments(prismaPortalRepository, clientId));
    } catch (err) {
      sendPortalError(res, err, "list payments");
    }
  },
);

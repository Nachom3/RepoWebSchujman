import { Router, type Request, type Response } from "express";
import { authenticateToken } from "../../middleware/auth";
import { requireRole } from "../../middleware/requireRole";
import { validateBody } from "../../middleware/validate";
import {
  createPaymentBodySchema,
  type CreatePaymentBody,
} from "../../validation/paymentSchemas";
import type { ApiErrorResponse } from "../../types/auth";
import type { PaymentResponse, PaymentListResponse } from "../../types/payments";
import {
  CreatePaymentUseCase,
  ListClientPaymentsUseCase,
  PaymentClientNotFoundError,
} from "../payments/application/paymentUseCases";
import { PrismaPaymentsRepository } from "../payments/infrastructure/prismaPaymentsRepository";

export const clientPaymentsRouter = Router({ mergeParams: true });

const repository = new PrismaPaymentsRepository();
const createUseCase = new CreatePaymentUseCase(repository);
const listUseCase = new ListClientPaymentsUseCase(repository);

clientPaymentsRouter.use(authenticateToken);
clientPaymentsRouter.use(requireRole("ADMIN"));

function parseId(value: string): number | null {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
}

clientPaymentsRouter.get(
  "/",
  async (
    req: Request<{ clientId: string }, PaymentListResponse | ApiErrorResponse>,
    res: Response<PaymentListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const clientId = parseId(req.params.clientId);
    if (clientId === null) {
      res.status(400).json({ error: "Invalid client ID" });
      return;
    }
    try {
      res.json(await listUseCase.execute(clientId));
    } catch (err) {
      if (err instanceof PaymentClientNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[list client payments]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

clientPaymentsRouter.post(
  "/",
  validateBody(createPaymentBodySchema),
  async (
    req: Request<{ clientId: string }, PaymentResponse | ApiErrorResponse, CreatePaymentBody>,
    res: Response<PaymentResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const clientId = parseId(req.params.clientId);
    if (clientId === null) {
      res.status(400).json({ error: "Invalid client ID" });
      return;
    }
    try {
      const input = {
        ...req.body,
        clientId,
        date: req.body.date ? new Date(req.body.date) : undefined,
      };
      res.status(201).json(await createUseCase.execute(input));
    } catch (err) {
      if (err instanceof PaymentClientNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[create client payment]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

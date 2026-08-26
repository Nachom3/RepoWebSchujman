import { Router, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import {
  createPaymentBodySchema,
  updatePaymentBodySchema,
  listPaymentsQuerySchema,
  type CreatePaymentBody,
  type UpdatePaymentBody,
  type ListPaymentsQuery,
} from "../validation/paymentSchemas";
import type { ApiErrorResponse } from "../types/auth";
import type { PaymentResponse, PaymentListResponse } from "../types/payments";
import {
  CreatePaymentUseCase,
  DeletePaymentUseCase,
  GetPaymentUseCase,
  ListPaymentsUseCase,
  PaymentClientNotFoundError,
  PaymentNotFoundError,
  PaymentProjectNotFoundError,
  UpdatePaymentUseCase,
} from "../features/payments/application/paymentUseCases";
import { PrismaPaymentsRepository } from "../features/payments/infrastructure/prismaPaymentsRepository";

export const paymentsRouter = Router();

const repository = new PrismaPaymentsRepository();
const createUseCase = new CreatePaymentUseCase(repository);
const listUseCase = new ListPaymentsUseCase(repository);
const getUseCase = new GetPaymentUseCase(repository);
const updateUseCase = new UpdatePaymentUseCase(repository);
const deleteUseCase = new DeletePaymentUseCase(repository);

paymentsRouter.use(authenticateToken);
paymentsRouter.use(requireRole("ADMIN"));

function parseId(value: string): number | null {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
}

paymentsRouter.post(
  "/",
  validateBody(createPaymentBodySchema),
  async (
    req: Request<unknown, PaymentResponse | ApiErrorResponse, CreatePaymentBody>,
    res: Response<PaymentResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const input = {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
      };
      res.status(201).json(await createUseCase.execute(input));
    } catch (err) {
      if (
        err instanceof PaymentClientNotFoundError ||
        err instanceof PaymentProjectNotFoundError
      ) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[create payment]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

paymentsRouter.get(
  "/",
  async (
    req: Request<unknown, PaymentListResponse | ApiErrorResponse, unknown, ListPaymentsQuery>,
    res: Response<PaymentListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const queryResult = listPaymentsQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({ error: "Validation failed", details: queryResult.error.flatten() });
      return;
    }
    try {
      res.json(await listUseCase.execute(queryResult.data));
    } catch (err) {
      console.error("[list payments]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

paymentsRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, PaymentResponse | ApiErrorResponse>,
    res: Response<PaymentResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid payment ID" });
      return;
    }
    try {
      res.json(await getUseCase.execute(id));
    } catch (err) {
      if (err instanceof PaymentNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[get payment]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

paymentsRouter.patch(
  "/:id",
  validateBody(updatePaymentBodySchema),
  async (
    req: Request<{ id: string }, PaymentResponse | ApiErrorResponse, UpdatePaymentBody>,
    res: Response<PaymentResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid payment ID" });
      return;
    }
    try {
      const input = {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
      };
      res.json(await updateUseCase.execute(id, input));
    } catch (err) {
      if (err instanceof PaymentNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[update payment]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

paymentsRouter.delete(
  "/:id",
  async (
    req: Request<{ id: string }, PaymentResponse | ApiErrorResponse>,
    res: Response<PaymentResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid payment ID" });
      return;
    }
    try {
      res.json(await deleteUseCase.execute(id));
    } catch (err) {
      if (err instanceof PaymentNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[delete payment]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

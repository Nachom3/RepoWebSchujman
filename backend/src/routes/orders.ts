import { Router, type Request, type Response } from "express";
import {
  approveOrder,
  cancelOrder,
  completeOrder,
  createOrder,
  getOrderDetail,
  listOrders,
  OrderUseCaseError,
  updateOrder,
} from "../features/orders/application/orderUseCases";
import { prismaOrderRepository } from "../features/orders/infrastructure/prismaOrderRepository";
import { authenticateToken } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  createOrderBodySchema,
  updateOrderBodySchema,
  listOrdersQuerySchema,
  type CreateOrderBody,
  type UpdateOrderBody,
  type ListOrdersQuery,
} from "../validation/orderSchemas";
import type { OrderResponse, OrderDetailResponse, OrderListResponse } from "../types/orders";
import type { ApiErrorResponse } from "../types/auth";

export const ordersRouter = Router();

ordersRouter.use(authenticateToken);

const parseOrderId = (value: string): number | null => {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
};

const mapOrderError = (error: OrderUseCaseError): { status: number; body: ApiErrorResponse } => {
  switch (error.code) {
    case "CLIENT_NOT_FOUND":
    case "FORMULA_NOT_FOUND":
    case "ORDER_NOT_FOUND":
    case "TRUCK_NOT_FOUND":
      return { status: 404, body: { error: error.message } };
    case "ORDER_MUST_BE_APROBADA_TO_ASSIGN_TRUCK":
    case "TRUCK_NOT_AVAILABLE":
    case "ORDER_MUST_BE_PENDIENTE_TO_APPROVE":
    case "ORDER_MUST_BE_APROBADA_TO_COMPLETE":
    case "ONLY_PENDIENTE_ORDERS_CAN_BE_CANCELLED":
      return { status: 409, body: { error: error.message } };
    case "PAYMENT_REQUIRED":
    case "INSUFFICIENT_STOCK":
      return { status: 422, body: { error: error.message } };
  }
};

const sendOrderError = (res: Response<ApiErrorResponse>, error: unknown, logLabel: string): void => {
  if (error instanceof OrderUseCaseError) {
    const mapped = mapOrderError(error);
    res.status(mapped.status).json(mapped.body);
    return;
  }

  console.error(logLabel, error);
  res.status(500).json({ error: "Server error" });
};

ordersRouter.post(
  "/",
  validateBody(createOrderBodySchema),
  async (
    req: Request<unknown, OrderDetailResponse | ApiErrorResponse, CreateOrderBody>,
    res: Response<OrderDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const order = await createOrder(prismaOrderRepository, req.body);
      res.status(201).json(order);
    } catch (error) {
      sendOrderError(res, error, "[create order]");
    }
  },
);

ordersRouter.get(
  "/",
  async (
    req: Request<unknown, OrderListResponse | ApiErrorResponse, unknown, ListOrdersQuery>,
    res: Response<OrderListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const queryResult = listOrdersQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({
        error: "Validation failed",
        details: queryResult.error.flatten(),
      });
      return;
    }

    try {
      const orders = await listOrders(prismaOrderRepository, queryResult.data);
      res.json(orders);
    } catch (error) {
      sendOrderError(res, error, "[list orders]");
    }
  },
);

ordersRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, OrderDetailResponse | ApiErrorResponse>,
    res: Response<OrderDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseOrderId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    try {
      const order = await getOrderDetail(prismaOrderRepository, id);
      res.json(order);
    } catch (error) {
      sendOrderError(res, error, "[get order]");
    }
  },
);

ordersRouter.patch(
  "/:id",
  validateBody(updateOrderBodySchema),
  async (
    req: Request<{ id: string }, OrderDetailResponse | ApiErrorResponse, UpdateOrderBody>,
    res: Response<OrderDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseOrderId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    try {
      const order = await updateOrder(prismaOrderRepository, id, req.body);
      res.json(order);
    } catch (error) {
      sendOrderError(res, error, "[update order]");
    }
  },
);

ordersRouter.post(
  "/:id/approve",
  async (
    req: Request<{ id: string }, OrderDetailResponse | ApiErrorResponse>,
    res: Response<OrderDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseOrderId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    try {
      const order = await approveOrder(prismaOrderRepository, id);
      res.json(order);
    } catch (error) {
      sendOrderError(res, error, "[approve order]");
    }
  },
);

ordersRouter.post(
  "/:id/complete",
  async (
    req: Request<{ id: string }, OrderDetailResponse | ApiErrorResponse>,
    res: Response<OrderDetailResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseOrderId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    try {
      const order = await completeOrder(prismaOrderRepository, id);
      res.json(order);
    } catch (error) {
      sendOrderError(res, error, "[complete order]");
    }
  },
);

ordersRouter.delete(
  "/:id",
  async (
    req: Request<{ id: string }, OrderResponse | ApiErrorResponse>,
    res: Response<OrderResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseOrderId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    try {
      const order = await cancelOrder(prismaOrderRepository, id);
      res.json(order);
    } catch (error) {
      sendOrderError(res, error, "[cancel order]");
    }
  },
);

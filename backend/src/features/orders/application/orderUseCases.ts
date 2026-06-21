export type OrderStatus = "PENDIENTE" | "APROBADA" | "COMPLETADA" | "CANCELADA";
export type TruckStatus = "DISPONIBLE" | "EN_RECORRIDO";

export type CreateOrderInput = {
  clientId: number;
  formulaId: number;
  quantity: number;
  deliveryDate?: string;
};

export type UpdateOrderInput = {
  truckId?: number | null;
  deliveryDate?: string;
};

export type ListOrdersInput = {
  status?: OrderStatus;
  clientId?: number;
};

export type OrderRecord = {
  id: number;
  clientId: number;
  formulaId: number;
  truckId: number | null;
  quantity: number;
  priceSnapshot: number | null;
  status: OrderStatus;
  createdAt: Date;
  deliveryDate: Date | null;
  completedAt: Date | null;
};

export type OrderDetail = OrderRecord & {
  client: { id: number; razonSocial: string; cuit: string };
  formula: { id: number; name: string; pricePerCubicMeter: number };
  truck: { id: number; patente: string; capacity: number } | null;
};

type FormulaMaterial = {
  siloStockId: number;
  kgPerCubicMeter: number;
};

type OrderForApproval = OrderRecord & {
  formula: { materials: FormulaMaterial[] };
};

type StockDecrement = {
  siloStockId: number;
  quantity: number;
};

type OrdersRepository = {
  findClientById(id: number): Promise<{ id: number } | null>;
  findFormulaById(id: number): Promise<{ id: number; pricePerCubicMeter: number } | null>;
  createOrder(input: {
    clientId: number;
    formulaId: number;
    quantity: number;
    priceSnapshot: number;
    deliveryDate?: Date;
  }): Promise<OrderDetail>;
  listOrders(input: ListOrdersInput): Promise<OrderRecord[]>;
  findOrderDetail(id: number): Promise<OrderDetail | null>;
  findOrderById(id: number): Promise<OrderRecord | null>;
  findTruckById(id: number): Promise<{ id: number; status: TruckStatus } | null>;
  updateOrder(id: number, input: Omit<UpdateOrderInput, "truckId">): Promise<OrderDetail | null>;
  assignTruck(input: { orderId: number; truckId: number }): Promise<OrderDetail>;
  findOrderForApproval(id: number): Promise<OrderForApproval | null>;
  hasCreditPayment(input: { clientId: number; reference: string }): Promise<boolean>;
  approveOrder(input: { orderId: number; stockDecrements: StockDecrement[] }): Promise<OrderDetail>;
  completeOrder(input: { orderId: number; truckId: number | null; completedAt: Date }): Promise<OrderDetail>;
  cancelOrder(id: number): Promise<OrderRecord | null>;
};

const KILOGRAMS_PER_TON = 1000;

export type OrderErrorCode =
  | "CLIENT_NOT_FOUND"
  | "FORMULA_NOT_FOUND"
  | "ORDER_NOT_FOUND"
  | "TRUCK_NOT_FOUND"
  | "ORDER_MUST_BE_APROBADA_TO_ASSIGN_TRUCK"
  | "TRUCK_NOT_AVAILABLE"
  | "ORDER_MUST_BE_PENDIENTE_TO_APPROVE"
  | "PAYMENT_REQUIRED"
  | "INSUFFICIENT_STOCK"
  | "ORDER_MUST_BE_APROBADA_TO_COMPLETE"
  | "ONLY_PENDIENTE_ORDERS_CAN_BE_CANCELLED";

export class OrderUseCaseError extends Error {
  constructor(
    readonly code: OrderErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "OrderUseCaseError";
  }
}

export const createOrder = async (
  repository: OrdersRepository,
  input: CreateOrderInput,
): Promise<OrderDetail> => {
  const [client, formula] = await Promise.all([
    repository.findClientById(input.clientId),
    repository.findFormulaById(input.formulaId),
  ]);

  if (!client) {
    throw new OrderUseCaseError("CLIENT_NOT_FOUND", "Client not found");
  }
  if (!formula) {
    throw new OrderUseCaseError("FORMULA_NOT_FOUND", "Formula not found");
  }

  return repository.createOrder({
    clientId: input.clientId,
    formulaId: input.formulaId,
    quantity: input.quantity,
    priceSnapshot: formula.pricePerCubicMeter,
    deliveryDate: input.deliveryDate ? new Date(input.deliveryDate) : undefined,
  });
};

export const listOrders = async (
  repository: OrdersRepository,
  input: ListOrdersInput,
): Promise<OrderRecord[]> => repository.listOrders(input);

export const getOrderDetail = async (
  repository: OrdersRepository,
  id: number,
): Promise<OrderDetail> => {
  const order = await repository.findOrderDetail(id);
  if (!order) {
    throw new OrderUseCaseError("ORDER_NOT_FOUND", "Order not found");
  }
  return order;
};

export const updateOrder = async (
  repository: OrdersRepository,
  id: number,
  input: UpdateOrderInput,
): Promise<OrderDetail> => {
  const { truckId, ...orderPatch } = input;

  if (truckId !== undefined) {
    const order = await repository.findOrderById(id);
    if (!order) {
      throw new OrderUseCaseError("ORDER_NOT_FOUND", "Order not found");
    }
    if (order.status !== "APROBADA") {
      throw new OrderUseCaseError(
        "ORDER_MUST_BE_APROBADA_TO_ASSIGN_TRUCK",
        "Order must be APROBADA to assign truck",
      );
    }

    if (truckId !== null) {
      const truck = await repository.findTruckById(truckId);
      if (!truck) {
        throw new OrderUseCaseError("TRUCK_NOT_FOUND", "Truck not found");
      }
      if (truck.status !== "DISPONIBLE") {
        throw new OrderUseCaseError("TRUCK_NOT_AVAILABLE", "Truck is not available");
      }

      return repository.assignTruck({ orderId: id, truckId });
    }
  }

  const updatedOrder = await repository.updateOrder(id, orderPatch);
  if (!updatedOrder) {
    throw new OrderUseCaseError("ORDER_NOT_FOUND", "Order not found");
  }
  return updatedOrder;
};

export const approveOrder = async (
  repository: OrdersRepository,
  id: number,
): Promise<OrderDetail> => {
  const order = await repository.findOrderForApproval(id);
  if (!order) {
    throw new OrderUseCaseError("ORDER_NOT_FOUND", "Order not found");
  }
  if (order.status !== "PENDIENTE") {
    throw new OrderUseCaseError(
      "ORDER_MUST_BE_PENDIENTE_TO_APPROVE",
      "Order must be PENDIENTE to approve",
    );
  }

  const hasPayment = await repository.hasCreditPayment({
    clientId: order.clientId,
    reference: String(id),
  });
  if (!hasPayment) {
    throw new OrderUseCaseError("PAYMENT_REQUIRED", "Payment required");
  }

  const stockDecrements = order.formula.materials.map((material) => ({
    siloStockId: material.siloStockId,
    quantity: (material.kgPerCubicMeter * order.quantity) / KILOGRAMS_PER_TON,
  }));

  return repository.approveOrder({ orderId: id, stockDecrements });
};

export const completeOrder = async (
  repository: OrdersRepository,
  id: number,
): Promise<OrderDetail> => {
  const order = await repository.findOrderById(id);
  if (!order) {
    throw new OrderUseCaseError("ORDER_NOT_FOUND", "Order not found");
  }
  if (order.status !== "APROBADA") {
    throw new OrderUseCaseError(
      "ORDER_MUST_BE_APROBADA_TO_COMPLETE",
      "Order must be APROBADA to complete",
    );
  }

  return repository.completeOrder({
    orderId: id,
    truckId: order.truckId,
    completedAt: new Date(),
  });
};

export const cancelOrder = async (
  repository: OrdersRepository,
  id: number,
): Promise<OrderRecord> => {
  const order = await repository.findOrderById(id);
  if (!order) {
    throw new OrderUseCaseError("ORDER_NOT_FOUND", "Order not found");
  }
  if (order.status !== "PENDIENTE") {
    throw new OrderUseCaseError(
      "ONLY_PENDIENTE_ORDERS_CAN_BE_CANCELLED",
      "Only PENDIENTE orders can be cancelled",
    );
  }

  const cancelled = await repository.cancelOrder(id);
  if (!cancelled) {
    throw new OrderUseCaseError("ORDER_NOT_FOUND", "Order not found");
  }
  return cancelled;
};

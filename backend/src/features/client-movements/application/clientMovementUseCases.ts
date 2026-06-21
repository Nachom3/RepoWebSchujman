export type MovementTipoValue = "DEBITO" | "CREDITO";

export type Movement = {
  id: number;
  tipo: MovementTipoValue;
  monto: number;
  fecha: Date;
  referencia: string | null;
  clientId: number;
};

export type CreateMovementInput = {
  tipo: MovementTipoValue;
  monto: number;
  referencia?: string;
};

export type ClientMovementRepository = {
  findClientBalance(clientId: number): Promise<{ id: number; saldo: number } | null>;
  findOrderOwner(orderId: number): Promise<{ id: number; clientId: number } | null>;
  createMovementAndUpdateBalance(input: {
    clientId: number;
    tipo: MovementTipoValue;
    monto: number;
    referencia?: string;
    newSaldo: number;
  }): Promise<Movement>;
  clientExists(clientId: number): Promise<boolean>;
  listByClient(clientId: number): Promise<Movement[]>;
};

export type CreateClientMovementResult =
  | { kind: "created"; movement: Movement }
  | { kind: "client-not-found" }
  | { kind: "reference-order-not-found" }
  | { kind: "reference-order-client-mismatch" };

export class CreateClientMovementUseCase {
  constructor(private readonly movements: ClientMovementRepository) {}

  async execute(clientId: number, input: CreateMovementInput): Promise<CreateClientMovementResult> {
    const client = await this.movements.findClientBalance(clientId);
    if (client === null) {
      return { kind: "client-not-found" };
    }

    if (input.tipo === "CREDITO" && input.referencia && /^\d+$/.test(input.referencia)) {
      const order = await this.movements.findOrderOwner(parseInt(input.referencia, 10));
      if (order === null) {
        return { kind: "reference-order-not-found" };
      }
      if (order.clientId !== clientId) {
        return { kind: "reference-order-client-mismatch" };
      }
    }

    const newSaldo = input.tipo === "DEBITO"
      ? client.saldo + input.monto
      : client.saldo - input.monto;

    return {
      kind: "created",
      movement: await this.movements.createMovementAndUpdateBalance({
        clientId,
        tipo: input.tipo,
        monto: input.monto,
        referencia: input.referencia,
        newSaldo,
      }),
    };
  }
}

export type ListClientMovementsResult =
  | { kind: "found"; movements: Movement[] }
  | { kind: "client-not-found" };

export class ListClientMovementsUseCase {
  constructor(private readonly movements: ClientMovementRepository) {}

  async execute(clientId: number): Promise<ListClientMovementsResult> {
    const clientExists = await this.movements.clientExists(clientId);
    if (!clientExists) {
      return { kind: "client-not-found" };
    }

    return {
      kind: "found",
      movements: await this.movements.listByClient(clientId),
    };
  }
}

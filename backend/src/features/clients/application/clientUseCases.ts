export type ClientStatusValue = "ACTIVE" | "DISABLED";

export type ClientSummary = {
  id: number;
  cuit: string;
  razonSocial: string;
  saldo: number;
  status: ClientStatusValue;
  createdAt: Date;
  updatedAt: Date;
};

export type ClientDetail = ClientSummary & {
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  contacto: string | null;
  condicionIVA: string | null;
  movements: { id: number; tipo: string; monto: number; fecha: Date; referencia: string | null }[];
  orders: { id: number; quantity: number; status: string; deliveryDate: Date | null }[];
};

export type CreateClientInput = {
  cuit: string;
  razonSocial: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  contacto?: string;
  condicionIVA?: string;
};

export type UpdateClientInput = Partial<Omit<CreateClientInput, "cuit">>;

export type ClientsRepository = {
  create(input: CreateClientInput): Promise<ClientSummary>;
  list(input: { status?: ClientStatusValue }): Promise<ClientSummary[]>;
  findDetail(id: number): Promise<ClientDetail | null>;
  update(id: number, input: UpdateClientInput): Promise<ClientSummary>;
  disable(id: number): Promise<ClientSummary>;
};

export class DuplicateClientCuitError extends Error {
  constructor() {
    super("CUIT already registered");
  }
}

export class ClientNotFoundError extends Error {
  constructor() {
    super("Client not found");
  }
}

export type CreateClientResult =
  | { kind: "created"; client: ClientSummary }
  | { kind: "duplicate-cuit" };

export class CreateClientUseCase {
  constructor(private readonly clients: ClientsRepository) {}

  async execute(input: CreateClientInput): Promise<CreateClientResult> {
    try {
      return { kind: "created", client: await this.clients.create(input) };
    } catch (err) {
      if (err instanceof DuplicateClientCuitError) {
        return { kind: "duplicate-cuit" };
      }
      throw err;
    }
  }
}

export class ListClientsUseCase {
  constructor(private readonly clients: ClientsRepository) {}

  execute(input: { status?: ClientStatusValue }): Promise<ClientSummary[]> {
    return this.clients.list(input);
  }
}

export type GetClientDetailResult =
  | { kind: "found"; client: ClientDetail }
  | { kind: "not-found" };

export class GetClientDetailUseCase {
  constructor(private readonly clients: ClientsRepository) {}

  async execute(id: number): Promise<GetClientDetailResult> {
    const client = await this.clients.findDetail(id);
    if (client === null) {
      return { kind: "not-found" };
    }

    return { kind: "found", client };
  }
}

export type UpdateClientResult =
  | { kind: "updated"; client: ClientSummary }
  | { kind: "not-found" };

export class UpdateClientUseCase {
  constructor(private readonly clients: ClientsRepository) {}

  async execute(id: number, input: UpdateClientInput): Promise<UpdateClientResult> {
    try {
      return { kind: "updated", client: await this.clients.update(id, input) };
    } catch (err) {
      if (err instanceof ClientNotFoundError) {
        return { kind: "not-found" };
      }
      throw err;
    }
  }
}

export type DisableClientResult =
  | { kind: "disabled"; client: ClientSummary }
  | { kind: "not-found" };

export class DisableClientUseCase {
  constructor(private readonly clients: ClientsRepository) {}

  async execute(id: number): Promise<DisableClientResult> {
    try {
      return { kind: "disabled", client: await this.clients.disable(id) };
    } catch (err) {
      if (err instanceof ClientNotFoundError) {
        return { kind: "not-found" };
      }
      throw err;
    }
  }
}

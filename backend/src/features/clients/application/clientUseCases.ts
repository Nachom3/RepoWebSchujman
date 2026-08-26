export type ClientStatusValue = "ACTIVE" | "DISABLED";

export type ClientSummary = {
  id: number;
  taxId: string | null;
  name: string;
  status: ClientStatusValue;
  email: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ClientDetail = ClientSummary & {
  address: string | null;
  contactName: string | null;
  notes: string | null;
  projects: {
    id: number;
    name: string;
    status: string;
    progressPercent: number;
  }[];
};

export type CreateClientInput = {
  taxId?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactName?: string;
  notes?: string;
};

export type UpdateClientInput = Partial<Omit<CreateClientInput, "taxId">>;

export type ClientsRepository = {
  create(input: CreateClientInput): Promise<ClientSummary>;
  list(input: { status?: ClientStatusValue }): Promise<ClientSummary[]>;
  findDetail(id: number): Promise<ClientDetail | null>;
  update(id: number, input: UpdateClientInput): Promise<ClientSummary>;
  disable(id: number): Promise<ClientSummary>;
};

export class DuplicateClientTaxIdError extends Error {
  constructor() {
    super("Tax ID already registered");
  }
}

export class ClientNotFoundError extends Error {
  constructor() {
    super("Client not found");
  }
}

export type CreateClientResult =
  | { kind: "created"; client: ClientSummary }
  | { kind: "duplicate-tax-id" };

export class CreateClientUseCase {
  constructor(private readonly clients: ClientsRepository) {}

  async execute(input: CreateClientInput): Promise<CreateClientResult> {
    try {
      return { kind: "created", client: await this.clients.create(input) };
    } catch (err) {
      if (err instanceof DuplicateClientTaxIdError) {
        return { kind: "duplicate-tax-id" };
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

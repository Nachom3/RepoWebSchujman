export type PaymentTypeValue = "COBRO" | "GASTO";
export type PaymentMethodValue =
  | "EFECTIVO"
  | "TRANSFERENCIA"
  | "CHEQUE"
  | "TARJETA"
  | "OTRO";

export type PaymentRecord = {
  id: number;
  type: PaymentTypeValue;
  method: PaymentMethodValue;
  amount: number;
  date: Date;
  reference: string | null;
  notes: string | null;
  clientId: number | null;
  projectId: number | null;
  createdAt: Date;
};

export type CreatePaymentInput = {
  type: PaymentTypeValue;
  method?: PaymentMethodValue;
  amount: number;
  date?: Date;
  reference?: string;
  notes?: string;
  clientId?: number | null;
  projectId?: number | null;
};

export type UpdatePaymentInput = Partial<CreatePaymentInput>;

export type PaymentsRepository = {
  create(input: CreatePaymentInput): Promise<PaymentRecord>;
  list(input: {
    type?: PaymentTypeValue;
    clientId?: number;
    projectId?: number;
  }): Promise<PaymentRecord[]>;
  listByClient(clientId: number): Promise<PaymentRecord[]>;
  findById(id: number): Promise<PaymentRecord | null>;
  update(id: number, input: UpdatePaymentInput): Promise<PaymentRecord>;
  delete(id: number): Promise<PaymentRecord>;
  clientExists(id: number): Promise<boolean>;
  projectExists(id: number): Promise<boolean>;
};

export class PaymentNotFoundError extends Error {
  constructor() {
    super("Payment not found");
  }
}

export class PaymentClientNotFoundError extends Error {
  constructor() {
    super("Client not found");
  }
}

export class PaymentProjectNotFoundError extends Error {
  constructor() {
    super("Project not found");
  }
}

export class CreatePaymentUseCase {
  constructor(private readonly payments: PaymentsRepository) {}

  async execute(input: CreatePaymentInput): Promise<PaymentRecord> {
    if (input.clientId && !(await this.payments.clientExists(input.clientId))) {
      throw new PaymentClientNotFoundError();
    }
    if (input.projectId && !(await this.payments.projectExists(input.projectId))) {
      throw new PaymentProjectNotFoundError();
    }
    return this.payments.create(input);
  }
}

export class ListPaymentsUseCase {
  constructor(private readonly payments: PaymentsRepository) {}

  execute(input: { type?: PaymentTypeValue; clientId?: number; projectId?: number }): Promise<PaymentRecord[]> {
    return this.payments.list(input);
  }
}

export class ListClientPaymentsUseCase {
  constructor(private readonly payments: PaymentsRepository) {}

  async execute(clientId: number): Promise<PaymentRecord[]> {
    if (!(await this.payments.clientExists(clientId))) {
      throw new PaymentClientNotFoundError();
    }
    return this.payments.listByClient(clientId);
  }
}

export class GetPaymentUseCase {
  constructor(private readonly payments: PaymentsRepository) {}

  async execute(id: number): Promise<PaymentRecord> {
    const payment = await this.payments.findById(id);
    if (!payment) {
      throw new PaymentNotFoundError();
    }
    return payment;
  }
}

export class UpdatePaymentUseCase {
  constructor(private readonly payments: PaymentsRepository) {}

  async execute(id: number, input: UpdatePaymentInput): Promise<PaymentRecord> {
    try {
      return await this.payments.update(id, input);
    } catch {
      throw new PaymentNotFoundError();
    }
  }
}

export class DeletePaymentUseCase {
  constructor(private readonly payments: PaymentsRepository) {}

  async execute(id: number): Promise<PaymentRecord> {
    try {
      return await this.payments.delete(id);
    } catch {
      throw new PaymentNotFoundError();
    }
  }
}

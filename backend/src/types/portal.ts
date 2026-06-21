export type PortalLoginResponse = {
  sessionToken: string;
  client: {
    id: number;
    razonSocial: string;
    cuit: string;
  };
};

export type PortalOrderResponse = {
  id: number;
  formulaId: number;
  quantity: number;
  obraAddress: string | null;
  scheduledDate: string | null;
  priceSnapshot: number | null;
  status: string;
  createdAt: string;
};

export type PortalOrderDetailResponse = PortalOrderResponse & {
  truck: { id: number; patente: string } | null;
  completedAt: string | null;
  statusHistory: { status: string; timestamp: string }[];
};

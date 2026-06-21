export type TruckStatus = "DISPONIBLE" | "EN_RECORRIDO";

export type CreateTruckDto = {
  patente: string;
  capacity: number;
};

export type UpdateTruckDto = {
  patente?: string;
  capacity?: number;
};

export type TruckResponse = {
  id: number;
  patente: string;
  capacity: number;
  status: TruckStatus;
};

export type TruckListResponse = TruckResponse[];

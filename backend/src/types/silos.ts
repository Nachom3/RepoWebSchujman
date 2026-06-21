export type CreateSiloDto = {
  material: string;
  quantity: number;
  unit: string;
  alertMin?: number;
};

export type UpdateSiloDto = {
  material?: string;
  quantity?: number;
  unit?: string;
  alertMin?: number;
};

export type SiloResponse = {
  id: number;
  material: string;
  quantity: number;
  unit: string;
  alertMin: number;
  isLow: boolean;
};

export type SiloListResponse = SiloResponse[];

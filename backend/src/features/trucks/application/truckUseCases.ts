import type {
  CreateTruckDto,
  TruckListResponse,
  TruckResponse,
  TruckStatus,
  UpdateTruckDto,
} from "../../../types/trucks";

type UseCaseResult<T, E extends string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type TruckRepository = {
  createTruck(
    data: CreateTruckDto,
  ): Promise<{ type: "created"; truck: TruckResponse } | { type: "patente_conflict" }>;
  listTrucks(): Promise<TruckResponse[]>;
  findTruckById(id: number): Promise<TruckResponse | null>;
  updateTruck(
    id: number,
    data: UpdateTruckDto,
  ): Promise<
    | { type: "updated"; truck: TruckResponse }
    | { type: "not_found" }
    | { type: "patente_conflict" }
  >;
  updateTruckStatus(id: number, status: TruckStatus): Promise<TruckResponse | null>;
  deleteTruck(id: number): Promise<TruckResponse | null>;
};

export async function createTruckUseCase(
  repository: TruckRepository,
  data: CreateTruckDto,
): Promise<UseCaseResult<TruckResponse, "patente_conflict">> {
  const result = await repository.createTruck(data);
  if (result.type === "patente_conflict") {
    return { ok: false, error: "patente_conflict" };
  }
  return { ok: true, value: result.truck };
}

export async function listTrucksUseCase(
  repository: TruckRepository,
): Promise<TruckListResponse> {
  return repository.listTrucks();
}

export async function getTruckUseCase(
  repository: TruckRepository,
  id: number,
): Promise<UseCaseResult<TruckResponse, "truck_not_found">> {
  const truck = await repository.findTruckById(id);
  if (!truck) {
    return { ok: false, error: "truck_not_found" };
  }
  return { ok: true, value: truck };
}

export async function updateTruckUseCase(
  repository: TruckRepository,
  id: number,
  data: UpdateTruckDto,
): Promise<UseCaseResult<TruckResponse, "truck_not_found" | "patente_conflict">> {
  const result = await repository.updateTruck(id, data);
  if (result.type === "not_found") {
    return { ok: false, error: "truck_not_found" };
  }
  if (result.type === "patente_conflict") {
    return { ok: false, error: "patente_conflict" };
  }
  return { ok: true, value: result.truck };
}

export async function toggleTruckStatusUseCase(
  repository: TruckRepository,
  id: number,
): Promise<UseCaseResult<TruckResponse, "truck_not_found">> {
  const truck = await repository.findTruckById(id);
  if (!truck) {
    return { ok: false, error: "truck_not_found" };
  }

  const newStatus: TruckStatus =
    truck.status === "DISPONIBLE" ? "EN_RECORRIDO" : "DISPONIBLE";
  const updated = await repository.updateTruckStatus(id, newStatus);
  if (!updated) {
    return { ok: false, error: "truck_not_found" };
  }
  return { ok: true, value: updated };
}

export async function deleteTruckUseCase(
  repository: TruckRepository,
  id: number,
): Promise<UseCaseResult<TruckResponse, "truck_not_found">> {
  const truck = await repository.deleteTruck(id);
  if (!truck) {
    return { ok: false, error: "truck_not_found" };
  }
  return { ok: true, value: truck };
}

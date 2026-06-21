import type {
  CreateSiloDto,
  SiloListResponse,
  SiloResponse,
  UpdateSiloDto,
} from "../../../types/silos";

type UseCaseResult<T, E extends string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type SiloRecord = Omit<SiloResponse, "isLow">;

export type SiloRepository = {
  createSilo(data: CreateSiloDto): Promise<SiloRecord>;
  listSilos(): Promise<SiloRecord[]>;
  findSiloById(id: number): Promise<SiloRecord | null>;
  updateSilo(id: number, data: UpdateSiloDto): Promise<SiloRecord | null>;
  deleteSilo(id: number): Promise<SiloRecord | null>;
};

function toSiloResponse(silo: SiloRecord): SiloResponse {
  return { ...silo, isLow: silo.quantity < silo.alertMin };
}

export async function createSiloUseCase(
  repository: SiloRepository,
  data: CreateSiloDto,
): Promise<SiloResponse> {
  return toSiloResponse(await repository.createSilo(data));
}

export async function listSilosUseCase(repository: SiloRepository): Promise<SiloListResponse> {
  const silos = await repository.listSilos();
  return silos.map(toSiloResponse);
}

export async function getSiloUseCase(
  repository: SiloRepository,
  id: number,
): Promise<UseCaseResult<SiloResponse, "silo_not_found">> {
  const silo = await repository.findSiloById(id);
  if (!silo) {
    return { ok: false, error: "silo_not_found" };
  }
  return { ok: true, value: toSiloResponse(silo) };
}

export async function updateSiloUseCase(
  repository: SiloRepository,
  id: number,
  data: UpdateSiloDto,
): Promise<UseCaseResult<SiloResponse, "silo_not_found">> {
  const silo = await repository.updateSilo(id, data);
  if (!silo) {
    return { ok: false, error: "silo_not_found" };
  }
  return { ok: true, value: toSiloResponse(silo) };
}

export async function deleteSiloUseCase(
  repository: SiloRepository,
  id: number,
): Promise<UseCaseResult<SiloResponse, "silo_not_found">> {
  const silo = await repository.deleteSilo(id);
  if (!silo) {
    return { ok: false, error: "silo_not_found" };
  }
  return { ok: true, value: toSiloResponse(silo) };
}

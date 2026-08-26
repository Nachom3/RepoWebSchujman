import crypto from "crypto";
import type {
  PortalLoginResponse,
  PortalProjectResponse,
  PortalProjectDetailResponse,
  PortalPaymentResponse,
} from "../../../types/portal";

export class PortalUseCaseError extends Error {
  constructor(
    readonly code: "CLIENT_NOT_FOUND_OR_INACTIVE" | "PROJECT_NOT_FOUND" | "PAYMENT_NOT_FOUND",
    message: string,
  ) {
    super(message);
    this.name = "PortalUseCaseError";
  }
}

const SESSION_TTL_HOURS = 24;

const sessionExpiresAt = (now = new Date()): Date =>
  new Date(now.getTime() + SESSION_TTL_HOURS * 60 * 60 * 1000);

export type PortalRepository = {
  findActiveClient(identifier: { id: number } | { taxId: string } | { normalizedTaxId: string }): Promise<{
    id: number;
    name: string;
    taxId: string | null;
  } | null>;
  createSession(data: { clientId: number; token: string; expiresAt: Date }): Promise<void>;
  deleteSession(token: string): Promise<void>;
  listProjectsByClient(clientId: number): Promise<{
    id: number;
    name: string;
    status: string;
    type: string;
    address: string | null;
    progressPercent: number;
    estimatedEnd: Date | null;
  }[]>;
  findProjectForClient(input: { projectId: number; clientId: number }): Promise<{
    id: number;
    name: string;
    status: string;
    type: string;
    address: string | null;
    description: string | null;
    progressPercent: number;
    estimatedStart: Date | null;
    estimatedEnd: Date | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    tasks: { id: number; title: string; status: string; progress: number }[];
  } | null>;
  listPaymentsByClient(clientId: number): Promise<{
    id: number;
    type: string;
    method: string;
    amount: number;
    date: Date;
    projectId: number | null;
  }[]>;
};

export const portalLogin = async (
  repository: PortalRepository,
  identifier: string,
): Promise<PortalLoginResponse> => {
  const trimmed = identifier.trim();
  const normalizedTaxId = trimmed.replace(/\D+/g, "");

  if (normalizedTaxId.length === 0) {
    throw new PortalUseCaseError(
      "CLIENT_NOT_FOUND_OR_INACTIVE",
      "Client not found or inactive",
    );
  }

  const client = await repository.findActiveClient({ normalizedTaxId });

  if (!client) {
    throw new PortalUseCaseError(
      "CLIENT_NOT_FOUND_OR_INACTIVE",
      "Client not found or inactive",
    );
  }

  const token = crypto.randomUUID();
  const expiresAt = sessionExpiresAt();
  await repository.createSession({ clientId: client.id, token, expiresAt });

  return {
    sessionToken: token,
    client: {
      id: client.id,
      name: client.name,
      taxId: client.taxId,
    },
  };
};

export const portalLogout = async (
  repository: PortalRepository,
  token: string,
): Promise<void> => {
  await repository.deleteSession(token);
};

export const portalListProjects = async (
  repository: PortalRepository,
  clientId: number,
): Promise<PortalProjectResponse[]> => {
  const projects = await repository.listProjectsByClient(clientId);
  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    type: p.type,
    address: p.address,
    progressPercent: p.progressPercent,
    estimatedEnd: p.estimatedEnd?.toISOString() ?? null,
  }));
};

export const portalGetProject = async (
  repository: PortalRepository,
  clientId: number,
  projectId: number,
): Promise<PortalProjectDetailResponse> => {
  const project = await repository.findProjectForClient({ projectId, clientId });
  if (!project) {
    throw new PortalUseCaseError("PROJECT_NOT_FOUND", "Project not found");
  }
  return {
    id: project.id,
    name: project.name,
    status: project.status,
    type: project.type,
    address: project.address,
    description: project.description,
    progressPercent: project.progressPercent,
    estimatedStart: project.estimatedStart?.toISOString() ?? null,
    estimatedEnd: project.estimatedEnd?.toISOString() ?? null,
    startedAt: project.startedAt?.toISOString() ?? null,
    finishedAt: project.finishedAt?.toISOString() ?? null,
    tasks: project.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      progress: t.progress,
    })),
  };
};

export const portalListPayments = async (
  repository: PortalRepository,
  clientId: number,
): Promise<PortalPaymentResponse[]> => {
  const payments = await repository.listPaymentsByClient(clientId);
  return payments.map((p) => ({
    id: p.id,
    type: p.type,
    method: p.method,
    amount: p.amount,
    date: p.date.toISOString(),
    projectId: p.projectId,
  }));
};

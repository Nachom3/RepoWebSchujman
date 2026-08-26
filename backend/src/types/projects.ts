import type { Project } from "@prisma/client";

export type ProjectResponse = Pick<
  Project,
  | "id"
  | "name"
  | "type"
  | "status"
  | "address"
  | "progressPercent"
  | "clientId"
  | "estimatedStart"
  | "estimatedEnd"
  | "createdAt"
  | "updatedAt"
>;

export type ProjectListResponse = ProjectResponse[];

export type ProjectDetailResponse = ProjectResponse & {
  description: string | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  client: { id: number; name: string; taxId: string | null };
};

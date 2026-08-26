import { z } from "zod";

export type ProjectType =
  | "VIVIENDA"
  | "LOCAL_COMERCIAL"
  | "AMPLIACION"
  | "REMODELACION"
  | "EDIFICIO"
  | "GALPON"
  | "OTRO";

export type ProjectStatus =
  | "PENDIENTE"
  | "EN_CURSO"
  | "PAUSADA"
  | "FINALIZADA"
  | "CANCELADA";

export interface Project {
  id: number;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  address: string | null;
  progressPercent: number;
  clientId: number;
  estimatedStart: string | null;
  estimatedEnd: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetail extends Project {
  description: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  client: { id: number; name: string; taxId: string | null };
}

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  type: z
    .enum([
      "VIVIENDA",
      "LOCAL_COMERCIAL",
      "AMPLIACION",
      "REMODELACION",
      "EDIFICIO",
      "GALPON",
      "OTRO",
    ])
    .optional(),
  status: z
    .enum(["PENDIENTE", "EN_CURSO", "PAUSADA", "FINALIZADA", "CANCELADA"])
    .optional(),
  description: z.string().trim().optional(),
  address: z.string().trim().optional(),
  clientId: z.number().int().positive("Client is required"),
  estimatedStart: z.string().optional(),
  estimatedEnd: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1).optional(),
  type: z
    .enum([
      "VIVIENDA",
      "LOCAL_COMERCIAL",
      "AMPLIACION",
      "REMODELACION",
      "EDIFICIO",
      "GALPON",
      "OTRO",
    ])
    .optional(),
  status: z
    .enum(["PENDIENTE", "EN_CURSO", "PAUSADA", "FINALIZADA", "CANCELADA"])
    .optional(),
  description: z.string().trim().optional(),
  address: z.string().trim().optional(),
  estimatedStart: z.string().optional(),
  estimatedEnd: z.string().optional(),
  progressPercent: z.number().int().min(0).max(100).optional(),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;

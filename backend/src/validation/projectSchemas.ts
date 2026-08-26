import { z } from "zod";

const projectType = z.enum([
  "VIVIENDA",
  "LOCAL_COMERCIAL",
  "AMPLIACION",
  "REMODELACION",
  "EDIFICIO",
  "GALPON",
  "OTRO",
]);

const projectStatus = z.enum([
  "PENDIENTE",
  "EN_CURSO",
  "PAUSADA",
  "FINALIZADA",
  "CANCELADA",
]);

const dateField = z
  .string()
  .datetime()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const createProjectBodySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  type: projectType.optional(),
  status: projectStatus.optional(),
  description: z.string().trim().optional(),
  address: z.string().trim().optional(),
  clientId: z.number().int().positive(),
  estimatedStart: dateField,
  estimatedEnd: dateField,
});

export const updateProjectBodySchema = z.object({
  name: z.string().trim().min(1).optional(),
  type: projectType.optional(),
  status: projectStatus.optional(),
  description: z.string().trim().optional(),
  address: z.string().trim().optional(),
  estimatedStart: dateField,
  estimatedEnd: dateField,
  progressPercent: z.number().int().min(0).max(100).optional(),
});

export const listProjectsQuerySchema = z.object({
  status: projectStatus.optional(),
  clientId: z.coerce.number().int().positive().optional(),
});

export type CreateProjectBody = z.infer<typeof createProjectBodySchema>;
export type UpdateProjectBody = z.infer<typeof updateProjectBodySchema>;
export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;

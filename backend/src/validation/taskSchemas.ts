import { z } from "zod";

const taskStatus = z.enum(["PENDIENTE", "EN_PROCESO", "TERMINADA", "ATRASADA"]);

const dateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const createTaskBodySchema = z.object({
  projectId: z.number().int().positive(),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  status: taskStatus.optional(),
  stage: z.string().trim().optional(),
  startDate: dateField,
  endDate: dateField,
  progress: z.number().int().min(0).max(100).optional(),
});

export const updateTaskBodySchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  status: taskStatus.optional(),
  stage: z.string().trim().optional(),
  startDate: dateField,
  endDate: dateField,
  progress: z.number().int().min(0).max(100).optional(),
});

export const listTasksQuerySchema = z.object({
  projectId: z.coerce.number().int().positive().optional(),
  status: taskStatus.optional(),
});

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;

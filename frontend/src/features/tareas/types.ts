import { z } from "zod";

export type TaskStatus = "PENDIENTE" | "EN_PROCESO" | "TERMINADA" | "ATRASADA";

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  stage: string | null;
  startDate: string | null;
  endDate: string | null;
  completedAt: string | null;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export const createTaskSchema = z.object({
  projectId: z.number().int().positive(),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  status: z
    .enum(["PENDIENTE", "EN_PROCESO", "TERMINADA", "ATRASADA"])
    .optional(),
  stage: z.string().trim().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  progress: z.number().int().min(0).max(100).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  status: z
    .enum(["PENDIENTE", "EN_PROCESO", "TERMINADA", "ATRASADA"])
    .optional(),
  stage: z.string().trim().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  progress: z.number().int().min(0).max(100).optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

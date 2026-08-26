import { api } from "@/lib/api";
import type { Task } from "../types";

export async function getTasks(params?: { projectId?: number }): Promise<Task[]> {
  const { data } = await api.get<Task[]>("/tasks", { params });
  return data;
}

export async function createTask(payload: {
  projectId: number;
  title: string;
  description?: string;
  status?: string;
  stage?: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
}): Promise<Task> {
  const { data } = await api.post<Task>("/tasks", payload);
  return data;
}

export async function updateTask(
  id: number,
  payload: Partial<{
    title: string;
    description: string;
    status: string;
    stage: string;
    startDate: string;
    endDate: string;
    progress: number;
  }>,
): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${id}`, payload);
  return data;
}

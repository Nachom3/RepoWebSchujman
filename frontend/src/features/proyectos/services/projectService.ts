import { api } from "@/lib/api";
import type { Project, ProjectDetail, ProjectStatus } from "../types";

export async function getProjects(status?: ProjectStatus): Promise<Project[]> {
  const params = status ? { status } : undefined;
  const { data } = await api.get<Project[]>("/projects", { params });
  return data;
}

export async function getProjectById(id: number): Promise<ProjectDetail> {
  const { data } = await api.get<ProjectDetail>(`/projects/${id}`);
  return data;
}

export async function createProject(payload: {
  name: string;
  type?: string;
  status?: string;
  description?: string;
  address?: string;
  clientId: number;
  estimatedStart?: string;
  estimatedEnd?: string;
}): Promise<Project> {
  const { data } = await api.post<Project>("/projects", payload);
  return data;
}

export async function updateProject(
  id: number,
  payload: Partial<{
    name: string;
    type: string;
    status: string;
    description: string;
    address: string;
    estimatedStart: string;
    estimatedEnd: string;
    progressPercent: number;
  }>,
): Promise<Project> {
  const { data } = await api.patch<Project>(`/projects/${id}`, payload);
  return data;
}

export async function deleteProject(id: number): Promise<Project> {
  const { data } = await api.delete<Project>(`/projects/${id}`);
  return data;
}

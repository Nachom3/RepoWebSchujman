import { api } from "@/lib/api";
import type {
  CreateProjectStaffFormData,
  CreateStaffFormData,
  ProjectStaffAssignment,
  ProjectStaffStatus,
  StaffMember,
  StaffStatus,
  UpdateProjectStaffFormData,
  UpdateStaffFormData,
} from "../types";

export interface ListStaffParams {
  active?: boolean;
  status?: StaffStatus;
}

export async function getStaff(params: ListStaffParams = {}): Promise<StaffMember[]> {
  const { data } = await api.get<StaffMember[]>("/staff", { params });
  return data;
}

export async function getStaffById(id: number): Promise<StaffMember> {
  const { data } = await api.get<StaffMember>(`/staff/${id}`);
  return data;
}

export async function createStaff(payload: CreateStaffFormData): Promise<StaffMember> {
  const { data } = await api.post<StaffMember>("/staff", payload);
  return data;
}

export async function updateStaff(
  id: number,
  payload: UpdateStaffFormData,
): Promise<StaffMember> {
  const { data } = await api.patch<StaffMember>(`/staff/${id}`, payload);
  return data;
}

export async function deleteStaff(id: number): Promise<StaffMember> {
  const { data } = await api.delete<StaffMember>(`/staff/${id}`);
  return data;
}

export async function getProjectStaff(
  projectId: number,
): Promise<ProjectStaffAssignment[]> {
  const { data } = await api.get<ProjectStaffAssignment[]>(
    `/projects/${projectId}/staff`,
  );
  return data;
}

export async function assignProjectStaff(
  projectId: number,
  payload: CreateProjectStaffFormData,
): Promise<ProjectStaffAssignment> {
  const { data } = await api.post<ProjectStaffAssignment>(
    `/projects/${projectId}/staff`,
    payload,
  );
  return data;
}

export async function updateProjectStaff(
  projectId: number,
  assignmentId: number,
  payload: UpdateProjectStaffFormData,
): Promise<ProjectStaffAssignment> {
  const { data } = await api.patch<ProjectStaffAssignment>(
    `/projects/${projectId}/staff/${assignmentId}`,
    payload,
  );
  return data;
}

export async function removeProjectStaff(
  projectId: number,
  assignmentId: number,
): Promise<ProjectStaffAssignment> {
  const { data } = await api.delete<ProjectStaffAssignment>(
    `/projects/${projectId}/staff/${assignmentId}`,
  );
  return data;
}

export type { ProjectStaffStatus };

import { useCallback, useEffect, useState } from "react";
import {
  assignProjectStaff,
  getProjectStaff,
  removeProjectStaff,
  updateProjectStaff,
  type ProjectStaffStatus,
} from "../services/staffService";
import type {
  CreateProjectStaffFormData,
  ProjectStaffAssignment,
  UpdateProjectStaffFormData,
} from "../types";

export function useProjectStaff(projectId: number | null) {
  const [data, setData] = useState<ProjectStaffAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((current) => current + 1), []);

  useEffect(() => {
    if (projectId === null) {
      setData([]);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getProjectStaff(projectId)
      .then((list) => {
        if (!cancelled) setData(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar equipo");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId, refreshKey]);

  const assign = useCallback(
    async (payload: CreateProjectStaffFormData): Promise<ProjectStaffAssignment> => {
      if (projectId === null) {
        throw new Error("Proyecto inválido");
      }
      const result = await assignProjectStaff(projectId, payload);
      refresh();
      return result;
    },
    [projectId, refresh],
  );

  const update = useCallback(
    async (
      assignmentId: number,
      payload: UpdateProjectStaffFormData,
    ): Promise<ProjectStaffAssignment> => {
      if (projectId === null) {
        throw new Error("Proyecto inválido");
      }
      const result = await updateProjectStaff(projectId, assignmentId, payload);
      refresh();
      return result;
    },
    [projectId, refresh],
  );

  const remove = useCallback(
    async (assignmentId: number): Promise<ProjectStaffAssignment> => {
      if (projectId === null) {
        throw new Error("Proyecto inválido");
      }
      const result = await removeProjectStaff(projectId, assignmentId);
      refresh();
      return result;
    },
    [projectId, refresh],
  );

  return { data, isLoading, error, refresh, assign, update, remove };
}

export type { ProjectStaffStatus };

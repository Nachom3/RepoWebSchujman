import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";
import type { Project, ProjectStatus } from "../types";

export function useProjects(status?: ProjectStatus) {
  const [data, setData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getProjects(status)
      .then((projects) => {
        if (!cancelled) setData(projects);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error loading projects");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  return { data, isLoading, error };
}

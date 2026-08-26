import { useEffect, useState } from "react";
import { getProjectById } from "../services/projectService";
import type { ProjectDetail } from "../types";

export function useProject(id: number | null) {
  const [data, setData] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setData(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getProjectById(id)
      .then((project) => {
        if (!cancelled) setData(project);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error loading project");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, isLoading, error };
}

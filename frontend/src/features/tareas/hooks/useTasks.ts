import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import type { Task } from "../types";

export function useTasks(params?: { projectId?: number }) {
  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = params?.projectId ?? "all";

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getTasks(params)
      .then((tasks) => {
        if (!cancelled) setData(tasks);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error loading tasks");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, isLoading, error };
}

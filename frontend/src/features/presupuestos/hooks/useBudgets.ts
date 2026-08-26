import { useEffect, useState } from "react";
import { getBudgets } from "../services/budgetService";
import type { Budget } from "../types";

export function useBudgets(params?: { projectId?: number }) {
  const [data, setData] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = params?.projectId ?? "all";

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getBudgets(params)
      .then((budgets) => {
        if (!cancelled) setData(budgets);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error loading budgets");
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

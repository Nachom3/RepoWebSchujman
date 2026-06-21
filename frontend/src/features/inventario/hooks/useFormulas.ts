import { useState, useEffect } from "react";
import { getFormulas } from "../services/formulaService";
import type { Formula } from "../types";

export function useFormulas() {
  const [data, setData] = useState<Formula[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getFormulas()
      .then((formulas) => {
        if (!cancelled) setData(formulas);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load formulas");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading, error };
}

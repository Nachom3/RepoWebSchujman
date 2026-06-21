import { useState, useEffect } from "react";
import { getFormulaById } from "../services/formulaService";
import type { FormulaDetail } from "../types";

export function useFormula(id: number) {
  const [data, setData] = useState<FormulaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getFormulaById(id)
      .then((formula) => {
        if (!cancelled) setData(formula);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load formula");
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

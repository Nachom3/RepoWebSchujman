import { useState, useEffect } from "react";
import { getMovements } from "../services/movementService";
import type { Movement } from "../types";

export function useClientMovements(clientId: number) {
  const [data, setData] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getMovements(clientId)
      .then((movements) => {
        if (!cancelled) setData(movements);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load movements");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [clientId]);

  return { data, isLoading, error };
}
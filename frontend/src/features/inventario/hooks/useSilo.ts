import { useState, useEffect } from "react";
import { getSiloById } from "../services/siloService";
import type { SiloStock } from "../types";

export function useSilo(id: number) {
  const [data, setData] = useState<SiloStock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getSiloById(id)
      .then((silo) => {
        if (!cancelled) setData(silo);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load silo");
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

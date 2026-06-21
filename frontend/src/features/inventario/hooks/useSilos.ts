import { useState, useEffect } from "react";
import { getSilos } from "../services/siloService";
import type { SiloStock } from "../types";

export function useSilos() {
  const [data, setData] = useState<SiloStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getSilos()
      .then((silos) => {
        if (!cancelled) setData(silos);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load silos");
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

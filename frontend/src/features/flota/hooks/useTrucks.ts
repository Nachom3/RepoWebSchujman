import { useState, useEffect } from "react";
import { getTrucks } from "../services/truckService";
import type { Truck } from "../types";

export function useTrucks() {
  const [data, setData] = useState<Truck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getTrucks()
      .then((trucks) => {
        if (!cancelled) setData(trucks);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load trucks");
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

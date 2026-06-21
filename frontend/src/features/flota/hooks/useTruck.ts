import { useState, useEffect } from "react";
import { getTruckById } from "../services/truckService";
import type { Truck } from "../types";

export function useTruck(id: number) {
  const [data, setData] = useState<Truck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getTruckById(id)
      .then((truck) => {
        if (!cancelled) setData(truck);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load truck");
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

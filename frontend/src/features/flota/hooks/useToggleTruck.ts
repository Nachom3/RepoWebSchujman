import { useState } from "react";
import { toggleTruckStatus } from "../services/truckService";
import type { Truck } from "../types";

export function useToggleTruck() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (id: number): Promise<Truck | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const truck = await toggleTruckStatus(id);
      return truck;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle truck status");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}

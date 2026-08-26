import { useEffect, useState } from "react";
import { getMaterials } from "../services/materialService";
import type { Material } from "../types";

export function useMaterials() {
  const [data, setData] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getMaterials()
      .then((materials) => {
        if (!cancelled) setData(materials);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error loading materials");
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

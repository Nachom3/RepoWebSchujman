import { useEffect, useState } from "react";
import { getSuppliers } from "../services/supplierService";
import type { Supplier } from "../types";

export function useSuppliers() {
  const [data, setData] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getSuppliers()
      .then((suppliers) => {
        if (!cancelled) setData(suppliers);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error loading suppliers");
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

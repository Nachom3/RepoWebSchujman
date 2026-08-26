import { useEffect, useState } from "react";
import { getPayments } from "../services/paymentService";
import type { Payment } from "../types";

export function usePayments(params?: {
  type?: "COBRO" | "GASTO";
  clientId?: number;
  projectId?: number;
}) {
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = JSON.stringify(params ?? {});

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getPayments(params)
      .then((payments) => {
        if (!cancelled) setData(payments);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error loading payments");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, isLoading, error };
}

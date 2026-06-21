import { useState, useEffect } from "react";
import { getOrderById } from "../services/orderService";
import type { OrderDetail } from "../types";

export function useOrder(id: number) {
  const [data, setData] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getOrderById(id)
      .then((order) => {
        if (!cancelled) setData(order);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load order");
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

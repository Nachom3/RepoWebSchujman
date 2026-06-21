import { useState, useEffect } from "react";
import { getOrders } from "../services/orderService";
import type { Order, OrderStatus } from "../types";

export function useOrders(status?: OrderStatus) {
  const [data, setData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getOrders(status)
      .then((orders) => {
        if (!cancelled) setData(orders);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load orders");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  return { data, isLoading, error };
}

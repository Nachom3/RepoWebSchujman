import { useState, useEffect, useCallback } from "react";
import { listPortalOrders } from "../services/portalService";
import type { PortalOrder } from "../types";

export function usePortalOrders(token: string | null) {
  const [data, setData] = useState<PortalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    if (!token) {
      setData([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    listPortalOrders(token)
      .then((orders) => setData(orders))
      .catch((err) => setError(err.message ?? "Failed to load orders"))
      .finally(() => setIsLoading(false));
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { data, isLoading, error, refetch: fetchOrders };
}

import { useState } from "react";
import { approveOrder } from "../services/orderService";
import type { OrderDetail } from "../types";

export function useApproveOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (id: number): Promise<OrderDetail | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const order = await approveOrder(id);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve order");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}

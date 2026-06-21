import { useState, useEffect } from "react";
import { getClients } from "../services/clientService";
import type { Client, ClientStatus } from "../types";

export function useClients(status?: ClientStatus) {
  const [data, setData] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getClients(status)
      .then((clients) => {
        if (!cancelled) setData(clients);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load clients");
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
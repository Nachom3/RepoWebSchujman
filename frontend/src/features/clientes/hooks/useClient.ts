import { useState, useEffect } from "react";
import { getClientById } from "../services/clientService";
import type { ClientDetail } from "../types";

export function useClient(id: number) {
  const [data, setData] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getClientById(id)
      .then((client) => {
        if (!cancelled) setData(client);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load client");
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
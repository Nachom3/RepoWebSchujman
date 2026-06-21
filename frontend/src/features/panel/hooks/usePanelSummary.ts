import { useState, useEffect } from "react";
import { getPanelSummary } from "../services/panelService";
import type { PanelSummary } from "../types";

export function usePanelSummary() {
  const [data, setData] = useState<PanelSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getPanelSummary()
      .then((summary) => {
        if (!cancelled) setData(summary);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load panel summary");
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

import { useCallback, useEffect, useState } from "react";
import { getStaff, type ListStaffParams } from "../services/staffService";
import type { StaffMember } from "../types";

export function useStaff(params: ListStaffParams = {}) {
  const [data, setData] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((current) => current + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getStaff(params)
      .then((staff) => {
        if (!cancelled) setData(staff);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error loading staff");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, params.active, params.status]);

  return { data, isLoading, error, refresh };
}

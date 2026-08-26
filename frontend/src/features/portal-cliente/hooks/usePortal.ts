import { useEffect, useState } from "react";
import { getPortalProject, listPortalPayments, listPortalProjects } from "../services/portalService";
import type { PortalPayment, PortalProject, PortalProjectDetail } from "../types";

export function usePortalProjects(token: string | null) {
  const [data, setData] = useState<PortalProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setData([]);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    listPortalProjects(token)
      .then((projects) => {
        if (!cancelled) setData(projects);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error loading projects");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return { data, isLoading, error };
}

export function usePortalProject(token: string | null, projectId: number | null) {
  const [data, setData] = useState<PortalProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || projectId === null) {
      setData(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getPortalProject(token, projectId)
      .then((project) => {
        if (!cancelled) setData(project);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error loading project");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, projectId]);

  return { data, isLoading, error };
}

export function usePortalPayments(token: string | null) {
  const [data, setData] = useState<PortalPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setData([]);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    listPortalPayments(token)
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
  }, [token]);

  return { data, isLoading, error };
}

import { api } from "@/lib/api";
import type { PanelSummary } from "../types";

export async function getPanelSummary(): Promise<PanelSummary> {
  const { data } = await api.get<PanelSummary>("/panel/summary");
  return data;
}

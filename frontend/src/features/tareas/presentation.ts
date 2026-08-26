import type { TaskStatus } from "./types";

export const STATUS_LABEL: Record<TaskStatus, string> = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En proceso",
  TERMINADA: "Terminada",
  ATRASADA: "Atrasada",
};

export const STATUS_VARIANT: Record<
  TaskStatus,
  "outline" | "secondary" | "default" | "destructive"
> = {
  PENDIENTE: "outline",
  EN_PROCESO: "default",
  TERMINADA: "default",
  ATRASADA: "destructive",
};

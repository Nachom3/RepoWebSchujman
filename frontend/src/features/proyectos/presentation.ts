import type { ProjectStatus } from "./types";

export const PROJECT_STATUSES: ProjectStatus[] = [
  "PENDIENTE",
  "EN_CURSO",
  "PAUSADA",
  "FINALIZADA",
  "CANCELADA",
];

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  PENDIENTE: "Pendiente",
  EN_CURSO: "En curso",
  PAUSADA: "Pausada",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
};

export const STATUS_VARIANT: Record<
  ProjectStatus,
  "outline" | "secondary" | "default" | "destructive"
> = {
  PENDIENTE: "outline",
  EN_CURSO: "default",
  PAUSADA: "secondary",
  FINALIZADA: "default",
  CANCELADA: "destructive",
};

export const STATUS_BADGE_CLASS: Partial<Record<ProjectStatus, string>> = {
  FINALIZADA:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  EN_CURSO: "",
  PAUSADA: "",
};

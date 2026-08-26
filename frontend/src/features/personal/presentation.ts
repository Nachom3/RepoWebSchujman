import type {
  ProjectStaffStatus,
  StaffMember,
  StaffRole,
  StaffStatus,
} from "./types";

export const STAFF_ROLES: StaffRole[] = [
  "ARQUITECTO",
  "INGENIERO",
  "PROJECT_MANAGER",
  "SITE_MANAGER",
  "CAPATAZ",
  "ALBANIL",
  "WORKER",
  "ELECTRICISTA",
  "PLOMERO",
  "PINTOR",
  "ADMINISTRATIVE",
  "OTRO",
];

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  ARQUITECTO: "Arquitecto",
  INGENIERO: "Ingeniero",
  PROJECT_MANAGER: "Jefe de proyecto",
  SITE_MANAGER: "Jefe de obra",
  CAPATAZ: "Capataz",
  ALBANIL: "Albañil",
  WORKER: "Oficial/Ayudante",
  ELECTRICISTA: "Electricista",
  PLOMERO: "Plomero",
  PINTOR: "Pintor",
  ADMINISTRATIVE: "Administrativo",
  OTRO: "Otro",
};

export const STAFF_STATUSES: StaffStatus[] = ["ACTIVE", "INACTIVE", "ON_LEAVE"];

export const STAFF_STATUS_LABELS: Record<StaffStatus, string> = {
  ACTIVE: "Disponible",
  INACTIVE: "Inactivo",
  ON_LEAVE: "Con licencia",
};

export const STAFF_STATUS_VARIANTS: Record<StaffStatus, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  INACTIVE: "bg-muted text-muted-foreground",
  ON_LEAVE: "bg-amber-500/10 text-amber-700 border-amber-200",
};

export const PROJECT_STAFF_STATUSES: ProjectStaffStatus[] = [
  "ASSIGNED",
  "ACTIVE",
  "FINISHED",
  "PAUSED",
];

export const PROJECT_STAFF_STATUS_LABELS: Record<ProjectStaffStatus, string> = {
  ASSIGNED: "Asignado",
  ACTIVE: "En obra",
  FINISHED: "Finalizado",
  PAUSED: "En pausa",
};

export const PROJECT_STAFF_STATUS_VARIANTS: Record<ProjectStaffStatus, string> = {
  ASSIGNED: "bg-blue-500/10 text-blue-700 border-blue-200",
  ACTIVE: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  FINISHED: "bg-muted text-muted-foreground",
  PAUSED: "bg-amber-500/10 text-amber-700 border-amber-200",
};

export function staffRoleLabel(role: StaffRole | string): string {
  return STAFF_ROLE_LABELS[role as StaffRole] ?? String(role);
}

export function staffStatusLabel(status: StaffStatus | string): string {
  return STAFF_STATUS_LABELS[status as StaffStatus] ?? String(status);
}

export function staffStatusClass(status: StaffStatus | string): string {
  return STAFF_STATUS_VARIANTS[status as StaffStatus] ?? "bg-muted text-muted-foreground";
}

export function projectStaffStatusLabel(status: ProjectStaffStatus | string): string {
  return PROJECT_STAFF_STATUS_LABELS[status as ProjectStaffStatus] ?? String(status);
}

export function projectStaffStatusClass(status: ProjectStaffStatus | string): string {
  return (
    PROJECT_STAFF_STATUS_VARIANTS[status as ProjectStaffStatus] ??
    "bg-muted text-muted-foreground"
  );
}

export function isStaffAvailable(member: Pick<StaffMember, "status" | "active">): boolean {
  return member.active && member.status === "ACTIVE";
}

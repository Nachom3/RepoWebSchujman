import { z } from "zod";

export type StaffRole =
  | "ARQUITECTO"
  | "INGENIERO"
  | "PROJECT_MANAGER"
  | "SITE_MANAGER"
  | "CAPATAZ"
  | "ALBANIL"
  | "WORKER"
  | "ELECTRICISTA"
  | "PLOMERO"
  | "PINTOR"
  | "ADMINISTRATIVE"
  | "OTRO";

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

export type StaffStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";

export const STAFF_STATUSES: StaffStatus[] = ["ACTIVE", "INACTIVE", "ON_LEAVE"];

export const STAFF_STATUS_LABELS: Record<StaffStatus, string> = {
  ACTIVE: "Disponible",
  INACTIVE: "Inactivo",
  ON_LEAVE: "Con licencia",
};

export type ProjectStaffStatus = "ASSIGNED" | "ACTIVE" | "FINISHED" | "PAUSED";

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

export interface StaffMember {
  id: number;
  fullName: string;
  role: StaffRole;
  status: StaffStatus;
  taxId: string | null;
  phone: string | null;
  email: string | null;
  dayRate: number;
  active: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  activeAssignments: number;
}

export interface ProjectStaffAssignment {
  id: number;
  projectId: number;
  staffId: number;
  role: StaffRole;
  responsibility: string | null;
  status: ProjectStaffStatus;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  supervisorId: number | null;
  assignedAt: string;
  staff: {
    id: number;
    fullName: string;
    role: StaffRole;
    dayRate: number;
    status: StaffStatus;
  };
  supervisor: {
    id: number;
    staffId: number;
    fullName: string;
    role: StaffRole;
  } | null;
  subordinatesCount: number;
}

export const staffRoleEnum = z.enum([
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
]);

export const staffStatusEnum = z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE"]);

export const projectStaffStatusEnum = z.enum([
  "ASSIGNED",
  "ACTIVE",
  "FINISHED",
  "PAUSED",
]);

export const createStaffSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required"),
  role: staffRoleEnum.optional(),
  status: staffStatusEnum.optional(),
  taxId: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  dayRate: z.number().min(0).optional(),
  notes: z.string().trim().optional(),
});

export const updateStaffSchema = createStaffSchema.partial();

export const createProjectStaffSchema = z.object({
  staffId: z.number().int().positive(),
  role: staffRoleEnum.optional(),
  responsibility: z.string().trim().optional(),
  status: projectStaffStatusEnum.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().trim().optional(),
  supervisorId: z.number().int().positive().nullable().optional(),
});

export const updateProjectStaffSchema = z.object({
  role: staffRoleEnum.optional(),
  responsibility: z.string().trim().optional(),
  status: projectStaffStatusEnum.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().trim().optional(),
  supervisorId: z.number().int().positive().nullable().optional(),
});

export type CreateStaffFormData = z.infer<typeof createStaffSchema>;
export type UpdateStaffFormData = z.infer<typeof updateStaffSchema>;
export type CreateProjectStaffFormData = z.infer<typeof createProjectStaffSchema>;
export type UpdateProjectStaffFormData = z.infer<typeof updateProjectStaffSchema>;

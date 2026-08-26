import { z } from "zod";

const staffRole = z.enum([
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

const staffStatus = z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE"]);

const projectStaffStatus = z.enum(["ASSIGNED", "ACTIVE", "FINISHED", "PAUSED"]);

export const createStaffBodySchema = z.object({
  fullName: z.string().trim().min(1, "Name is required"),
  role: staffRole.optional(),
  status: staffStatus.optional(),
  taxId: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email format").optional().or(z.literal("").transform(() => undefined)),
  dayRate: z.number().min(0).optional(),
  active: z.boolean().optional(),
  notes: z.string().trim().optional(),
});

export const updateStaffBodySchema = createStaffBodySchema.partial();

export const listStaffQuerySchema = z.object({
  active: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  status: staffStatus.optional(),
});

const dateField = z
  .string()
  .datetime()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const createProjectStaffBodySchema = z.object({
  staffId: z.number().int().positive(),
  role: staffRole.optional(),
  responsibility: z.string().trim().optional(),
  status: projectStaffStatus.optional(),
  startDate: dateField,
  endDate: dateField,
  notes: z.string().trim().optional(),
  supervisorId: z.number().int().positive().nullable().optional(),
});

export const updateProjectStaffBodySchema = z.object({
  role: staffRole.optional(),
  responsibility: z.string().trim().optional(),
  status: projectStaffStatus.optional(),
  startDate: dateField,
  endDate: dateField,
  notes: z.string().trim().optional(),
  supervisorId: z.number().int().positive().nullable().optional(),
});

export type CreateStaffBody = z.infer<typeof createStaffBodySchema>;
export type UpdateStaffBody = z.infer<typeof updateStaffBodySchema>;
export type ListStaffQuery = z.infer<typeof listStaffQuerySchema>;
export type CreateProjectStaffBody = z.infer<typeof createProjectStaffBodySchema>;
export type UpdateProjectStaffBody = z.infer<typeof updateProjectStaffBodySchema>;

import type { StaffMember, ProjectStaff } from "@prisma/client";

export type StaffRoleValue =
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

export type StaffStatusValue = "ACTIVE" | "INACTIVE" | "ON_LEAVE";

export type ProjectStaffStatusValue =
  | "ASSIGNED"
  | "ACTIVE"
  | "FINISHED"
  | "PAUSED";

export type StaffMemberRecord = {
  id: number;
  fullName: string;
  role: StaffRoleValue;
  status: StaffStatusValue;
  taxId: string | null;
  phone: string | null;
  email: string | null;
  dayRate: number;
  active: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectStaffRecord = {
  id: number;
  projectId: number;
  staffId: number;
  role: StaffRoleValue;
  responsibility: string | null;
  status: ProjectStaffStatusValue;
  startDate: Date | null;
  endDate: Date | null;
  notes: string | null;
  supervisorId: number | null;
  assignedAt: Date;
};

export type ProjectStaffDetail = ProjectStaffRecord & {
  staff: {
    id: number;
    fullName: string;
    role: StaffRoleValue;
    dayRate: number;
    status: StaffStatusValue;
  };
  supervisor: {
    id: number;
    staffId: number;
    fullName: string;
    role: StaffRoleValue;
  } | null;
  subordinatesCount: number;
};

export type CreateStaffInput = {
  fullName: string;
  role?: StaffRoleValue;
  status?: StaffStatusValue;
  taxId?: string;
  phone?: string;
  email?: string;
  dayRate?: number;
  active?: boolean;
  notes?: string;
};

export type UpdateStaffInput = Partial<CreateStaffInput>;

export type CreateProjectStaffInput = {
  projectId: number;
  staffId: number;
  role?: StaffRoleValue;
  responsibility?: string;
  status?: ProjectStaffStatusValue;
  startDate?: Date | null;
  endDate?: Date | null;
  notes?: string;
  supervisorId?: number | null;
};

export type UpdateProjectStaffInput = {
  role?: StaffRoleValue;
  responsibility?: string;
  status?: ProjectStaffStatusValue;
  startDate?: Date | null;
  endDate?: Date | null;
  notes?: string;
  supervisorId?: number | null;
};

export type StaffRepository = {
  create(input: CreateStaffInput): Promise<StaffMemberRecord>;
  list(input?: { active?: boolean; status?: StaffStatusValue }): Promise<StaffMemberRecord[]>;
  findById(id: number): Promise<StaffMemberRecord | null>;
  update(id: number, input: UpdateStaffInput): Promise<StaffMemberRecord>;
  delete(id: number): Promise<StaffMemberRecord>;
  existsByTaxId(taxId: string, excludeId?: number): Promise<boolean>;
};

export type ProjectStaffRepository = {
  create(input: CreateProjectStaffInput): Promise<ProjectStaffRecord>;
  listByProject(projectId: number): Promise<ProjectStaffDetail[]>;
  findById(id: number): Promise<ProjectStaffDetail | null>;
  update(id: number, input: UpdateProjectStaffInput): Promise<ProjectStaffRecord>;
  delete(id: number): Promise<ProjectStaffRecord>;
  existsStaffInProject(projectId: number, staffId: number): Promise<boolean>;
  staffExists(id: number): Promise<boolean>;
  projectExists(id: number): Promise<boolean>;
  assignmentBelongsToProject(assignmentId: number, projectId: number): Promise<boolean>;
  staffHasActiveAssignments(staffId: number): Promise<boolean>;
  countActiveAssignmentsByStaff(): Promise<Map<number, number>>;
};

export class StaffNotFoundError extends Error {
  constructor() {
    super("Staff member not found");
  }
}

export class DuplicateStaffTaxIdError extends Error {
  constructor() {
    super("Staff with this tax ID already exists");
  }
}

export class ProjectStaffNotFoundError extends Error {
  constructor() {
    super("Project staff assignment not found");
  }
}

export class StaffNotFoundForProjectError extends Error {
  constructor() {
    super("Staff member not found");
  }
}

export class ProjectNotFoundForProjectStaffError extends Error {
  constructor() {
    super("Project not found");
  }
}

export class DuplicateProjectStaffError extends Error {
  constructor() {
    super("Staff member already assigned to this project");
  }
}

export class SupervisorInOtherProjectError extends Error {
  constructor() {
    super("Supervisor assignment must belong to the same project");
  }
}

export class StaffInUseError extends Error {
  constructor() {
    super("Staff member is assigned to one or more projects");
  }
}

export class CreateStaffUseCase {
  constructor(private readonly staff: StaffRepository) {}

  async execute(input: CreateStaffInput): Promise<StaffMemberRecord> {
    if (input.taxId && (await this.staff.existsByTaxId(input.taxId))) {
      throw new DuplicateStaffTaxIdError();
    }
    return this.staff.create(input);
  }
}

export class ListStaffUseCase {
  constructor(private readonly staff: StaffRepository) {}

  execute(input?: { active?: boolean; status?: StaffStatusValue }): Promise<StaffMemberRecord[]> {
    return this.staff.list(input);
  }
}

export class GetStaffUseCase {
  constructor(private readonly staff: StaffRepository) {}

  async execute(id: number): Promise<StaffMemberRecord> {
    const member = await this.staff.findById(id);
    if (!member) {
      throw new StaffNotFoundError();
    }
    return member;
  }
}

export class UpdateStaffUseCase {
  constructor(private readonly staff: StaffRepository) {}

  async execute(id: number, input: UpdateStaffInput): Promise<StaffMemberRecord> {
    try {
      if (input.taxId && (await this.staff.existsByTaxId(input.taxId, id))) {
        throw new DuplicateStaffTaxIdError();
      }
      return await this.staff.update(id, input);
    } catch (err) {
      if (err instanceof DuplicateStaffTaxIdError) {
        throw err;
      }
      throw new StaffNotFoundError();
    }
  }
}

export class DeleteStaffUseCase {
  constructor(private readonly staff: StaffRepository) {}

  async execute(id: number): Promise<StaffMemberRecord> {
    try {
      return await this.staff.delete(id);
    } catch (err) {
      // Prisma will throw on FK if in use; surface a clearer domain error
      if (err instanceof Error && /Foreign key constraint/i.test(err.message)) {
        throw new StaffInUseError();
      }
      throw new StaffNotFoundError();
    }
  }
}

export class AssignStaffToProjectUseCase {
  constructor(private readonly projectStaff: ProjectStaffRepository) {}

  async execute(input: CreateProjectStaffInput): Promise<ProjectStaffRecord> {
    const projectExists = await this.projectStaff.projectExists(input.projectId);
    if (!projectExists) {
      throw new ProjectNotFoundForProjectStaffError();
    }
    const staffExists = await this.projectStaff.staffExists(input.staffId);
    if (!staffExists) {
      throw new StaffNotFoundForProjectError();
    }
    if (input.supervisorId !== null && input.supervisorId !== undefined) {
      const sameProject = await this.projectStaff.assignmentBelongsToProject(
        input.supervisorId,
        input.projectId,
      );
      if (!sameProject) {
        throw new SupervisorInOtherProjectError();
      }
    }
    if (await this.projectStaff.existsStaffInProject(input.projectId, input.staffId)) {
      throw new DuplicateProjectStaffError();
    }
    return this.projectStaff.create(input);
  }
}

export class ListProjectStaffUseCase {
  constructor(private readonly projectStaff: ProjectStaffRepository) {}

  async execute(projectId: number): Promise<ProjectStaffDetail[]> {
    const projectExists = await this.projectStaff.projectExists(projectId);
    if (!projectExists) {
      throw new ProjectNotFoundForProjectStaffError();
    }
    return this.projectStaff.listByProject(projectId);
  }
}

export class UpdateProjectStaffUseCase {
  constructor(private readonly projectStaff: ProjectStaffRepository) {}

  async execute(id: number, input: UpdateProjectStaffInput): Promise<ProjectStaffRecord> {
    const existing = await this.projectStaff.findById(id);
    if (!existing) {
      throw new ProjectStaffNotFoundError();
    }
    if (input.supervisorId !== null && input.supervisorId !== undefined) {
      if (input.supervisorId === id) {
        throw new SupervisorInOtherProjectError();
      }
      const sameProject = await this.projectStaff.assignmentBelongsToProject(
        input.supervisorId,
        existing.projectId,
      );
      if (!sameProject) {
        throw new SupervisorInOtherProjectError();
      }
    }
    try {
      return await this.projectStaff.update(id, input);
    } catch {
      throw new ProjectStaffNotFoundError();
    }
  }
}

export class RemoveProjectStaffUseCase {
  constructor(private readonly projectStaff: ProjectStaffRepository) {}

  async execute(id: number): Promise<ProjectStaffRecord> {
    try {
      return await this.projectStaff.delete(id);
    } catch {
      throw new ProjectStaffNotFoundError();
    }
  }
}

import prismaPkg from "@prisma/client";
import { prisma } from "../../../db/prisma";
import type {
  CreateProjectStaffInput,
  CreateStaffInput,
  ProjectStaffDetail,
  ProjectStaffRecord,
  ProjectStaffRepository,
  StaffMemberRecord,
  StaffRepository,
  UpdateProjectStaffInput,
  UpdateStaffInput,
} from "../application/staffUseCases";

const { Prisma } = prismaPkg;

function isNotFoundError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
}

function staffRecord(member: {
  id: number;
  fullName: string;
  role: string;
  status: string;
  taxId: string | null;
  phone: string | null;
  email: string | null;
  dayRate: number;
  active: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): StaffMemberRecord {
  return {
    id: member.id,
    fullName: member.fullName,
    role: member.role as StaffMemberRecord["role"],
    status: member.status as StaffMemberRecord["status"],
    taxId: member.taxId,
    phone: member.phone,
    email: member.email,
    dayRate: member.dayRate,
    active: member.active,
    notes: member.notes,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  };
}

function projectStaffRecord(assignment: {
  id: number;
  projectId: number;
  staffId: number;
  role: string;
  responsibility: string | null;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  notes: string | null;
  supervisorId: number | null;
  assignedAt: Date;
}): ProjectStaffRecord {
  return {
    id: assignment.id,
    projectId: assignment.projectId,
    staffId: assignment.staffId,
    role: assignment.role as ProjectStaffRecord["role"],
    responsibility: assignment.responsibility,
    status: assignment.status as ProjectStaffRecord["status"],
    startDate: assignment.startDate,
    endDate: assignment.endDate,
    notes: assignment.notes,
    supervisorId: assignment.supervisorId,
    assignedAt: assignment.assignedAt,
  };
}

export class PrismaStaffRepository implements StaffRepository {
  create(input: CreateStaffInput): Promise<StaffMemberRecord> {
    const status = input.status ?? (input.active === false ? "INACTIVE" : "ACTIVE");
    const active = input.active ?? status === "ACTIVE";
    return prisma.staffMember
      .create({
        data: {
          fullName: input.fullName,
          role: input.role ?? "OTRO",
          status,
          taxId: input.taxId,
          phone: input.phone,
          email: input.email,
          dayRate: input.dayRate ?? 0,
          active,
          notes: input.notes,
        },
      })
      .then(staffRecord);
  }

  list(input?: { active?: boolean; status?: "ACTIVE" | "INACTIVE" | "ON_LEAVE" }): Promise<StaffMemberRecord[]> {
    const where: prismaPkg.Prisma.StaffMemberWhereInput = {};
    if (input?.status) where.status = input.status;
    if (input?.active !== undefined) where.active = input.active;
    return prisma.staffMember
      .findMany({ where, orderBy: { fullName: "asc" } })
      .then((rows) => rows.map(staffRecord));
  }

  findById(id: number): Promise<StaffMemberRecord | null> {
    return prisma.staffMember
      .findUnique({ where: { id } })
      .then((row) => (row ? staffRecord(row) : null));
  }

  async update(id: number, input: UpdateStaffInput): Promise<StaffMemberRecord> {
    try {
      const data: prismaPkg.Prisma.StaffMemberUpdateInput = {};
      if (input.fullName !== undefined) data.fullName = input.fullName;
      if (input.role !== undefined) data.role = input.role;
      if (input.taxId !== undefined) data.taxId = input.taxId;
      if (input.phone !== undefined) data.phone = input.phone;
      if (input.email !== undefined) data.email = input.email;
      if (input.dayRate !== undefined) data.dayRate = input.dayRate;
      if (input.notes !== undefined) data.notes = input.notes;

      if (input.status !== undefined) {
        data.status = input.status;
        if (input.active === undefined) data.active = input.status === "ACTIVE";
      } else if (input.active !== undefined) {
        data.active = input.active;
        data.status = input.active ? "ACTIVE" : "INACTIVE";
      }

      const result = await prisma.staffMember.update({ where: { id }, data });
      return staffRecord(result);
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("STAFF_NOT_FOUND");
      }
      throw err;
    }
  }

  async delete(id: number): Promise<StaffMemberRecord> {
    try {
      const result = await prisma.staffMember.delete({ where: { id } });
      return staffRecord(result);
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("STAFF_NOT_FOUND");
      }
      throw err;
    }
  }

  async existsByTaxId(taxId: string, excludeId?: number): Promise<boolean> {
    const found = await prisma.staffMember.findFirst({
      where: {
        taxId,
        NOT: excludeId ? { id: excludeId } : undefined,
      },
      select: { id: true },
    });
    return found !== null;
  }
}

export class PrismaProjectStaffRepository implements ProjectStaffRepository {
  async create(input: CreateProjectStaffInput): Promise<ProjectStaffRecord> {
    const result = await prisma.projectStaff.create({
      data: {
        projectId: input.projectId,
        staffId: input.staffId,
        role: input.role ?? "OTRO",
        responsibility: input.responsibility,
        status: input.status ?? "ASSIGNED",
        startDate: input.startDate,
        endDate: input.endDate,
        notes: input.notes,
        supervisorId: input.supervisorId,
      },
    });
    return projectStaffRecord(result);
  }

  async listByProject(projectId: number): Promise<ProjectStaffDetail[]> {
    const rows = await prisma.projectStaff.findMany({
      where: { projectId },
      include: {
        staff: {
          select: { id: true, fullName: true, role: true, dayRate: true, status: true },
        },
        supervisor: {
          select: {
            id: true,
            staffId: true,
            staff: { select: { fullName: true, role: true } },
          },
        },
        _count: { select: { subordinates: true } },
      },
      orderBy: { assignedAt: "asc" },
    });
    return rows.map((row) => ({
      ...projectStaffRecord(row),
      staff: {
        id: row.staff.id,
        fullName: row.staff.fullName,
        role: row.staff.role as ProjectStaffDetail["staff"]["role"],
        dayRate: row.staff.dayRate,
        status: row.staff.status as ProjectStaffDetail["staff"]["status"],
      },
      supervisor: row.supervisor
        ? {
            id: row.supervisor.id,
            staffId: row.supervisor.staffId,
            fullName: row.supervisor.staff.fullName,
            role: row.supervisor.staff.role as ProjectStaffDetail["supervisor"] extends infer S
              ? S extends { role: infer R }
                ? R
                : never
              : never,
          }
        : null,
      subordinatesCount: row._count.subordinates,
    }));
  }

  async findById(id: number): Promise<ProjectStaffDetail | null> {
    const row = await prisma.projectStaff.findUnique({
      where: { id },
      include: {
        staff: {
          select: { id: true, fullName: true, role: true, dayRate: true, status: true },
        },
        supervisor: {
          select: {
            id: true,
            staffId: true,
            staff: { select: { fullName: true, role: true } },
          },
        },
        _count: { select: { subordinates: true } },
      },
    });
    if (!row) return null;
    return {
      ...projectStaffRecord(row),
      staff: {
        id: row.staff.id,
        fullName: row.staff.fullName,
        role: row.staff.role as ProjectStaffDetail["staff"]["role"],
        dayRate: row.staff.dayRate,
        status: row.staff.status as ProjectStaffDetail["staff"]["status"],
      },
      supervisor: row.supervisor
        ? {
            id: row.supervisor.id,
            staffId: row.supervisor.staffId,
            fullName: row.supervisor.staff.fullName,
            role: row.supervisor.staff.role as
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
              | "OTRO",
          }
        : null,
      subordinatesCount: row._count.subordinates,
    };
  }

  async update(id: number, input: UpdateProjectStaffInput): Promise<ProjectStaffRecord> {
    try {
      const data: prismaPkg.Prisma.ProjectStaffUpdateInput = {};
      if (input.role !== undefined) data.role = input.role;
      if (input.responsibility !== undefined) data.responsibility = input.responsibility;
      if (input.status !== undefined) data.status = input.status;
      if (input.startDate !== undefined) data.startDate = input.startDate;
      if (input.endDate !== undefined) data.endDate = input.endDate;
      if (input.notes !== undefined) data.notes = input.notes;
      if (input.supervisorId !== undefined) {
        data.supervisor =
          input.supervisorId === null
            ? { disconnect: true }
            : { connect: { id: input.supervisorId } };
      }
      const result = await prisma.projectStaff.update({ where: { id }, data });
      return projectStaffRecord(result);
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("PROJECT_STAFF_NOT_FOUND");
      }
      throw err;
    }
  }

  async delete(id: number): Promise<ProjectStaffRecord> {
    try {
      const result = await prisma.projectStaff.delete({ where: { id } });
      return projectStaffRecord(result);
    } catch (err) {
      if (isNotFoundError(err)) {
        throw new Error("PROJECT_STAFF_NOT_FOUND");
      }
      throw err;
    }
  }

  async existsStaffInProject(projectId: number, staffId: number): Promise<boolean> {
    const found = await prisma.projectStaff.findFirst({
      where: { projectId, staffId },
      select: { id: true },
    });
    return found !== null;
  }

  async staffExists(id: number): Promise<boolean> {
    const found = await prisma.staffMember.findUnique({ where: { id }, select: { id: true } });
    return found !== null;
  }

  async projectExists(id: number): Promise<boolean> {
    const found = await prisma.project.findUnique({ where: { id }, select: { id: true } });
    return found !== null;
  }

  async assignmentBelongsToProject(assignmentId: number, projectId: number): Promise<boolean> {
    const found = await prisma.projectStaff.findFirst({
      where: { id: assignmentId, projectId },
      select: { id: true },
    });
    return found !== null;
  }

  async staffHasActiveAssignments(staffId: number): Promise<boolean> {
    const found = await prisma.projectStaff.findFirst({
      where: { staffId },
      select: { id: true },
    });
    return found !== null;
  }

  async countActiveAssignmentsByStaff(): Promise<Map<number, number>> {
    const grouped = await prisma.projectStaff.groupBy({
      by: ["staffId"],
      _count: { _all: true },
    });
    const map = new Map<number, number>();
    for (const row of grouped) {
      map.set(row.staffId, row._count._all);
    }
    return map;
  }
}

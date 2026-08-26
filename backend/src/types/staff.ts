import type { StaffMember, ProjectStaff } from "@prisma/client";

export type StaffStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";

export type ProjectStaffStatus =
  | "ASSIGNED"
  | "ACTIVE"
  | "FINISHED"
  | "PAUSED";

export type StaffResponse = StaffMember & {
  activeAssignments: number;
};

export type StaffListResponse = StaffResponse[];

export type ProjectStaffResponse = ProjectStaff & {
  status: ProjectStaffStatus;
  staff: Pick<StaffMember, "id" | "fullName" | "role" | "dayRate" | "status">;
  supervisor: {
    id: number;
    staffId: number;
    fullName: string;
    role: StaffMember["role"];
  } | null;
  subordinatesCount: number;
};

export type ProjectStaffListResponse = ProjectStaffResponse[];

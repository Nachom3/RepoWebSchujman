export { StaffList } from "./components/StaffList/StaffList";
export { StaffForm } from "./components/StaffForm/StaffForm";
export { useStaff } from "./hooks/useStaff";
export { useProjectStaff } from "./hooks/useProjectStaff";
export {
  STAFF_ROLES,
  STAFF_ROLE_LABELS,
  STAFF_STATUSES,
  STAFF_STATUS_LABELS,
  STAFF_STATUS_VARIANTS,
  PROJECT_STAFF_STATUSES,
  PROJECT_STAFF_STATUS_LABELS,
  PROJECT_STAFF_STATUS_VARIANTS,
  staffRoleLabel,
  staffStatusLabel,
  staffStatusClass,
  projectStaffStatusLabel,
  projectStaffStatusClass,
  isStaffAvailable,
} from "./presentation";
export type {
  StaffMember,
  StaffRole,
  StaffStatus,
  ProjectStaffStatus,
  ProjectStaffAssignment,
  CreateStaffFormData,
  UpdateStaffFormData,
  CreateProjectStaffFormData,
  UpdateProjectStaffFormData,
} from "./types";

export {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getProjectStaff,
  assignProjectStaff,
  updateProjectStaff,
  removeProjectStaff,
} from "./services/staffService";

export { createProjectStaffSchema, updateProjectStaffSchema } from "./types";

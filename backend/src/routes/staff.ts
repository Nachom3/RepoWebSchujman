import { Router, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import {
  createStaffBodySchema,
  updateStaffBodySchema,
  listStaffQuerySchema,
  createProjectStaffBodySchema,
  updateProjectStaffBodySchema,
  type CreateStaffBody,
  type UpdateStaffBody,
  type ListStaffQuery,
  type CreateProjectStaffBody,
  type UpdateProjectStaffBody,
} from "../validation/staffSchemas";
import type { ApiErrorResponse } from "../types/auth";
import type {
  StaffListResponse,
  StaffResponse,
  ProjectStaffListResponse,
  ProjectStaffResponse,
} from "../types/staff";
import {
  AssignStaffToProjectUseCase,
  CreateStaffUseCase,
  DeleteStaffUseCase,
  DuplicateStaffTaxIdError,
  DuplicateProjectStaffError,
  GetStaffUseCase,
  ListProjectStaffUseCase,
  ListStaffUseCase,
  ProjectNotFoundForProjectStaffError,
  ProjectStaffNotFoundError,
  RemoveProjectStaffUseCase,
  StaffInUseError,
  StaffNotFoundError,
  StaffNotFoundForProjectError,
  SupervisorInOtherProjectError,
  UpdateProjectStaffUseCase,
  UpdateStaffUseCase,
} from "../features/staff/application/staffUseCases";
import {
  PrismaProjectStaffRepository,
  PrismaStaffRepository,
} from "../features/staff/infrastructure/prismaStaffRepository";

export const staffRouter = Router();

const staffRepository = new PrismaStaffRepository();
const projectStaffRepository = new PrismaProjectStaffRepository();

const createUseCase = new CreateStaffUseCase(staffRepository);
const listUseCase = new ListStaffUseCase(staffRepository);
const getUseCase = new GetStaffUseCase(staffRepository);
const updateUseCase = new UpdateStaffUseCase(staffRepository);
const deleteUseCase = new DeleteStaffUseCase(staffRepository);

const assignUseCase = new AssignStaffToProjectUseCase(projectStaffRepository);
const listProjectStaffUseCase = new ListProjectStaffUseCase(projectStaffRepository);
const updateProjectStaffUseCase = new UpdateProjectStaffUseCase(projectStaffRepository);
const removeProjectStaffUseCase = new RemoveProjectStaffUseCase(projectStaffRepository);

staffRouter.use(authenticateToken);
staffRouter.use(requireRole("ADMIN"));

function parseId(value: string): number | null {
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
}

function toStaffResponse(
  member: Awaited<ReturnType<ListStaffUseCase["execute"]>>[number],
  activeAssignments: number,
): StaffResponse {
  return {
    id: member.id,
    fullName: member.fullName,
    role: member.role,
    status: member.status,
    taxId: member.taxId,
    phone: member.phone,
    email: member.email,
    dayRate: member.dayRate,
    active: member.active,
    notes: member.notes,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
    activeAssignments,
  };
}

async function withAssignmentCounts(
  members: Awaited<ReturnType<ListStaffUseCase["execute"]>>,
): Promise<StaffResponse[]> {
  const counts = await projectStaffRepository.countActiveAssignmentsByStaff();
  return members.map((m) => toStaffResponse(m, counts.get(m.id) ?? 0));
}

staffRouter.post(
  "/",
  validateBody(createStaffBodySchema),
  async (
    req: Request<unknown, StaffResponse | ApiErrorResponse, CreateStaffBody>,
    res: Response<StaffResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const member = await createUseCase.execute(req.body);
      const [enriched] = await withAssignmentCounts([member]);
      res.status(201).json(enriched);
    } catch (err) {
      if (err instanceof DuplicateStaffTaxIdError) {
        res.status(409).json({ error: err.message });
        return;
      }
      console.error("[create staff]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

staffRouter.get(
  "/",
  async (
    req: Request<unknown, StaffListResponse | ApiErrorResponse, unknown, ListStaffQuery>,
    res: Response<StaffListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const queryResult = listStaffQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({ error: "Validation failed", details: queryResult.error.flatten() });
      return;
    }
    try {
      const list = await listUseCase.execute({
        active: queryResult.data.active,
        status: queryResult.data.status,
      });
      const enriched = await withAssignmentCounts(list);
      res.json(enriched);
    } catch (err) {
      console.error("[list staff]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

staffRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }, StaffResponse | ApiErrorResponse>,
    res: Response<StaffResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid staff ID" });
      return;
    }
    try {
      const member = await getUseCase.execute(id);
      const [enriched] = await withAssignmentCounts([member]);
      res.json(enriched);
    } catch (err) {
      if (err instanceof StaffNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[get staff]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

staffRouter.patch(
  "/:id",
  validateBody(updateStaffBodySchema),
  async (
    req: Request<{ id: string }, StaffResponse | ApiErrorResponse, UpdateStaffBody>,
    res: Response<StaffResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid staff ID" });
      return;
    }
    try {
      const member = await updateUseCase.execute(id, req.body);
      const [enriched] = await withAssignmentCounts([member]);
      res.json(enriched);
    } catch (err) {
      if (err instanceof StaffNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err instanceof DuplicateStaffTaxIdError) {
        res.status(409).json({ error: err.message });
        return;
      }
      console.error("[update staff]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

staffRouter.delete(
  "/:id",
  requireRole("ADMIN"),
  async (
    req: Request<{ id: string }, StaffResponse | ApiErrorResponse>,
    res: Response<StaffResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid staff ID" });
      return;
    }
    try {
      const member = await deleteUseCase.execute(id);
      res.json({ ...member, activeAssignments: 0 });
    } catch (err) {
      if (err instanceof StaffNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err instanceof StaffInUseError) {
        res.status(409).json({ error: err.message });
        return;
      }
      console.error("[delete staff]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// ---------------------------------------------------------------------------
// Project staff assignments: nested under /projects/:projectId/staff
// ---------------------------------------------------------------------------
export const projectStaffRouter = Router({ mergeParams: true });

projectStaffRouter.use(authenticateToken);

function toProjectStaffResponse(
  detail: Awaited<ReturnType<ListProjectStaffUseCase["execute"]>>[number],
): ProjectStaffResponse {
  return {
    id: detail.id,
    projectId: detail.projectId,
    staffId: detail.staffId,
    role: detail.role,
    responsibility: detail.responsibility,
    status: detail.status,
    startDate: detail.startDate,
    endDate: detail.endDate,
    notes: detail.notes,
    supervisorId: detail.supervisorId,
    assignedAt: detail.assignedAt,
    staff: detail.staff,
    supervisor: detail.supervisor
      ? {
          id: detail.supervisor.id,
          staffId: detail.supervisor.staffId,
          fullName: detail.supervisor.fullName,
          role: detail.supervisor.role,
        }
      : null,
    subordinatesCount: detail.subordinatesCount,
  };
}

function dateOrNull(value: string | undefined): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === "" || value === null) return null;
  return new Date(value);
}

projectStaffRouter.get(
  "/",
  async (
    req: Request<{ projectId: string }, ProjectStaffListResponse | ApiErrorResponse>,
    res: Response<ProjectStaffListResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const projectId = parseId(req.params.projectId);
    if (projectId === null) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }
    try {
      const list = await listProjectStaffUseCase.execute(projectId);
      res.json(list.map(toProjectStaffResponse));
    } catch (err) {
      if (err instanceof ProjectNotFoundForProjectStaffError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[list project staff]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

projectStaffRouter.post(
  "/",
  requireRole("ADMIN"),
  validateBody(createProjectStaffBodySchema),
  async (
    req: Request<
      { projectId: string },
      ProjectStaffResponse | ApiErrorResponse,
      CreateProjectStaffBody
    >,
    res: Response<ProjectStaffResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const projectId = parseId(req.params.projectId);
    if (projectId === null) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }
    try {
      const detail = await assignUseCase.execute({
        projectId,
        staffId: req.body.staffId,
        role: req.body.role,
        responsibility: req.body.responsibility,
        status: req.body.status,
        startDate: dateOrNull(req.body.startDate),
        endDate: dateOrNull(req.body.endDate),
        notes: req.body.notes,
        supervisorId: req.body.supervisorId,
      });
      const fullDetail = await listProjectStaffUseCase.execute(projectId);
      const created = fullDetail.find((d) => d.id === detail.id);
      if (!created) {
        res.status(201).json(toProjectStaffResponse({ ...detail, staff: { id: 0, fullName: "", role: "OTRO", dayRate: 0, status: "ACTIVE" }, supervisor: null, subordinatesCount: 0 }));
        return;
      }
      res.status(201).json(toProjectStaffResponse(created));
    } catch (err) {
      if (err instanceof ProjectNotFoundForProjectStaffError) {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err instanceof StaffNotFoundForProjectError) {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err instanceof DuplicateProjectStaffError) {
        res.status(409).json({ error: err.message });
        return;
      }
      if (err instanceof SupervisorInOtherProjectError) {
        res.status(400).json({ error: err.message });
        return;
      }
      console.error("[assign project staff]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

projectStaffRouter.patch(
  "/:assignmentId",
  requireRole("ADMIN"),
  validateBody(updateProjectStaffBodySchema),
  async (
    req: Request<
      { projectId: string; assignmentId: string },
      ProjectStaffResponse | ApiErrorResponse,
      UpdateProjectStaffBody
    >,
    res: Response<ProjectStaffResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const projectId = parseId(req.params.projectId);
    const assignmentId = parseId(req.params.assignmentId);
    if (projectId === null || assignmentId === null) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    try {
      const updated = await updateProjectStaffUseCase.execute(assignmentId, {
        role: req.body.role,
        responsibility: req.body.responsibility,
        status: req.body.status,
        startDate: dateOrNull(req.body.startDate),
        endDate: dateOrNull(req.body.endDate),
        notes: req.body.notes,
        supervisorId: req.body.supervisorId,
      });
      const detail = await projectStaffRepository.findById(updated.id);
      if (!detail) {
        res.status(404).json({ error: "Assignment not found" });
        return;
      }
      res.json(toProjectStaffResponse(detail));
    } catch (err) {
      if (err instanceof ProjectStaffNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err instanceof SupervisorInOtherProjectError) {
        res.status(400).json({ error: err.message });
        return;
      }
      console.error("[update project staff]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

projectStaffRouter.delete(
  "/:assignmentId",
  requireRole("ADMIN"),
  async (
    req: Request<{ projectId: string; assignmentId: string }, ProjectStaffResponse | ApiErrorResponse>,
    res: Response<ProjectStaffResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const assignmentId = parseId(req.params.assignmentId);
    if (assignmentId === null) {
      res.status(400).json({ error: "Invalid assignment ID" });
      return;
    }
    try {
      const removed = await removeProjectStaffUseCase.execute(assignmentId);
      const detail = await projectStaffRepository.findById(removed.id);
      if (!detail) {
        res.status(404).json({ error: "Assignment not found" });
        return;
      }
      res.json(toProjectStaffResponse(detail));
    } catch (err) {
      if (err instanceof ProjectStaffNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      console.error("[remove project staff]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

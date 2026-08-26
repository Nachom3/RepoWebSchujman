export type ProjectType =
  | "VIVIENDA"
  | "LOCAL_COMERCIAL"
  | "AMPLIACION"
  | "REMODELACION"
  | "EDIFICIO"
  | "GALPON"
  | "OTRO";

export type ProjectStatus =
  | "PENDIENTE"
  | "EN_CURSO"
  | "PAUSADA"
  | "FINALIZADA"
  | "CANCELADA";

export type ProjectSummary = {
  id: number;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  address: string | null;
  progressPercent: number;
  clientId: number;
  estimatedStart: Date | null;
  estimatedEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectDetail = ProjectSummary & {
  description: string | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  client: { id: number; name: string; taxId: string | null };
};

export type CreateProjectInput = {
  name: string;
  type?: ProjectType;
  status?: ProjectStatus;
  description?: string;
  address?: string;
  clientId: number;
  estimatedStart?: Date | null;
  estimatedEnd?: Date | null;
};

export type UpdateProjectInput = Partial<Omit<CreateProjectInput, "clientId">> & {
  progressPercent?: number;
};

export type ListProjectsInput = {
  status?: ProjectStatus;
  clientId?: number;
};

export type ProjectsRepository = {
  create(input: CreateProjectInput): Promise<ProjectSummary>;
  list(input: ListProjectsInput): Promise<ProjectSummary[]>;
  findDetail(id: number): Promise<ProjectDetail | null>;
  findById(id: number): Promise<ProjectSummary | null>;
  update(id: number, input: UpdateProjectInput): Promise<ProjectSummary>;
  delete(id: number): Promise<ProjectSummary>;
  clientExists(id: number): Promise<boolean>;
};

export class ProjectNotFoundError extends Error {
  constructor() {
    super("Project not found");
  }
}

export class ClientForProjectNotFoundError extends Error {
  constructor() {
    super("Client not found");
  }
}

export class CreateProjectUseCase {
  constructor(private readonly projects: ProjectsRepository) {}

  async execute(input: CreateProjectInput): Promise<ProjectSummary> {
    const exists = await this.projects.clientExists(input.clientId);
    if (!exists) {
      throw new ClientForProjectNotFoundError();
    }
    return this.projects.create(input);
  }
}

export class ListProjectsUseCase {
  constructor(private readonly projects: ProjectsRepository) {}

  execute(input: ListProjectsInput): Promise<ProjectSummary[]> {
    return this.projects.list(input);
  }
}

export class GetProjectDetailUseCase {
  constructor(private readonly projects: ProjectsRepository) {}

  async execute(id: number): Promise<ProjectDetail> {
    const project = await this.projects.findDetail(id);
    if (!project) {
      throw new ProjectNotFoundError();
    }
    return project;
  }
}

export class UpdateProjectUseCase {
  constructor(private readonly projects: ProjectsRepository) {}

  async execute(id: number, input: UpdateProjectInput): Promise<ProjectSummary> {
    try {
      return await this.projects.update(id, input);
    } catch {
      throw new ProjectNotFoundError();
    }
  }
}

export class DeleteProjectUseCase {
  constructor(private readonly projects: ProjectsRepository) {}

  async execute(id: number): Promise<ProjectSummary> {
    try {
      return await this.projects.delete(id);
    } catch {
      throw new ProjectNotFoundError();
    }
  }
}
